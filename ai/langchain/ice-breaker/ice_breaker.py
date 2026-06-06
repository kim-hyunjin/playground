"""
아이스브레이커(Ice Breaker) 핵심 기능 모듈

이 파일은 사용자가 입력한 이름을 기반으로 LinkedIn 프로필을 찾고,
해당 프로필 정보를 스크래핑한 후 LLM을 사용하여 요약 정보를 생성합니다.
"""

from typing import Tuple
from dotenv import load_dotenv
from langchain.prompts.prompt import PromptTemplate
from langchain_openai import ChatOpenAI

from third_parties.linkedin import scrape_linkedin_profile
from agents.linkedin_lookup_agent import lookup as linkedin_lookup_agent
from parser.output_parser import Summary, summary_parser


def ice_break_with(name: str) -> Tuple[Summary, str]:
    """
    주어진 이름으로 LinkedIn 프로필을 찾고 정보를 요약하는 함수
    
    Args:
        name (str): 검색할 사람의 이름
        
    Returns:
        Tuple[Summary, str]: 요약 정보와 프로필 사진 URL을 포함한 튜플
    """
    # LinkedIn 에이전트를 사용하여 프로필 URL 찾기
    linkedin_profile_url = linkedin_lookup_agent(name=name)
    
    # LinkedIn 프로필 스크래핑 (mock=True는 실제 스크래핑 대신 샘플 데이터 사용)
    linkedin_data = scrape_linkedin_profile(
        linkedin_profile_url=linkedin_profile_url, mock=True
    )

    # 요약 생성을 위한 프롬프트 템플릿 정의
    summary_template = """
    given the Linkedin information {information} about a person I want you to create:
    1. A short summary
    2. two interesting facts about them
    \n{format_instructions}
    """
    # PromptTemplate 객체 생성 및 출력 파서 지침 추가
    summary_prompt_template = PromptTemplate(
        input_variables=["information"],
        template=summary_template,
        partial_variables={
            "format_instructions": summary_parser.get_format_instructions()
        },
    )
    
    # LLM 모델 초기화 (temperature=0으로 설정하여 결정적인 출력 생성)
    llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
    
    # 프롬프트 템플릿, LLM, 출력 파서를 연결하는 체인 생성
    chain = summary_prompt_template | llm | summary_parser

    # 체인 실행하여 요약 정보 생성
    res: Summary = chain.invoke(input={"information": linkedin_data})

    # 요약 정보와 프로필 사진 URL 반환
    return res, linkedin_data.get("profile_pic_url")


if __name__ == "__main__":
    # 환경 변수 로드
    load_dotenv()

    # 테스트 실행
    print("Ice Breaker Enter")
    print(ice_break_with(name="Udemy instructor Eden Macro"))
