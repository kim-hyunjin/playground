"""
LangChain 검색 기반 질의응답 예제

이 스크립트는 벡터 저장소를 사용한 검색 기반 질의응답 방법을 보여줍니다.
Chroma 벡터 데이터베이스를 로드하고, 중복 문서를 필터링하는 사용자 정의 검색기를 생성하고,
검색된 문서를 기반으로 질문에 답변하는 RetrievalQA 체인을 설정합니다.
"""

# 필요한 라이브러리 가져오기
from dotenv import load_dotenv  # 환경 변수 로드를 위한 라이브러리
from langchain.vectorstores.chroma import Chroma  # 벡터 데이터베이스 접근을 위한 라이브러리
from langchain.embeddings import OpenAIEmbeddings  # 임베딩 생성을 위한 라이브러리
from langchain.chains import RetrievalQA  # 검색 기반 질의응답을 위한 라이브러리
from langchain.chat_models import ChatOpenAI  # 언어 모델을 위한 라이브러리
from redundant_filter_retriever import RedundantFilterRetriever  # 사용자 정의 검색기

# .env 파일에서 환경 변수 로드 (OPENAI_API_KEY 포함)
load_dotenv()

# ChatOpenAI 모델 초기화
chat = ChatOpenAI()

# OpenAI 임베딩 모델 초기화
embeddings = OpenAIEmbeddings()

# 영구 디렉토리에서 Chroma 벡터 데이터베이스 로드
db = Chroma(persist_directory="emb", embedding_function=embeddings)

# 중복 문서를 필터링하는 사용자 정의 검색기 생성
retriever = RedundantFilterRetriever(embeddings=embeddings, chroma=db)

"""
검색기 설명:
- 검색기는 다양한 데이터베이스를 지원하기 위한 인터페이스입니다
- 주어진 문자열에 대해 관련 문서를 반환하는 get_relevant_documents 함수를 가지고 있습니다
- RedundantFilterRetriever는 중복 문서를 필터링하는 사용자 정의 구현입니다
"""

# RetrievalQA 체인 생성
chain = RetrievalQA.from_chain_type(
    llm=chat,  # 사용할 언어 모델
    retriever=retriever,  # 관련 문서를 가져오기 위한 검색기
    chain_type="stuff",  # 체인 유형 - "stuff"는 벡터 저장소에서 컨텍스트를 가져와 프롬프트에 넣는 것을 의미합니다
)

# 영어 언어에 관한 흥미로운 사실에 대한 질문으로 체인 실행
result = chain.run("영어 언어에 관한 흥미로운 사실은 무엇인가요?")

# 결과 출력
print(result)
