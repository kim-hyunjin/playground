import os

from langchain_openai import OpenAIEmbeddings

# embedding the chunks via OpenRouter's OpenAI-compatible embeddings endpoint
embedding_model = OpenAIEmbeddings(
    model="openai/text-embedding-3-large",
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
