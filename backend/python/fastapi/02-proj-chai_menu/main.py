from fastapi import FastAPI, HTTPException, Query
from models import MenuResponse

app = FastAPI(
    title="Chai Menu API",
    description="Read only menu API for Kiosk and mobile apps",
)


@app.get("/")
def root():
    return {"message": "Welcome to Chai Menu API!"}


@app.get("/menu", response_model=MenuResponse)
def get_menu(
    category: str = Query(
        None, description="Filter menu items by category (e.g., 'chai', 'herbal')"
    ),
):
    from data import menu_items

    filtered_items = [
        item for item in menu_items if category is None or item["category"] == category
    ]
    if not filtered_items:
        raise HTTPException(
            status_code=404, detail=f"No menu items found in category: {category}"
        )
    return MenuResponse(count=len(filtered_items), items=filtered_items)


@app.get("/menu/{item_id}", response_model=MenuResponse)
def get_menu_item(item_id: int):
    from data import menu_items

    item = next((item for item in menu_items if item["id"] == item_id), None)
    if not item:
        raise HTTPException(
            status_code=404, detail=f"Menu item with ID {item_id} not found"
        )
    return MenuResponse(count=1, items=[item])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
