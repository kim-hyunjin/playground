"""
PDF 임베딩 생성기 모듈

이 모듈은 PDF 문서에 대한 임베딩을 생성하고 저장하는 기능을 제공합니다.
이러한 임베딩은 채팅 애플리케이션에서 PDF 콘텐츠의 의미론적 검색 및 검색을 가능하게 합니다.
"""

from langchain.document_loaders import PyPDFLoader  # PDF 파일 로드 및 파싱을 위한 라이브러리
from langchain.text_splitter import RecursiveCharacterTextSplitter  # 텍스트를 청크로 분할하기 위한 라이브러리
from app.chat.vector_stores.pinecone import vector_store  # 임베딩 저장을 위한 벡터 저장소


def create_embeddings_for_pdf(pdf_id: str, pdf_path: str):
    """
    주어진 PDF 문서에 대한 임베딩을 생성하고 저장합니다.

    이 함수는 다음 단계를 수행합니다:
    1. 지정된 PDF에서 텍스트를 추출합니다.
    2. 추출된 텍스트를 관리 가능한 청크로 나눕니다.
    3. 각 청크에 대한 임베딩을 생성합니다.
    4. 생성된 임베딩을 벡터 저장소에 저장합니다.

    Args:
        pdf_id (str): PDF의 고유 식별자.
        pdf_path (str): PDF의 파일 경로.

    사용 예시:
        create_embeddings_for_pdf('123456', '/path/to/pdf')
    """
    # 특정 청크 크기와 중복 설정으로 텍스트 분할기 생성
    # 500자 크기의 청크와 100자 중복은 청크 간의 컨텍스트 유지에 도움이 됩니다
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)

    # PDF를 로드하고 문서 청크로 분할
    loader = PyPDFLoader(pdf_path)
    docs = loader.load_and_split(text_splitter)

    # 각 문서 청크에 메타데이터 추가
    # 이 메타데이터는 임베딩과 함께 저장되고 검색 중에 사용됩니다
    for doc in docs:
        doc.metadata = {
            "page": doc.metadata["page"],  # PDF의 페이지 번호
            "text": doc.page_content,      # 실제 텍스트 내용
            "pdf_id": pdf_id,              # 검색 중 필터링을 위한 PDF 식별자
        }

    # 벡터 저장소에 문서 추가
    # 참고: 임베딩 생성 과정은 PDF 크기와 사용된 임베딩 모델에 따라
    # 상당한 시간이 소요될 수 있습니다
    vector_store.add_documents(docs)
