import os

from langchain_openai import ChatOpenAI

# chat model via OpenRouter's OpenAI-compatible endpoint
chat_model = ChatOpenAI(
    model="openai/gpt-4o-mini",
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
