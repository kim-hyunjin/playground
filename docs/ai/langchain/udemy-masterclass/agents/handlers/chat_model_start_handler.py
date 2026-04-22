"""
LangChain 에이전트를 위한 채팅 모델 시작 핸들러

이 모듈은 채팅 모델로 전송되는 메시지를 다양한 메시지 유형에 따라 
다른 색상으로 시각적으로 보기 좋은 박스 형식으로 출력하는 사용자 정의 콜백 핸들러를 제공합니다.
에이전트와 모델 간의 대화 흐름을 디버깅하고 시각화하는 데 도움이 됩니다.
"""

from typing import Any, Dict, List  # 타입 힌트를 위한 라이브러리
from uuid import UUID  # 고유 식별자 타입을 위한 라이브러리
from langchain.callbacks.base import BaseCallbackHandler  # 콜백 핸들러의 기본 클래스
from langchain_core.messages import BaseMessage  # 기본 메시지 클래스
from pyboxen import boxen  # 박스 형태의 터미널 출력을 위한 라이브러리


def boxen_print(*args, **kwargs):
    """
    pyboxen을 사용하여 텍스트를 박스 안에 출력하는 유틸리티 함수.
    
    Args:
        *args: boxen에 전달할 인수들
        **kwargs: boxen에 전달할 키워드 인수들
        
    Returns:
        None: 이 함수는 콘솔에 출력만 하고 아무것도 반환하지 않습니다
    """
    print(boxen(*args, **kwargs))


class ChatModelStartHandler(BaseCallbackHandler):
    """
    채팅 모델로 전송되는 메시지를 출력하는 사용자 정의 콜백 핸들러.
    
    이 핸들러는 채팅 모델이 호출되려고 할 때 트리거되며,
    모델로 전송될 모든 메시지를 다양한 메시지 유형에 따라 
    다른 색상으로 시각적으로 보기 좋은 형식으로 출력합니다.
    """
    
    def on_chat_model_start(
        self,
        serialized: Dict[str, Any],  # 직렬화된 모델 데이터
        messages: List[List[BaseMessage]],  # 모델로 전송되는 메시지들
        *,
        run_id: UUID,  # 이 실행의 고유 식별자
        parent_run_id: UUID | None = None,  # 부모 실행의 고유 식별자
        tags: List[str] | None = None,  # 이 실행의 태그들
        metadata: Dict[str, Any] | None = None,  # 이 실행의 메타데이터
        **kwargs: Any,  # 추가 키워드 인수들
    ) -> Any:
        """
        채팅 모델이 사용되려고 할 때 호출됩니다.
        
        이 메서드는 모델로 전송될 모든 메시지를 메시지 유형에 따라
        다른 형식으로 출력합니다.
        
        Args:
            serialized: 직렬화된 모델 데이터
            messages: 모델로 전송되는 메시지 리스트의 리스트
            run_id: 이 실행의 고유 식별자
            parent_run_id: 부모 실행의 고유 식별자
            tags: 이 실행의 태그들
            metadata: 이 실행의 메타데이터
            **kwargs: 추가 키워드 인수들
            
        Returns:
            None
        """
        # 메시지가 전송되고 있음을 나타내는 헤더 출력
        print("\n\n\n\n======= 메시지 전송 중 =======\n\n")

        # 첫 번째 메시지 리스트의 메시지들을 반복
        for message in messages[0]:
            # 시스템 메시지 처리 (노란색 박스)
            if message.type == "system":
                boxen_print(message.content, title=message.type, color="yellow")

            # 사용자 메시지 처리 (녹색 박스)
            elif message.type == "human":
                boxen_print(message.content, title=message.type, color="green")

            # 함수 호출이 있는 AI 메시지 처리 (청록색 박스)
            elif message.type == "ai" and "function_call" in message.additional_kwargs:
                call = message.additional_kwargs["function_call"]
                boxen_print(
                    f"도구 {call['name']}을(를) 인수 {call['arguments']}로 실행 중",
                    title=message.type,
                    color="cyan",
                )

            # 일반 AI 메시지 처리 (파란색 박스)
            elif message.type == "ai":
                boxen_print(message.content, title=message.type, color="blue")

            # 함수 메시지 처리 (보라색 박스)
            elif message.type == "function":
                boxen_print(message.content, title=message.type, color="purple")

            # 기타 메시지 유형 처리
            else:
                boxen_print(message.content, title=message.type)
