"""
PDF 채팅 애플리케이션 - 채팅 빌더 모듈

이 모듈은 PDF 콘텐츠와 상호작용할 수 있는 채팅 시스템을 구축하기 위한 함수를 제공합니다.
동적으로 컴포넌트(검색기, 언어 모델, 메모리)를 선택하고
PDF 문서에 대한 질문에 답변할 수 있는 StreamingConversationalRetrievalChain을 생성합니다.
"""

import random  # 컴포넌트 랜덤 선택을 위한 라이브러리
from langchain.chat_models import ChatOpenAI  # 채팅 모델 생성을 위한 라이브러리
from app.chat.models import ChatArgs  # 타입 정의를 위한 라이브러리
from app.chat.vector_stores import retriever_map  # 사용 가능한 검색기 맵
from app.chat.llms import llm_map  # 사용 가능한 언어 모델 맵
from app.chat.memories import memory_map  # 사용 가능한 메모리 유형 맵
from app.chat.chains.retrieval import StreamingConversationalRetrievalChain  # 스트리밍 응답을 위한 사용자 정의 체인
from app.web.api import set_conversation_components, get_conversation_components  # 컴포넌트 선택 유지를 위한 함수
from app.chat.score import random_component_by_score  # 점수 기반 컴포넌트 선택을 위한 함수


def build_chat(chat_args: ChatArgs):
    """
    PDF 콘텐츠와 채팅하기 위한 대화형 검색 체인을 구축합니다.
    
    이 함수는 대화 기록 또는 점수에 따른 가중치 랜덤 선택을 기반으로
    적절한 검색기, 언어 모델 및 메모리 컴포넌트를 선택합니다. 그런 다음
    이러한 컴포넌트로 StreamingConversationalRetrievalChain을 생성합니다.
    
    Args:
        chat_args (ChatArgs): conversation_id, pdf_id, metadata 및 
                             streaming 플래그를 포함하는 객체.

    Returns:
        StreamingConversationalRetrievalChain: PDF에 대한 질문에 답변할 수 있는 체인

    사용 예시:
        chain = build_chat(chat_args)
    """
    # 검색기, 언어 모델 및 메모리 컴포넌트 선택
    retriever_name, retriever = select_component("retriever", retriever_map, chat_args)
    llm_name, llm = select_component("llm", llm_map, chat_args)
    memory_name, memory = select_component("memory", memory_map, chat_args)
    
    # 선택된 컴포넌트 로깅
    print(f"build chat with {retriever_name} / {llm_name} / {memory_name}")
    
    # 이 대화를 위해 선택된 컴포넌트 저장
    set_conversation_components(
        conversation_id=chat_args.conversation_id,
        llm=llm_name,
        retriever=retriever_name,
        memory=memory_name,
    )

    # 질문 압축을 위한 별도의 비스트리밍 LLM 생성
    # 대화 기록과 현재 사용자 질문을 요약할 때(condense_question_llm),
    # 스트림이 조기에 종료되는 것을 방지하기 위해 비스트리밍 모델을 사용합니다
    # 이는 후속 LLM에서 스트리밍을 사용해야 하기 때문에 필요합니다
    condense_question_llm = ChatOpenAI(streaming=False)

    # 대화형 검색 체인 생성 및 반환
    return StreamingConversationalRetrievalChain.from_llm(
        llm=llm,  # 주요 언어 모델(스트리밍)
        condense_question_llm=condense_question_llm,  # 질문 압축을 위한 모델(비스트리밍)
        memory=memory,  # 대화 기록을 저장하기 위한 메모리 컴포넌트
        retriever=retriever,  # 관련 PDF 콘텐츠를 가져오기 위한 검색기
        metadata=chat_args.metadata,  # 추가 메타데이터
    )


def select_component(component_type, component_map, chat_args):
    """
    채팅을 위한 컴포넌트(검색기, llm 또는 메모리)를 선택합니다.
    
    이 함수는 대화에 대해 이전에 선택된 컴포넌트를 사용하거나
    컴포넌트 점수를 기반으로 새로운 컴포넌트를 무작위로 선택합니다.
    
    Args:
        component_type (str): 선택할 컴포넌트 유형("retriever", "llm" 또는 "memory")
        component_map (dict): 컴포넌트 이름과 빌더 함수의 매핑
        chat_args (ChatArgs): conversation_id를 포함하는 채팅 인수
        
    Returns:
        tuple: (component_name, component_instance)를 포함하는 튜플
    """
    # 이 대화에 대해 이전에 선택된 컴포넌트 가져오기
    components = get_conversation_components(chat_args.conversation_id)
    previous_component = components[component_type]

    # 이 대화에 대해 이전에 컴포넌트가 선택되었다면 그것을 사용
    if previous_component:
        builder = component_map[previous_component]
        return previous_component, builder(chat_args)
    # 그렇지 않으면 점수를 기반으로 컴포넌트를 무작위로 선택
    else:
        random_name = random_component_by_score(component_type, component_map)
        builder = component_map[random_name]
        return random_name, builder(chat_args)
