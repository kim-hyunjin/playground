"""
LinkedIn 프로필 URL 검색 에이전트 모듈

이 파일은 LangChain의 ReAct 에이전트를 사용하여 주어진 이름으로
LinkedIn 프로필 URL을 검색하는 기능을 제공합니다.
"""

from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

from langchain_core.tools import Tool
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub
from tools.tools import get_profile_url_tavily


def lookup(name: str) -> str:
    """
    주어진 이름으로 링크드인 URL을 찾는 함수
    
    Args:
        name (str): 검색할 사람의 이름
        
    Returns:
        str: 찾은 LinkedIn 프로필 URL
    """
    # LLM 모델 초기화 (temperature=0으로 설정하여 결정적인 출력 생성)
    llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
    
    # LinkedIn URL 검색을 위한 프롬프트 템플릿 정의
    template = """
    given the full name {name_of_person} I want you to get it me a link a to their Linkedin profile page. 
    Your answer should contain only a URL
    """
    prompt_template = PromptTemplate(
        template=template, input_variables=["name_of_person"]
    )
    
    # 에이전트가 사용할 도구 정의
    tools_for_agent = [
        Tool(
            name="Crawl Google for linkedin profile page",
            func=get_profile_url_tavily,
            description="useful for when you need get the Linkedin Page URL",
        )
    ]

    # LangChain hub의 hwchase17이 ReAct 논문을 구현한 프롬프트
    # react_prompt = hub.pull("hwchase17/react")
    # 위처럼 hub.pull을 사용하려면 LANGCHAIN_API_KEY가 필요.
    # 아래는 https://smith.langchain.com/hub/hwchase17/react?organizationId=a1544f4a-e5f5-5079-b95d-f570ffa0a416
    # 링크에서 가져온 hwchase17/react PromptTemplate
    react_template = """
    Answer the following questions as best you can. You have access to the following tools:

    {tools}

    Use the following format:

    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: the final answer to the original input question

    Begin!

    Question: {input}
    Thought:{agent_scratchpad}
    """
    # ReAct 프롬프트 템플릿 생성
    react_prompt = PromptTemplate(
        template=react_template,
        input_variables=["input", "agent_scratchpad", "tools", "tool_names"],
    )
    
    # ReAct 에이전트 생성
    agent = create_react_agent(llm=llm, tools=tools_for_agent, prompt=react_prompt)
    
    # 에이전트 실행기 생성
    agent_executor = AgentExecutor(agent=agent, tools=tools_for_agent, verbose=True)

    # 에이전트 실행하여 LinkedIn URL 검색
    result = agent_executor.invoke(
        input={"input": prompt_template.format_prompt(name_of_person=name)}
    )

    # 결과에서 LinkedIn URL 추출
    linkedin_profile_url = result["output"]
    return linkedin_profile_url


if __name__ == "__main__":
    # 테스트 실행
    linkedin_url = lookup(name="Eden Macro")
    print(linkedin_url)
