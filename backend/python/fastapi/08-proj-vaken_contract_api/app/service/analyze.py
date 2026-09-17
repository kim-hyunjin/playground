import json

from config import OPENROUTER_API_KEY
from models import AnalysisResult
from openai import AsyncOpenAI

from service.prompt import CONTRACT_ANALYSIS_PROMPT

client = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)


async def analyze(contract_id: str, text_content: str) -> AnalysisResult:
    """
    Analyzes the contract text via an OpenRouter-hosted LLM.

    Args:
        contract_id (str): The ID of the contract being analyzed.
        text_content (str): The extracted text of the contract.

    Returns:
        AnalysisResult: the structured analysis for the contract.
    """
    if not text_content.strip():
        raise ValueError("text_content is empty")

    prompt = CONTRACT_ANALYSIS_PROMPT.format(contract_text=text_content)

    response = await client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        max_tokens=4096,
        temperature=0.3,
        timeout=60,
    )

    raw_content = response.choices[0].message.content
    if not raw_content:
        raise ValueError("LLM returned an empty response")

    analysis_data = json.loads(raw_content)

    return AnalysisResult(contract_id=contract_id, **analysis_data)
