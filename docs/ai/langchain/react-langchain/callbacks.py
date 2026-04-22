from typing import Any, Dict, List
from langchain.callbacks.base import BaseCallbackHandler
from langchain_core.outputs import LLMResult


class AgentCallbackHandler(BaseCallbackHandler):
    def on_llm_start(
        self,
        serialized: Dict[str, Any],
        prompts: List[str],
        **kwargs: Any,
    ) -> Any:
        print(f"\n***Prompt to LLM was:***\n{prompts[0]}")

    def on_llm_end(
        self,
        response: LLMResult,
        **kwargs: Any,
    ) -> Any:
        print(f"\n***LLM Response:***\n{response.generations[0][0].text}")
