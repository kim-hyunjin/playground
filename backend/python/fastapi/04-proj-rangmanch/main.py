from contextlib import asynccontextmanager

from database import create_table
from fastapi import FastAPI
from routes.reviews import router as reviews_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_table()  # Ensure tables are created before the app starts
    print("Database tables created.")
    yield  # This allows the app to run
    print("Shutting down the application.")


app = FastAPI(
    title="Rangmanch Review API",
    description="An API for managing reviews of plays in Rangmanch",
    lifespan=lifespan,
)

app.include_router(reviews_router)


@app.get("/")
def root():
    return {"message": "Welcome to the Rangmanch Review API!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
