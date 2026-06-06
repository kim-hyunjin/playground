"""
커스텀 프롬프트를 활용한 검색 증강 생성(RAG) 예제

이 파일은 사용자 정의 프롬프트 템플릿을 사용하여 RAG 시스템을 구현하는 예제입니다.
Pinecone 벡터 데이터베이스에서 관련 정보를 검색하고, 
커스텀 프롬프트를 통해 LLM에게 특정 형식과 스타일로 응답하도록 지시합니다.
"""

import os

from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_pinecone import PineconeVectorStore

# 환경 변수 로드 (.env 파일에서 API 키 등을 가져옴)
load_dotenv()


def format_docs(docs):
    """
    검색된 문서들을 하나의 문자열로 결합하는 함수
    
    Args:
        docs: 검색된 문서 객체 리스트
        
    Returns:
        str: 문서 내용을 결합한 문자열
    """
    return "\n\n".join(doc.page_content for doc in docs)

"""
https://wikidocs.net/231393

RAG(Retrieval-Augmented Generation) 파이프라인은 기존의 언어 모델에 검색 기능을 추가하여, 
주어진 질문이나 문제에 대해 더 정확하고 풍부한 정보를 기반으로 답변을 생성할 수 있게 해줍니다. 
이 파이프라인은 크게 데이터 로드, 텍스트 분할, 인덱싱, 검색, 생성의 다섯 단계로 구성됩니다. 
"""
if __name__ == '__main__':
    print("Retrieving...")
    # 테스트 질의 설정
    query = "What is Pinecone in machine learning?"

    # LLM 모델 및 임베딩 모델 초기화
    llm = ChatOpenAI()
    embeddings = OpenAIEmbeddings()
    
    # Pinecone 벡터 스토어 연결
    # 환경 변수에서 INDEX_NAME을 가져와 사용
    vector_store = PineconeVectorStore(
        index_name=os.environ["INDEX_NAME"], embedding=embeddings
    )

    # 커스텀 RAG 프롬프트 템플릿 정의
    # 이 템플릿은 LLM에게 다음과 같은 지시를 제공:
    # 1. 주어진 컨텍스트만 사용하여 질문에 답변
    # 2. 모르는 경우 모른다고 답변
    # 3. 최대 3문장으로 간결하게 답변
    # 4. 답변 끝에 "Thanks for asking!" 추가
    template = """
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    User three sentences maximum and keep the answer as concise as possible.
    Always say "Thanks for asking!" at the end of the answer.
    Answer any use questions based solely on the context below:
    
    {context}
    
    Question: {question}
    
    Helpful Answer:
    """
    # 프롬프트 템플릿 객체 생성
    custom_rag_prompt = PromptTemplate.from_template(template=template)
    
    # RAG 체인 구성:
    # 1. 벡터 스토어에서 문서 검색 후 format_docs 함수로 포맷팅 (context)
    # 2. 입력 쿼리를 그대로 전달 (question)
    # 3. 커스텀 프롬프트 템플릿 적용
    # 4. LLM으로 응답 생성
    rag_chain = (
            {"context": vector_store.as_retriever() | format_docs, "question": RunnablePassthrough()}
            | custom_rag_prompt | llm
    )
    
    # RAG 체인 실행 및 결과 출력
    result = rag_chain.invoke(query)
    print(result)
