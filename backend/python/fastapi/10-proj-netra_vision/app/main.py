from fastapi import FastAPI
from routes.analyze import router as analyze_router

app = FastAPI(title="Netra Vision API", description="AI-powered crop disease detection")

app.include_router(analyze_router)


@app.get("/")
async def root():
    return {"message": "Welcome to Netra Vision API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
