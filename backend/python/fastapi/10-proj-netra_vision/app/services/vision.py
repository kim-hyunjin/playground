import base64

from config import OPENROUTER_API_KEY
from models import CropAnalysis
from openai import AsyncOpenAI
from services.prompt import CROP_ANALYSIS_PROMPT

client = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)


async def analyze_crop_image(image_data: bytes, mime_type: str) -> CropAnalysis:
    """
    Analyzes a crop image for diseases via an OpenRouter-hosted vision LLM.

    Args:
        image_data (bytes): The encoded (already validated) image.
        mime_type (str): MIME type of image_data, e.g. "image/jpeg".

    Returns:
        CropAnalysis: the structured disease assessment for the image.
    """
    encoded = base64.b64encode(image_data).decode("utf-8")

    response = await client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": CROP_ANALYSIS_PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime_type};base64,{encoded}"},
                    },
                ],
            },
        ],
        response_format={"type": "json_object"},
        max_tokens=2048,
        temperature=0.3,
        timeout=60,
    )

    raw_content = response.choices[0].message.content
    if not raw_content:
        raise ValueError("LLM returned an empty response")

    return CropAnalysis.model_validate_json(raw_content)
