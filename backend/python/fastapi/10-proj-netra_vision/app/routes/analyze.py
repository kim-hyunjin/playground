import asyncio

from fastapi import APIRouter, File, HTTPException, UploadFile
from models import BatchAnalysis, BatchItemResult, CropAnalysis
from openai import OpenAIError
from services.image import (
    encode_image,
    open_image,
    read_image_content,
    resize_image,
    save_image,
    validate_image_type,
)
from services.vision import analyze_crop_image

router = APIRouter(
    prefix="/analyze",
    tags=["analyze"],
)

MAX_BATCH_FILES = 10


async def _analyze_upload(file: UploadFile) -> CropAnalysis:
    validate_image_type(file)
    content = await read_image_content(file)
    image = resize_image(open_image(content))
    image_data, mime_type = encode_image(image)
    await asyncio.to_thread(save_image, image_data, mime_type)

    try:
        return await analyze_crop_image(image_data, mime_type)
    except (OpenAIError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Image analysis failed: {e}")


async def _analyze_upload_result(file: UploadFile) -> BatchItemResult:
    # One bad file must not fail the whole batch, so errors are reported per file.
    filename = file.filename or ""
    try:
        return BatchItemResult(
            filename=filename, analysis=await _analyze_upload(file)
        )
    except HTTPException as e:
        return BatchItemResult(filename=filename, error=str(e.detail))


@router.post("/", response_model=CropAnalysis)
async def analyze_image(file: UploadFile = File(...)):
    return await _analyze_upload(file)


@router.post("/batch", response_model=BatchAnalysis)
async def analyze_images(files: list[UploadFile] = File(...)):
    if len(files) > MAX_BATCH_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Too many files (max {MAX_BATCH_FILES})",
        )

    results = await asyncio.gather(*(_analyze_upload_result(f) for f in files))
    return BatchAnalysis(results=list(results))
