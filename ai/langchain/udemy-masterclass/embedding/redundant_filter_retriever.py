"""
중복 문서 필터링을 위한 사용자 정의 검색기

이 모듈은 LangChain의 BaseRetriever를 확장하여 벡터 저장소에서 검색할 때
중복되거나 유사한 문서를 필터링하는 사용자 정의 검색기를 정의합니다.
결과에서 관련성과 다양성의 균형을 맞추기 위해 최대 한계 관련성(MMR)을 사용합니다.
"""

from typing import Any, Coroutine, Dict, List  # 타입 힌트를 위한 라이브러리
from langchain.embeddings.base import Embeddings  # 임베딩의 기본 클래스
from langchain.vectorstores.chroma import Chroma  # Chroma 벡터 저장소
from langchain.schema import BaseRetriever  # 검색기의 기본 클래스
from langchain_core.documents import Document  # 반환된 문서를 위한 Document 클래스


class RedundantFilterRetriever(BaseRetriever):
    """
    검색 결과에서 중복 문서를 필터링하는 사용자 정의 검색기.
    
    이 검색기는 최대 한계 관련성(MMR)을 사용하여 쿼리와 관련성이 높으면서도
    이미 선택된 문서와 비교하여 다양한 문서를 선택합니다. 이는
    검색된 문서의 중복성을 줄이는 데 도움이 됩니다.
    
    속성:
        embeddings (Embeddings): 쿼리 인코딩에 사용할 임베딩 모델
        chroma (Chroma): 검색할 Chroma 벡터 저장소
    """
    embeddings: Embeddings  # 사용할 임베딩 모델
    chroma: Chroma  # 검색할 Chroma 벡터 저장소

    def get_relevant_documents(
        self,
        query: str,  # 검색할 쿼리 문자열
    ) -> List[Document]:
        """
        중복을 필터링하면서 쿼리와 관련된 문서를 검색합니다.
        
        Args:
            query (str): 검색할 쿼리 문자열
            
        Returns:
            List[Document]: 중복이 줄어든 관련 문서 목록
        """
        # 쿼리 문자열을 임베딩 벡터로 변환
        emb = self.embeddings.embed_query(query)
        
        # 최대 한계 관련성(MMR)을 사용하여 쿼리와 관련성이 높으면서도
        # 서로 다양한 문서를 검색
        # lambda_mult는 관련성과 다양성 사이의 균형을 조절 (0.8은 80% 관련성, 20% 다양성을 의미)
        return self.chroma.max_marginal_relevance_search_by_vector(
            embedding=emb, lambda_mult=0.8
        )

    def aget_relevant_documents(self, query: str):
        """
        get_relevant_documents의 비동기 버전 (구현되지 않음).
        
        이것은 BaseRetriever 인터페이스에서 요구하는 검색 메서드의 비동기 버전을 위한
        자리 표시자이지만 이 클래스에서는 구현되지 않았습니다.
        
        Args:
            query (str): 검색할 쿼리 문자열
            
        Returns:
            List[Document]: 빈 리스트 (구현되지 않음)
        """
        return []
