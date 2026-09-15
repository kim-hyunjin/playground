from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from routes.query import router as query_router

app = FastAPI(title="RAG API")

app.include_router(query_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
