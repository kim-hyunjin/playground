from contextlib import asynccontextmanager

from database import create_tables
from fastapi import FastAPI
from routes.books import router as books_router
from routes.users import router as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="Kitab Exchange API",
    description="A simple API for exchaning used books",
    lifespan=lifespan,
    version="1.0.0",
)

app.include_router(books_router)
app.include_router(users_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
