"""
LangChain 임베딩 및 벡터 저장소 예제

이 스크립트는 텍스트 문서에서 임베딩을 생성하고 벡터 데이터베이스에 저장하는 방법을 보여줍니다.
파일에서 텍스트를 로드하고, 청크로 분할하고, OpenAI를 사용하여 임베딩을 생성하고,
나중에 검색할 수 있도록 Chroma 벡터 데이터베이스에 저장합니다.
"""

# 필요한 라이브러리 가져오기
from langchain.document_loaders import TextLoader  # 텍스트 문서 로드를 위한 라이브러리
from langchain.text_splitter import CharacterTextSplitter  # 텍스트를 청크로 분할하기 위한 라이브러리
from langchain.embeddings import OpenAIEmbeddings  # OpenAI로 임베딩 생성을 위한 라이브러리
from langchain.vectorstores.chroma import Chroma  # 벡터 데이터베이스에 임베딩 저장을 위한 라이브러리
from dotenv import load_dotenv  # 환경 변수 로드를 위한 라이브러리

# .env 파일에서 환경 변수 로드 (OPENAI_API_KEY 포함)
load_dotenv()

# OpenAI 임베딩 모델 초기화
embeddings = OpenAIEmbeddings()

"""
단일 쿼리에 대한 임베딩을 생성하고 확인하는 예시:
emb = embeddings.embed_query("안녕하세요")
print(emb)
"""

# 문서를 관리 가능한 청크로 나누는 텍스트 분할기 생성
# 이는 최대 청크 크기 200자와 중복 없이 줄바꿈에서 텍스트를 분할합니다
text_splitter = CharacterTextSplitter(separator="\n", chunk_size=200, chunk_overlap=0)

# 파일에서 텍스트 문서 로드
loader = TextLoader("facts.txt")

# 텍스트 분할기를 사용하여 문서를 로드하고 청크로 분할
docs = loader.load_and_split(text_splitter=text_splitter)

# 문서 청크에서 Chroma 벡터 데이터베이스 생성
# 이는 OpenAI의 API를 사용하여 각 청크에 대한 임베딩을 계산하고 (비용은 페니의 일부)
# "emb"라는 영구 디렉토리에 저장합니다
db = Chroma.from_documents(
    docs,  # 임베딩할 문서 청크
    embedding=embeddings,  # 사용할 임베딩 모델
    persist_directory="emb",  # 데이터베이스를 저장할 디렉토리
)
