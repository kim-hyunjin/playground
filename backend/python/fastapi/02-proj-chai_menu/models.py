from pydantic import BaseModel


class MenuItem(BaseModel):
    id: int
    name: str
    category: str
    description: str
    price: float
    available: bool


class MenuResponse(BaseModel):
    status: str = "success"
    count: int
    items: list[MenuItem]
