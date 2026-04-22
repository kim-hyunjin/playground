from typing import Any, Dict, List
from uuid import UUID
from langchain.callbacks.base import BaseCallbackHandler
from langchain_core.messages import BaseMessage
from langchain_core.outputs import LLMResult


class StreamingHandler(BaseCallbackHandler):
    """
    이 콜백은 체인 내에 있는 모든 prompt, llm, 하위 chain에서 모두 사용됨.
    """

    def __init__(self, queue) -> None:
        self.queue = queue
        self.streaming_run_ids = set()

    def on_chat_model_start(
        self,
        serialized: Dict[str, Any],
        messages: List[List[BaseMessage]],
        *,
        run_id: UUID,
        parent_run_id: UUID | None = None,
        tags: List[str] | None = None,
        metadata: Dict[str, Any] | None = None,
        **kwargs: Any
    ) -> Any:
        if serialized["kwargs"]["streaming"]:
            self.streaming_run_ids.add(run_id)

    # OpenAI에서 텍스트 청크를 스트리밍해주면 아래 함수가 호출됨
    def on_llm_new_token(self, token: str, **kwargs: Any) -> Any:
        self.queue.put(token)

    def on_llm_end(self, response: LLMResult, run_id, **kwargs: Any) -> Any:
        if run_id in self.streaming_run_ids:
            self.queue.put(None)
            self.streaming_run_ids.remove(run_id)

    def on_llm_error(self, error: BaseException, **kwargs: Any) -> Any:
        self.queue.put(None)
