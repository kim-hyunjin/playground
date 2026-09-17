from datetime import datetime

from pydantic import BaseModel, Field


class Contract(BaseModel):
    id: str | None = None
    filename: str
    original_name: str
    upload_date: str = ""
    text_content: str = ""
    page_count: int = 0
    word_count: int = 0
    status: str = "uploaded"  # uploaded, analyzing, analyzed, error

    def model_post_init(self, __context):
        if not self.upload_date:
            self.upload_date = datetime.now().isoformat()
