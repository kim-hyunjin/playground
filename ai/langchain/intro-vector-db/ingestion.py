"""
벡터 데이터베이스 데이터 수집 모듈

이 파일은 텍스트 파일을 로드하고, 청크로 분할한 후, 
OpenAI 임베딩을 생성하여 Pinecone 벡터 데이터베이스에 저장하는 과정을 구현합니다.
이는 검색 증강 생성(RAG) 시스템의 데이터 준비 단계입니다.
"""

from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
import os

# 환경 변수 로드 (.env 파일에서 API 키 등을 가져옴)
load_dotenv()

if __name__ == '__main__':
    print("Ingesting...")
    # 임베딩 과정 설명:
    # input - text (텍스트 입력)
    # blackbox (Embedding model) (임베딩 모델이 블랙박스처럼 작동)
    # output - vector (벡터 출력)

    # 현재 파일의 디렉토리 경로 가져오기
    current_directory = os.path.dirname(os.path.abspath(__file__))
    # 텍스트 파일 경로 설정
    textfile = os.path.join(current_directory, 'medium-blog1.txt')

    # TextLoader를 사용하여 텍스트 파일 로드
    loader = TextLoader(textfile)
    document = loader.load()

    print("Splitting...")
    # 텍스트를 1000자 크기의 청크로 분할 (중복 없음)
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_documents(document)
    print(f"created {len(texts)} chunks")

    # OpenAI 임베딩 모델 초기화
    embeddings = OpenAIEmbeddings()
    
    # 분할된 텍스트를 임베딩하여 Pinecone 벡터 스토어에 저장
    # 환경 변수에서 INDEX_NAME을 가져와 사용
    PineconeVectorStore.from_documents(texts, embeddings, index_name=os.environ["INDEX_NAME"])
    print("finish")