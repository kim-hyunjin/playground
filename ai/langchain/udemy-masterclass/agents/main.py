"""
SQL 데이터베이스 상호작용을 위한 LangChain 에이전트

이 스크립트는 자연어를 사용하여 SQLite 데이터베이스와 상호작용할 수 있는 에이전트를 생성합니다.
에이전트는 SQL 쿼리를 실행하고, 테이블을 설명하고, 데이터를 기반으로 보고서를 작성할 수 있습니다.
각 요청에 대해 어떤 도구를 사용할지 결정하기 위해 OpenAI의 함수 호출 기능을 사용합니다.
"""

# 필요한 라이브러리 가져오기
from langchain.chat_models import ChatOpenAI  # ChatOpenAI 모델 가져오기
from langchain.prompts import (  # 프롬프트 컴포넌트 가져오기
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain.schema import SystemMessage  # 시스템 지시사항을 위한 SystemMessage 가져오기
from langchain.agents import OpenAIFunctionsAgent, AgentExecutor  # 에이전트 컴포넌트 가져오기
from langchain.memory import ConversationBufferMemory  # 대화 기록을 위한 메모리 가져오기

from dotenv import load_dotenv  # 환경 변수 로드를 위한 라이브러리

# 사용자 정의 도구 및 핸들러 가져오기
from tools.sql import run_query_tool, list_tables, describe_tables_tools  # SQL 관련 도구
from tools.report import write_report_tool  # 보고서 작성 도구
from handlers.chat_model_start_handler import ChatModelStartHandler  # 사용자 정의 콜백 핸들러

# .env 파일에서 환경 변수 로드 (OPENAI_API_KEY 포함)
load_dotenv()

# 사용자 정의 핸들러 및 채팅 모델 초기화
handler = ChatModelStartHandler()  # 모델 호출을 추적하기 위한 사용자 정의 핸들러 생성
chat = ChatOpenAI(callbacks=[handler])  # 핸들러와 함께 ChatOpenAI 모델 초기화

# 데이터베이스의 테이블 목록 가져오기
tables = list_tables()

# 에이전트를 위한 프롬프트 템플릿 생성
prompt = ChatPromptTemplate(
    messages=[
        # 에이전트의 역할과 기능을 정의하는 시스템 메시지
        SystemMessage(
            content=(
                "You are an AI that has access to a SQLite database.\n"
                f"The database has table of: {tables}\n"
                "Do not make any assumptions about what tables exist "
                "or what columns exist. Instead, use the 'describe_tables' function"
            )
        ),
        # 이전 상호작용의 채팅 기록을 위한 플레이스홀더
        MessagesPlaceholder(variable_name="chat_history"),
        # 사용자 입력을 위한 템플릿
        HumanMessagePromptTemplate.from_template("{input}"),
        # 에이전트의 작업 영역을 위한 플레이스홀더 (함수 호출 등)
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

# 상호작용 간 컨텍스트를 유지하기 위한 대화 메모리 초기화
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# 에이전트가 사용할 수 있는 도구 정의
tools = [run_query_tool, describe_tables_tools, write_report_tool]

"""
에이전트
- 도구를 사용하는 방법을 아는 체인
- 도구 목록을 가져와 JSON 함수 설명으로 변환
- 입력 변수, 메모리, 프롬프트 등 체인이 가진 모든 일반적인 요소를 포함
"""
# 채팅 모델, 프롬프트, 도구로 OpenAI Functions 에이전트 생성
agent = OpenAIFunctionsAgent(llm=chat, prompt=prompt, tools=tools)

"""
에이전트 실행기
- 에이전트를 가져와 응답이 함수 호출이 아닐 때까지 실행
- 본질적으로 함수 while 루프
"""
# 지정된 도구와 메모리로 에이전트를 실행하기 위한 에이전트 실행기 생성
agent_executor = AgentExecutor(
    agent=agent,
    # verbose=True,  # 상세한 실행 로그를 보려면 주석 해제
    tools=tools,
    memory=memory,
)

# 예제 쿼리 (주석 처리됨)
# agent_executor("배송 주소를 제공한 사용자는 몇 명인가요?")
# agent_executor(
#     "가장 인기 있는 상위 5개 제품을 요약하세요. 결과를 보고서 파일에 작성하세요."
# )

# 메인 상호작용 루프
while True:
    # 사용자 입력 받기
    content = input(">> ")
    # 사용자 입력으로 에이전트 실행
    result = agent_executor(content)
    # 에이전트의 응답 출력
    print(result["output"])
