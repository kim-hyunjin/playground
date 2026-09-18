from fastapi import FastAPI
from routes.planner import router as planner_router

app = FastAPI(
    title="Yatra Planner API",
    description="Aggregate travel data from multiple sources to provide a unified travel planning experience.",
    version="0.1.0",
)

app.include_router(planner_router)


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
