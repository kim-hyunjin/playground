"""
벡터 데이터베이스를 활용한 검색 증강 생성(RAG) 예제

이 파일은 Pinecone 벡터 데이터베이스와 LangChain을 사용하여 
검색 증강 생성(Retrieval-Augmented Generation, RAG) 시스템을 구현하는 예제입니다.
사용자 질의에 대해 벡터 데이터베이스에서 관련 정보를 검색하고 LLM을 통해 응답을 생성합니다.
"""

import os

from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_pinecone import PineconeVectorStore

from langchain import hub
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain


# 환경 변수 로드 (.env 파일에서 API 키 등을 가져옴)
load_dotenv()

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

    # 간단한 LLM 체인 예제 (현재는 주석 처리됨)
    # chain = PromptTemplate.from_template(template=query) | llm
    # result = chain.invoke(input={})
    # print(result.content)

    """
    LangChain Hub에서 가져온 retrieval-qa-chat 프롬프트 구조:
    https://smith.langchain.com/hub/langchain-ai/retrieval-qa-chat
    
    SYSTEM
    Answer any use questions based solely on the context below:

    <context>
    {context}
    </context>
    
    PLACEHOLDER
    chat_history
    
    HUMAN
    {input}
    """
    # LangChain Hub에서 검색 QA 채팅 프롬프트 가져오기
    retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    
    # 문서 결합 체인 생성 (검색된 문서들을 프롬프트에 삽입)
    combine_docs_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)
    
    # 검색 체인 생성 (벡터 스토어에서 문서 검색 후 문서 결합 체인으로 전달)
    retrieval_chain = create_retrieval_chain(
        retriever=vector_store.as_retriever(),
        combine_docs_chain=combine_docs_chain
    )

    # 검색 체인 실행 및 결과 출력
    result = retrieval_chain.invoke(input={"input": query})
    print(result)

