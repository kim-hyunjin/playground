from fastapi import APIRouter, HTTPException
from models.model import TravelRequest
from services.weather import get_weather_forecast

router = APIRouter(
    prefix="/plan",
    tags=["plan"],
)


@router.post("/")
async def create_travel_plan(request: TravelRequest):
    """
    Aggregate Weather, Currency, and Places data into a single travel plan
    """

    if request.start_date > request.end_date:
        raise HTTPException(
            status_code=400, detail="start_date must be before end_date"
        )

    trip_days = (request.end_date - request.start_date).days

    if trip_days < 1:
        raise HTTPException(status_code=400, detail="trip must be at least 1 day")

    if trip_days > 14:
        raise HTTPException(status_code=400, detail="trip must be at most 14 days")

    # weather data, currency rate, places data fetched and aggregate

    weather_forecast = await get_weather_forecast(
        request.destination, request.start_date, request.end_date
    )

    return {
        "message": "Travel plan created successfully",
        "weather_forecast": weather_forecast,
    }
