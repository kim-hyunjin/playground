from database import init_db
from fastapi import FastAPI
from routes.contracts import router as contracts_router

app = FastAPI(
    title="Vakeel Contracts API",
    description="AI-Powered Contract Analysis",
    version="1.0.0",
)

app.include_router(contracts_router)


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {
        "app": "Vakeel Contracts API",
        "version": "1.0.0",
        "endpoints": {
            "POST /contracts/upload": "Upload a PDF or TXT Contract for analysis",
            "GET /contracts/": "Retireve a list of all uploaded contracts",
            "GET /contracts/{id}": "Retrive details of a specific contract by ID",
            "POST /analysis/analyze/{contract_id}": "Analyze a contract using AI and return insights",
            "GET /analysis/{analysis_id}": "Retrieve the results of a specific analysis by id",
            "GET /analysis/contract/{contract_id}": "Retrieve a list of all analysis performed for a specific contract",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
