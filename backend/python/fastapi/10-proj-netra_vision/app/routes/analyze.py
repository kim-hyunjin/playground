import asyncio

from fastapi import APIRouter, File, HTTPException, UploadFile
from models import CropAnalysis
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


@router.post("/", response_model=CropAnalysis)
async def analyze_image(file: UploadFile = File(...)):
    validate_image_type(file)
    content = await read_image_content(file)
    image = resize_image(open_image(content))
    image_data, mime_type = encode_image(image)
    await asyncio.to_thread(save_image, image_data, mime_type)

    try:
        return await analyze_crop_image(image_data, mime_type)
    except (OpenAIError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Image analysis failed: {e}")
