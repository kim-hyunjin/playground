import uvicorn
from fastapi import FastAPI, Request

"""
Lifecycle of a FastAPI application:

client sends HTTP request
-> UVICORN ASGI server receives the request - raw bytes
-> STARLETTE - route matching
-> Middleware - CORS, auth, logging, etc.
-> Dependency injection resolves - DB connection, etc.
-> Pydantic validation - request body, query params, etc.
-> your endpoint function is called
-> Pydantic validation - response body, headers, etc.
-> Middleware - response processing, logging, etc.
-> UVICORN ASGI server sends the response back to the client - raw bytes
"""

"""
async def vs def:

|async def|def|
|---|---|
|httpx, aiohttp, database|requests|
|I/O bound|CPU bound|
|runs on the main event loop|runs in a thread pool(FastAPI handles this automatically)|

**If you use async def but call sync code inside it, it will block the event loop and slow down your application. = terrible performance.**
"""

app = FastAPI(
    title="Swiggy Order Service",
    description=(
        "Internal API for managing orders, Handle creation, tracking of delivery systems"
    ),
    version="1.0.0",
    docs_url="/docs",  # swagger UI
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


@app.get("/")
def read_root():
    """Root endpoint - Health check"""
    # FastAPI converts this dict into JSON
    return {"message": "Welcome to Swiggy Order Service!", "status": "healthy"}


@app.get("/about")
def about():
    """Returns API metadata"""
    return {
        "service": "order-service",
        "team": "backend platform",
        "region": "ap-south-1",
        "version": "1.0.0",
    }


@app.get("/orders")
def list_orders():
    """List recent orders"""
    return {
        "orders": [
            {"id": 1, "item": "Pizza", "status": "delivered"},
            {"id": 2, "item": "Burger", "status": "in transit"},
            {"id": 3, "item": "Sushi", "status": "preparing"},
        ]
    }


@app.get("/orders/status")
def order_status():
    """Get order status"""
    return {"total_today": 2_234_23, "top_city": "Bangalore", "top_item": "Pizza"}


@app.get("/debug/request-info")
async def request_info(request: Request):
    """Inspect the raw request object"""
    return {
        "method": request.method,
        "url": str(request.url),
        "headers": dict(request.headers),
        "path_params": request.path_params,
        "query_params": dict(request.query_params),
        "client": request.client.host if request.client else None,
    }


@app.get(
    "/orders/active",
    summary="Get active orders",
    description=(
        "Returns all orders that are currently being prepared or are out for delivery"
    ),
    tags=["orders"],
    response_description="List of active orders",
    deprecated=False,
)
def get_active_orders():
    """Get all active orders"""
    return {
        "active_orders": [
            {"id": 1, "item": "Pizza", "status": "preparing"},
            {"id": 2, "item": "Burger", "status": "out for delivery"},
        ]
    }


@app.get("/restaurants", tags=["restaurants"])
def list_restaurants():
    """List all restaurants"""
    return {
        "restaurants": [
            {"id": 1, "name": "Pizza Hut", "rating": 4.5},
            {"id": 2, "name": "Burger King", "rating": 4.0},
            {"id": 3, "name": "Sushi Express", "rating": 4.8},
        ]
    }


if __name__ == "__main__":
    uvicorn.run("01-fastapi-foundation:app", host="0.0.0.0", port=8000, reload=True)
