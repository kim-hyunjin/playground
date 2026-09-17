import os
import uuid

import anyio
from config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB, UPLOAD_DIR
from database import contracts_collection
from fastapi import APIRouter, File, HTTPException, UploadFile
from models import Contract
from mongo_utils import parse_object_id, serialize_doc
from service.document_parser import extract_text

router = APIRouter(
    prefix="/contracts",
    tags=["contracts"],
)


def _doc_to_contract(doc: dict) -> Contract:
    return Contract(**serialize_doc(doc))


@router.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    """
    Upload a PDF of TXT contract for analysis.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {ext}")

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File too large: {size_mb:.2f} MB")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    def _write_file() -> None:
        with open(file_path, "wb") as f:
            f.write(content)

    await anyio.to_thread.run_sync(_write_file)
    parsed = await anyio.to_thread.run_sync(extract_text, file_path)
    contract_data = Contract(
        filename=unique_filename,
        original_name=file.filename,
        text_content=parsed["text"],
        page_count=parsed["page_count"],
        word_count=parsed["word_count"],
    )
    doc = contract_data.model_dump()
    result = contracts_collection.insert_one(doc)
    contract_data.id = str(result.inserted_id)

    return contract_data


@router.get("/")
def list_contracts():
    """
    List all contracts in the database.
    """
    return [_doc_to_contract(doc) for doc in contracts_collection.find()]


@router.get("/{contract_id}")
def get_contract(contract_id: str):
    """
    Get a contract by its ID.
    """
    doc = contracts_collection.find_one({"_id": parse_object_id(contract_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Contract not found")

    return _doc_to_contract(doc)
