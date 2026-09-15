from pathlib import Path

from dotenv import load_dotenv
from embedding import embedding_model
from langchain_community.document_loaders import PyPDFLoader
from langchain_qdrant import QdrantVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

# pdf loader
pdf_path = Path(__file__).parent / "data" / "sample.pdf"
loader = PyPDFLoader(str(pdf_path))
docs = loader.load()

# split the documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=400)
chunks = text_splitter.split_documents(documents=docs)


# create qdrant vector store
vector_store = QdrantVectorStore.from_documents(
    documents=chunks,
    embedding=embedding_model,
    collection_name="sample_collection",
    url="http://localhost:6333",
)
