from database import vector_db
from fastapi import APIRouter
from llm import chat_model
from pydantic import BaseModel

router = APIRouter(prefix="/query", tags=["Query"])

SYSTEM_PROMPT = """You are a helpful assistant that answers questions using only the context below.
If the answer isn't contained in the context, say you don't know.

Context:
{context}
"""


class QueryRequest(BaseModel):
    q: str


@router.post("/")
async def query(request: QueryRequest):
    q = request.q
    search_results = vector_db.similarity_search(query=q, k=3)

    context = "\n\n".join(
        [
            f"[Page {doc.metadata.get('page_number', 'unknown')}] {doc.page_content}"
            for doc in search_results
        ]
    )

    response = await chat_model.ainvoke(
        [
            {"role": "system", "content": SYSTEM_PROMPT.format(context=context)},
            {"role": "user", "content": q},
        ]
    )

    return {
        "answer": response.content,
        "sources": [doc.metadata for doc in search_results],
    }
