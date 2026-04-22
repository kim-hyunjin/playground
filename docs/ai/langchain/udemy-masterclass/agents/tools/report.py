"""
LangChain 에이전트를 위한 보고서 작성 도구

이 모듈은 LangChain 에이전트를 통해 HTML 보고서를 디스크에 작성하기 위한 도구를 제공합니다.
에이전트가 데이터 분석이나 다른 작업을 기반으로 보고서를 생성하고 저장할 수 있게 합니다.
"""

from langchain.tools import StructuredTool  # LangChain 구조화된 도구 생성을 위한 클래스
from pydantic.v1 import BaseModel  # 인수 스키마 정의를 위한 클래스


def write_report(filename, html):
    """
    HTML 내용을 디스크의 파일에 작성합니다.
    
    Args:
        filename (str): 작성할 파일의 이름
        html (str): 파일에 작성할 HTML 내용
        
    Returns:
        None: 이 함수는 아무것도 반환하지 않고, 파일에 작성만 합니다
    """
    # 파일을 쓰기 모드로 열고 HTML 내용 작성
    with open(filename, "w") as f:
        f.write(html)


# write_report 함수 인수를 위한 Pydantic 스키마 정의
class WriteReportArgsSchema(BaseModel):
    """write_report 함수 인수를 위한 스키마."""
    filename: str  # 작성할 파일의 이름
    html: str  # 파일에 작성할 HTML 내용


# write_report 함수로부터 LangChain 구조화된 도구 생성
write_report_tool = StructuredTool.from_function(
    name="write_report",  # 도구의 이름
    description="Write an HTML file to disk. Use this tool whenever asks for a report.",  # 도구의 설명
    func=write_report,  # 호출할 함수
    args_schema=WriteReportArgsSchema,  # 함수 인수를 위한 스키마
)
