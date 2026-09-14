from contextlib import asynccontextmanager

from database import create_tables
from fastapi import FastAPI
from routes.orders import router as orders_router
from routes.stats import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="Dabbewala Delivery API",
    description="API for managing Dabbewala delivery orders and statistics",
    lifespan=lifespan,
    version="1.0.0",
)

app.include_router(orders_router)
app.include_router(stats_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
