"""
PDF 문서를 활용한 검색 증강 생성(RAG) 예제

이 파일은 PDF 문서를 로드하고, 청크로 분할한 후, 
OpenAI 임베딩을 생성하여 FAISS 벡터 데이터베이스에 저장하고,
이를 기반으로 RAG 시스템을 구현하는 예제입니다.
"""

import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, OpenAI
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain import hub
# FAISS는 Facebook AI Research에서 개발한 효율적인 벡터 검색 라이브러리
# https://faiss.ai/
from langchain_community.vectorstores import FAISS

# 환경 변수 로드 (.env 파일에서 API 키 등을 가져옴)
load_dotenv()

if __name__ == "__main__":
    print("hi")
    # 현재 파일의 디렉토리 경로 가져오기
    current_directory = os.path.dirname(os.path.abspath(__file__))
    # PDF 파일 경로 설정
    pdf_path = os.path.join(current_directory, 'react-paper.pdf')
    
    # PyPDFLoader를 사용하여 PDF 파일 로드
    loader = PyPDFLoader(file_path=pdf_path)
    documents = loader.load()
    
    # 텍스트를 1000자 크기의 청크로 분할 (30자 중복, 줄바꿈 기준)
    text_splitter = CharacterTextSplitter(
        chunk_size=1000, chunk_overlap=30, separator="\n"
    )
    docs = text_splitter.split_documents(documents=documents)

    # OpenAI 임베딩 모델 초기화
    embeddings = OpenAIEmbeddings()
    
    # 분할된 텍스트를 임베딩하여 FAISS 벡터 스토어에 저장
    vectorstore = FAISS.from_documents(docs, embeddings)
    
    # FAISS 인덱스를 로컬 파일로 저장
    vectorstore.save_local("faiss_index_react")

    # 저장된 FAISS 인덱스를 로드
    # allow_dangerous_deserialization=True는 보안 위험이 있지만 예제에서는 필요
    new_vectorstore = FAISS.load_local(
        "faiss_index_react", embeddings, allow_dangerous_deserialization=True
    )

    # LangChain Hub에서 검색 QA 채팅 프롬프트 가져오기
    retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    
    # 문서 결합 체인 생성 (검색된 문서들을 프롬프트에 삽입)
    # OpenAI 모델 사용 (ChatOpenAI 대신 기본 OpenAI 모델 사용)
    combine_docs_chain = create_stuff_documents_chain(
        OpenAI(), retrieval_qa_chat_prompt
    )
    
    # 검색 체인 생성 (벡터 스토어에서 문서 검색 후 문서 결합 체인으로 전달)
    retrieval_chain = create_retrieval_chain(
        new_vectorstore.as_retriever(), combine_docs_chain
    )

    # 검색 체인 실행 - ReAct 논문의 핵심 내용을 3문장으로 요약 요청
    res = retrieval_chain.invoke({"input": "Give me the gist of ReAct in 3 sentences"})
    
    # 결과 출력 (answer 키에 응답이 저장됨)
    print(res["answer"])