"""
기본 LangChain 예제: 코드 및 테스트 생성

이 스크립트는 코드와 테스트를 생성하기 위한 LangChain의 기본 사용법을 보여줍니다.
지정된 작업과 언어를 기반으로 먼저 코드를 생성한 다음, 해당 코드에 대한 테스트를 
생성하는 순차적 체인을 만듭니다.
"""

# 필요한 라이브러리 가져오기
from langchain.llms import OpenAI  # OpenAI LLM 가져오기
from langchain.prompts import PromptTemplate  # 프롬프트 생성을 위한 PromptTemplate 가져오기
from langchain.chains import LLMChain, SequentialChain  # 체인 클래스 가져오기
import argparse  # 명령줄 인수 파싱을 위한 라이브러리
from dotenv import load_dotenv  # 환경 변수 로드를 위한 라이브러리

# .env 파일에서 환경 변수 로드 (OPENAI_API_KEY 포함)
load_dotenv()

# 명령줄 인수 파싱 설정
parser = argparse.ArgumentParser(description="LangChain을 사용하여 코드 및 테스트 생성")
parser.add_argument("--task", default="return a list of numbers", help="코드를 생성할 작업")
parser.add_argument("--language", default="python", help="사용할 프로그래밍 언어")
args = parser.parse_args()

# OpenAI 언어 모델 초기화
llm = OpenAI()

# 코드 생성을 위한 프롬프트 템플릿 생성
code_prompt = PromptTemplate(
    template="Write a very short {language} function that will {task}. without explanation.",
    input_variables=["language", "task"],  # 채워질 변수들
)

# 테스트 생성을 위한 프롬프트 템플릿 생성
test_prompt = PromptTemplate(
    template="Write a test for the following {language} code without explanation:\n{code}",
    input_variables=["language", "code"],  # 채워질 변수들
)

# 코드 생성을 위한 체인 생성
code_chain = LLMChain(
    llm=llm,  # 사용할 언어 모델
    prompt=code_prompt,  # 프롬프트 템플릿
    output_key="code",  # 출력에 사용할 키
)

# 테스트 생성을 위한 체인 생성
test_chain = LLMChain(
    llm=llm,  # 사용할 언어 모델
    prompt=test_prompt,  # 프롬프트 템플릿
    output_key="test",  # 출력에 사용할 키
)

# 코드 체인 다음에 테스트 체인을 실행하는 순차적 체인 생성
chain = SequentialChain(
    chains=[code_chain, test_chain],  # 순서대로 실행할 체인들
    input_variables=["task", "language"],  # 첫 번째 체인에 전달될 변수들
    output_variables=["code", "test"],  # 체인에서 반환될 변수들
)

# 지정된 언어와 작업으로 체인 실행
result = chain({"language": args.language, "task": args.task})

# 생성된 코드와 테스트 출력
print(">>>>>> 생성된 코드:")
print(result["code"])
print("\n>>>>>> 생성된 테스트:")
print(result["test"])
