"""
메모리를 활용한 LangChain 채팅 예제

이 스크립트는 LangChain을 사용하여 메모리가 있는 채팅 인터페이스를 만드는 방법을 보여줍니다.
이전 대화를 요약하여 상호작용 간의 컨텍스트를 유지하는 ConversationSummaryMemory를 사용하여
더 일관성 있는 다중 턴 대화를 가능하게 합니다.
"""

# 필요한 라이브러리 가져오기
from langchain.prompts import (  # 프롬프트 컴포넌트 가져오기
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder,
)
from langchain.chains import LLMChain  # 체인 생성을 위한 LLMChain 가져오기
from langchain.chat_models import ChatOpenAI  # ChatOpenAI 모델 가져오기
from langchain.memory import (  # 메모리 컴포넌트 가져오기
    ConversationBufferMemory,
    FileChatMessageHistory,
    ConversationSummaryMemory,
)
from dotenv import load_dotenv  # 환경 변수 로드를 위한 라이브러리

# .env 파일에서 환경 변수 로드 (OPENAI_API_KEY 포함)
load_dotenv()

# 상세 출력이 활성화된 ChatOpenAI 모델 초기화
chat = ChatOpenAI(verbose=True)

# 대체 메모리 구현 (주석 처리됨)
# 이 방식은 전체 대화 기록을 JSON 파일에 저장합니다
# memory = ConversationBufferMemory(
#     memory_key="messages",
#     return_messages=True,
#     chat_memory=FileChatMessageHistory("messages.json"),
# )
"""
ConversationBufferMemory 사용 시 출력 예시:
{'content': 'and 3 more?', 'messages': [HumanMessage(content='what is 1+1?'), AIMessage(content='1+1 equals 2.')], 'text': '3 more than 1+1 would be 5. (1+1 = 2, 2+3 = 5)'}
"""

# ConversationSummaryMemory 초기화
# 이 방식은 토큰을 절약하고 컨텍스트를 유지하기 위해 대화 기록을 요약합니다
memory = ConversationSummaryMemory(
    memory_key="messages",  # 프롬프트에서 메모리에 사용할 키
    return_messages=True,  # 메모리를 메시지 리스트로 반환
    llm=chat  # 요약을 생성하기 위한 채팅 모델 사용
)
"""
ConversationSummaryMemory 사용 시 출력 예시:
{'content': 'and 3 more?', 'messages': [SystemMessage(content='The human asks what 1+1 is. The AI responds that 1+1 equals 2.')], 'text': 'If you add 1+1+1, the result is 3.'}
"""

# 채팅을 위한 프롬프트 템플릿 생성
prompt = ChatPromptTemplate(
    input_variables=["content", "messages"],  # 채워질 변수들
    messages=[
        # 메모리에서 대화 기록 포함
        MessagesPlaceholder(variable_name="messages"),
        # 사용자 입력을 위한 템플릿
        HumanMessagePromptTemplate.from_template("{content}"),
    ],
)

# 채팅 모델, 프롬프트, 메모리로 LLMChain 생성
chain = LLMChain(
    llm=chat,  # 사용할 언어 모델
    prompt=prompt,  # 프롬프트 템플릿
    memory=memory,  # 사용할 메모리
    verbose=True  # 상세 로그 출력
)

# 메인 상호작용 루프
while True:
    # 사용자 입력 받기
    content = input(">> ")
    
    # 사용자 입력으로 체인 실행
    result = chain({"content": content})
    
    # 결과 출력
    print(f"결과: {result}")
