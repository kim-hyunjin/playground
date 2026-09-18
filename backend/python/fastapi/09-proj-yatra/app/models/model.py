from datetime import date

from pydantic import BaseModel


class TravelRequest(BaseModel):
    destination: str
    start_date: date
    end_date: date
    base_currency: str = "INR"


class DailyForecast(BaseModel):
    date: date
    temp_min_c: float
    temp_max_c: float
    precipitation_probability: int
    humidity_avg_percent: float
    weather_code: int
    weather_description: str


class WeatherForecast(BaseModel):
    city: str
    latitude: float
    longitude: float
    daily: list[DailyForecast]
