"""
PDF 채팅 애플리케이션 - API 모듈

이 모듈은 데이터베이스의 대화 및 메시지와 상호작용하기 위한 API 함수를 제공합니다.
메시지 검색 및 저장과 대화 컴포넌트(LLM, 검색기, 메모리) 관리를 처리합니다.
이러한 함수들은 채팅 시스템과 데이터베이스 사이의 인터페이스 역할을 합니다.
"""

from typing import Dict, List  # 타입 힌트를 위한 라이브러리
from langchain.schema.messages import AIMessage, HumanMessage, SystemMessage  # LangChain 메시지 타입
from app.web.db import db  # 데이터베이스 연결
from app.web.db.models import Message  # 메시지 모델
from app.web.db.models.conversation import Conversation  # 대화 모델


def get_messages_by_conversation_id(
    conversation_id: str,
) -> List[AIMessage | HumanMessage | SystemMessage]:
    """
    주어진 conversation_id에 속하는 모든 메시지를 검색합니다.
    
    이 함수는 지정된 대화와 관련된 메시지를 데이터베이스에서 쿼리하고
    LangChain 메시지 객체로 변환합니다.
    
    Args:
        conversation_id (str): 대화의 고유 식별자
        
    Returns:
        List[AIMessage | HumanMessage | SystemMessage]: LangChain 메시지 객체 목록
    """
    # 이 대화의 메시지를 생성 시간순으로 데이터베이스에서 쿼리
    messages = (
        db.session.query(Message)
        .filter_by(conversation_id=conversation_id)
        .order_by(Message.created_on.desc())
    )
    
    # 각 데이터베이스 메시지를 LangChain 메시지 객체로 변환
    return [message.as_lc_message() for message in messages]


def add_message_to_conversation(
    conversation_id: str, role: str, content: str
) -> Message:
    """
    지정된 대화에 새 메시지를 생성하고 저장합니다.
    
    이 함수는 주어진 역할과 내용으로 새 메시지를 생성하고,
    지정된 대화와 연결한 다음 데이터베이스에 저장합니다.
    
    Args:
        conversation_id (str): 대화의 고유 식별자
        role (str): 메시지 발신자의 역할(예: "user", "assistant", "system")
        content (str): 메시지의 텍스트 내용
        
    Returns:
        Message: 생성된 메시지 객체
    """
    # 데이터베이스에 새 메시지 생성
    return Message.create(
        conversation_id=conversation_id,
        role=role,
        content=content,
    )


def get_conversation_components(conversation_id: str) -> Dict[str, str]:
    """
    Retrieves the components used in a conversation.
    
    This function finds the conversation with the specified ID and returns
    a dictionary containing the names of the LLM, retriever, and memory components.
    
    Args:
        conversation_id (str): The unique identifier of the conversation
        
    Returns:
        Dict[str, str]: A dictionary with keys "llm", "retriever", and "memory"
    """
    # Find the conversation in the database
    conversation = Conversation.find_by(id=conversation_id)
    
    # Return a dictionary of the components used by this conversation
    return {
        "llm": conversation.llm,
        "retriever": conversation.retriever,
        "memory": conversation.memory,
    }


def set_conversation_components(
    conversation_id: str, llm: str, retriever: str, memory: str
) -> None:
    """
    Updates the components used by a conversation.
    
    This function finds the conversation with the specified ID and updates
    the names of the LLM, retriever, and memory components.
    
    Args:
        conversation_id (str): The unique identifier of the conversation
        llm (str): The name of the language model to use
        retriever (str): The name of the retriever to use
        memory (str): The name of the memory to use
        
    Returns:
        None
    """
    # Find the conversation in the database
    conversation = Conversation.find_by(id=conversation_id)
    
    # Update the conversation with the new component names
    conversation.update(llm=llm, retriever=retriever, memory=memory)
