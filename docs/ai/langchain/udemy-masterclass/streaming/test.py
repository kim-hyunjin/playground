"""
LangChain 스트리밍 응답 예제

이 스크립트는 LangChain을 사용하여 스트리밍 응답을 구현하는 방법을 보여줍니다.
기본적으로 스트리밍을 지원하지 않는 LLMChain에 스트리밍 기능을 활성화하기 위한
사용자 정의 핸들러와 체인 클래스를 만드는 방법을 보여줍니다.
"""

from threading import Thread  # 백그라운드 스레드에서 체인을 실행하기 위한 라이브러리
from typing import Any  # 타입 힌트를 위한 라이브러리

from langchain.chat_models import ChatOpenAI  # 채팅 모델을 위한 라이브러리
from langchain.prompts import ChatPromptTemplate  # 채팅 프롬프트 생성을 위한 라이브러리
from langchain.chains import LLMChain  # 확장할 기본 체인 클래스
from langchain.callbacks.base import BaseCallbackHandler  # 콜백의 기본 클래스

from queue import Queue  # 스레드 간 토큰 전달을 위한 라이브러리

from dotenv import load_dotenv  # 환경 변수 로드를 위한 라이브러리
from langchain_core.outputs import LLMResult  # 타입 힌트를 위한 라이브러리

# .env 파일에서 환경 변수 로드 (OPENAI_API_KEY 포함)
load_dotenv()


# 스트리밍이 활성화된 ChatOpenAI 모델 초기화
chat = ChatOpenAI(streaming=True)

# 간단한 채팅 프롬프트 템플릿 생성
prompt = ChatPromptTemplate.from_messages([("human", "{content}")])

# 예제 1: 모델에서 직접 스트리밍 (주석 처리됨)
# messages = prompt.format_messages(content="농담 하나 해줘")
# for message in chat.stream(messages):
#     print(message)


# 예제 2: 체인에서 스트리밍 시도 (주석 처리됨)
# 참고: 체인은 기본적으로 스트리밍을 지원하지 않음
# chain = LLMChain(llm=chat, prompt=prompt)
# for output in chain.stream(input={"content": "농담 하나 해줘"}):
#     print(output)


class StreamingHandler(BaseCallbackHandler):
    """
    언어 모델에서 토큰을 스트리밍하기 위한 사용자 정의 콜백 핸들러.
    
    이 핸들러는 모델에서 생성되는 토큰을 캡처하여
    다른 스레드에서 소비할 수 있도록 큐에 넣습니다.
    """
    def __init__(self, queue) -> None:
        """
        큐로 핸들러를 초기화합니다.
        
        Args:
            queue (Queue): 토큰을 넣을 큐
        """
        self.queue = queue

    def on_llm_new_token(self, token: str, **kwargs: Any) -> Any:
        """
        LLM이 새 토큰을 생성할 때 호출됩니다.
        
        이 메서드는 OpenAI가 텍스트 청크를 스트리밍할 때 호출됩니다.
        
        Args:
            token (str): LLM이 생성한 토큰
            **kwargs: 추가 인수
            
        Returns:
            None
        """
        self.queue.put(token)

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> Any:
        """
        LLM이 생성을 완료했을 때 호출됩니다.
        
        이 메서드는 큐에 None을 넣어 생성 종료를 알립니다.
        
        Args:
            response (LLMResult): LLM의 최종 결과
            **kwargs: 추가 인수
            
        Returns:
            None
        """
        self.queue.put(None)

    def on_llm_error(self, error: BaseException, **kwargs: Any) -> Any:
        """
        LLM에서 오류가 발생했을 때 호출됩니다.
        
        이 메서드는 큐에 None을 넣어 오류를 알립니다.
        
        Args:
            error (BaseException): 발생한 오류
            **kwargs: 추가 인수
            
        Returns:
            None
        """
        self.queue.put(None)


class StreamableChain:
    """
    스트리밍을 지원하는 체인의 기본 클래스.
    
    이 클래스는 체인을 백그라운드 스레드에서 실행하고
    생성되는 토큰을 산출하는 stream 메서드를 제공합니다.
    """
    def stream(self, input):
        """
        체인의 출력을 스트리밍합니다.
        
        Args:
            input: 체인에 대한 입력
            
        Yields:
            str: LLM에 의해 생성되는 토큰들
        """
        # 스레드 간 토큰 전달을 위한 큐 생성
        queue = Queue()
        # 토큰을 큐에 넣을 핸들러 생성
        handler = StreamingHandler(queue)

        # 백그라운드 스레드에서 체인을 실행할 작업 정의
        def task():
            self(input, callbacks=[handler])

        # 백그라운드 스레드에서 작업 시작
        Thread(target=task).start()

        # None을 받을 때까지(종료를 나타냄) 큐에서 토큰을 산출
        while True:
            token = queue.get()
            if token is None:
                break
            yield token


class StreamingChain(StreamableChain, LLMChain):
    """
    스트리밍을 지원하는 체인.
    
    이 클래스는 StreamableChain과 LLMChain을 결합하여
    출력을 스트리밍할 수 있는 체인을 생성합니다.
    """
    pass


# 채팅 모델과 프롬프트로 StreamingChain 생성
chain = StreamingChain(llm=chat, prompt=prompt)

# 체인의 출력을 스트리밍하고 각 토큰 출력
for output in chain.stream(input={"content": "농담 하나 해줘"}):
    print(output)
