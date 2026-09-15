from embedding import embedding_model
from langchain_qdrant import QdrantVectorStore

vector_db = QdrantVectorStore.from_existing_collection(
    embedding=embedding_model,
    collection_name="sample_collection",
    url="http://localhost:6333",
)
