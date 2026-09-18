from datetime import date

import httpx
from models.model import DailyForecast, WeatherForecast

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

WEATHER_CODE_DESCRIPTIONS = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}


async def _geocode(client: httpx.AsyncClient, city: str) -> dict:
    geo_response = await client.get(GEOCODING_URL, params={"name": city, "count": 1})
    geo_response.raise_for_status()
    geo_results = geo_response.json().get("results")

    if not geo_results:
        raise ValueError(f"City not found: {city}")

    return geo_results[0]


async def get_weather_forecast(
    city: str, start_date: date, end_date: date
) -> WeatherForecast:
    """
    Fetches the daily weather forecast for a city over a date range.

    Geocodes the city name to coordinates first, then requests the
    daily min/max temperature, precipitation probability, average
    relative humidity, and a weather condition (e.g. "Clear sky",
    "Overcast") for each day between start_date and end_date
    (inclusive). Humidity is only available from Open-Meteo as an
    hourly value, so it is averaged per day here. No API key is
    required. Open-Meteo only provides forecasts up to 16 days ahead.

    Args:
        city (str): The name of the city to look up.
        start_date (date): The first day of the forecast range.
        end_date (date): The last day of the forecast range.

    Returns:
        WeatherForecast: The daily forecast for each day in the range.

    Raises:
        ValueError: If the city cannot be found or start_date is after
            end_date.
        httpx.HTTPStatusError: If a request to Open-Meteo fails.
    """
    if start_date > end_date:
        raise ValueError("start_date must not be after end_date")

    async with httpx.AsyncClient(timeout=10) as client:
        location = await _geocode(client, city)
        latitude = location["latitude"]
        longitude = location["longitude"]

        forecast_response = await client.get(
            FORECAST_URL,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "daily": [
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "precipitation_probability_max",
                    "weathercode",
                ],
                "hourly": "relative_humidity_2m",
                "timezone": "auto",
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
            },
        )
        forecast_response.raise_for_status()
        forecast_json = forecast_response.json()
        daily = forecast_json["daily"]
        hourly_humidity_by_date = _group_hourly_humidity_by_date(forecast_json["hourly"])

    return WeatherForecast(
        city=location.get("name", city),
        latitude=latitude,
        longitude=longitude,
        daily=[
            DailyForecast(
                date=day,
                temp_min_c=temp_min,
                temp_max_c=temp_max,
                precipitation_probability=precipitation_probability,
                humidity_avg_percent=_average(hourly_humidity_by_date[day]),
                weather_code=weather_code,
                weather_description=WEATHER_CODE_DESCRIPTIONS.get(
                    weather_code, "Unknown"
                ),
            )
            for day, temp_min, temp_max, precipitation_probability, weather_code in zip(
                daily["time"],
                daily["temperature_2m_min"],
                daily["temperature_2m_max"],
                daily["precipitation_probability_max"],
                daily["weathercode"],
            )
        ],
    )


def _group_hourly_humidity_by_date(hourly: dict) -> dict[str, list[float]]:
    humidity_by_date: dict[str, list[float]] = {}

    for timestamp, humidity in zip(hourly["time"], hourly["relative_humidity_2m"]):
        day = timestamp.split("T")[0]
        humidity_by_date.setdefault(day, []).append(humidity)

    return humidity_by_date


def _average(values: list[float]) -> float:
    return round(sum(values) / len(values), 1)
