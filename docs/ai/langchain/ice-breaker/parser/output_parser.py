"""
LLM 출력 파싱 모듈

이 파일은 LLM의 출력을 구조화된 형식으로 파싱하기 위한 클래스와 파서를 정의합니다.
Pydantic을 사용하여 출력 형식을 정의하고 LangChain의 PydanticOutputParser를 사용하여 파싱합니다.
"""

from typing import List, Dict, Any
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field


class Summary(BaseModel):
    """
    LinkedIn 프로필 요약 정보를 위한 Pydantic 모델
    
    Attributes:
        summary (str): 프로필 요약 텍스트
        facts (List[str]): 흥미로운 사실들의 리스트
    """
    summary: str = Field(description="summary")
    facts: List[str] = Field(description="interestring facts about them")

    def to_dict(self) -> Dict[str, Any]:
        """
        Summary 객체를 딕셔너리로 변환하는 메서드
        
        Returns:
            Dict[str, Any]: summary와 facts를 포함하는 딕셔너리
        """
        return {"summary": self.summary, "facts": self.facts}


# LLM 출력을 Summary 객체로 파싱하기 위한 파서 생성
summary_parser = PydanticOutputParser(pydantic_object=Summary)
