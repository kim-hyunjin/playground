import os
import uuid
from io import BytesIO

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"]
MAX_IMAGE_DIMENSIONS = 2048
MAX_IMAGE_SIZE_MB = 15
UPLOAD_DIR = "uploads"
FORMAT_MIME_TYPES = {"JPEG": "image/jpeg", "PNG": "image/png"}
MIME_EXTENSIONS = {"image/jpeg": "jpg", "image/png": "png"}


def validate_image_type(file: UploadFile) -> None:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")


async def read_image_content(file: UploadFile) -> bytes:
    content = await file.read()

    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(status_code=400, detail="Image size exceeds limit")

    return content


def open_image(content: bytes) -> Image.Image:
    try:
        image = Image.open(BytesIO(content))
        # Image.open is lazy; load() surfaces truncated or corrupt data here.
        image.load()
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError):
        raise HTTPException(status_code=400, detail="Invalid image data")

    # The declared content-type can lie, so check the real format too.
    if image.format not in FORMAT_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    return image


def resize_image(image: Image.Image) -> Image.Image:
    # thumbnail resizes in place, keeps the aspect ratio and never upscales.
    # Being in place, it also keeps image.format, which encode_image relies on.
    image.thumbnail((MAX_IMAGE_DIMENSIONS, MAX_IMAGE_DIMENSIONS))
    return image


def encode_image(image: Image.Image) -> tuple[bytes, str]:
    """Encodes the image in its own format, returning (data, mime_type)."""
    fmt = image.format
    if fmt is None or fmt not in FORMAT_MIME_TYPES:
        raise ValueError(f"Unsupported image format: {fmt}")

    buffer = BytesIO()
    image.save(buffer, format=fmt)
    return buffer.getvalue(), FORMAT_MIME_TYPES[fmt]


def save_image(data: bytes, mime_type: str) -> str:
    ext = MIME_EXTENSIONS[mime_type]
    unique_name = f"{uuid.uuid4().hex}.{ext}"

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(data)

    return file_path
