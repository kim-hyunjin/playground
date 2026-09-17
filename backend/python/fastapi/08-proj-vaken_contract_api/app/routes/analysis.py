from config import OPENROUTER_API_KEY
from database import analysis_collection, contracts_collection
from fastapi import APIRouter, HTTPException
from mongo_utils import parse_object_id, serialize_doc
from service.analyze import analyze

router = APIRouter(
    prefix="/analysis",
    tags=["analysis"],
)


@router.post("/analyze/{contract_id}")
async def analyze_contract(contract_id: str):
    """
    Analyze a contract using AI and return insights.
    """

    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not set")

    contract_oid = parse_object_id(contract_id)

    contract = contracts_collection.find_one({"_id": contract_oid})
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if not contract.get("text_content"):
        raise HTTPException(
            status_code=400, detail="Contract text content not available"
        )

    contracts_collection.update_one(
        {"_id": contract_oid}, {"$set": {"analysis_status": "analyzing"}}
    )

    result = await analyze(
        contract_id,
        text_content=contract["text_content"],
    )

    doc = result.model_dump()
    insert_result = analysis_collection.insert_one(doc)
    result.id = str(insert_result.inserted_id)

    contracts_collection.update_one(
        {"_id": contract_oid}, {"$set": {"analysis_status": "analyzed"}}
    )

    return result


@router.get("/{analysis_id}")
def get_analysis(analysis_id: str):
    """
    Retrieve the results of a specific analysis by ID.
    """
    analysis = analysis_collection.find_one({"_id": parse_object_id(analysis_id)})

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return serialize_doc(analysis)


@router.get("/")
def list_analyses():
    """
    List all analyses performed.
    """
    return [serialize_doc(doc) for doc in analysis_collection.find({})]


@router.get("/contract/{contract_id}")
def get_analyses_for_contract(contract_id: str):
    """Get all analyses for a specific contract."""
    analyses = [
        serialize_doc(doc)
        for doc in analysis_collection.find({"contract_id": contract_id})
    ]
    return {"analyses": analyses, "total": len(analyses)}
