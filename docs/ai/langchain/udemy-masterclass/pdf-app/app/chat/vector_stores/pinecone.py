import os
import pinecone
from langchain.vectorstores import Pinecone
from app.chat.embeddings.openai import embeddings
from app.chat.models import ChatArgs

pinecone.Pinecone(
    api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENV_NAME")
)

vector_store = Pinecone.from_existing_index(
    os.getenv("PINECONE_INDEX_NAME"), embeddings
)


# pinecone에 저장된 벡터에 메타데이터로 pdf_id가 있음.
# 가장 유사한 벡터를 가져올 때, 현재 사용자가 보고 있는 pdf로 한정짓기 위해 필터 적용
# Pinecone Retriever that fetchs top k docs
def build_retriever(chat_args: ChatArgs, k):
    search_kwargs = {"filter": {"pdf_id": chat_args.pdf_id}, "k": k}
    return vector_store.as_retriever(search_kwargs=search_kwargs)
