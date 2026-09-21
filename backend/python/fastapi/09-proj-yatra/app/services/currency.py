import httpx
from models.model import ExchangeRate

FRANKFURTER_URL = "https://api.frankfurter.dev/v1/latest"

DESTINATION_CURRENCY = {
    "manali": "INR",
    "goa": "INR",
    "jaipur": "INR",
}


def get_currency_for_destination(destination: str) -> str:
    """
    Looks up the local currency code for a known destination.

    Args:
        destination (str): The travel destination (e.g. "Goa").

    Returns:
        str: The ISO currency code used at the destination (e.g. "INR").

    Raises:
        ValueError: If the destination has no known currency mapping.
    """
    currency = DESTINATION_CURRENCY.get(destination.lower())
    if currency is None:
        raise ValueError(f"No currency mapping for destination: {destination}")

    return currency


async def get_exchange_rate(base_currency: str, target_currency: str) -> ExchangeRate:
    """
    Fetches the latest exchange rate between two currencies via the
    Frankfurter API. No API key is required.

    Args:
        base_currency (str): The currency to convert from (e.g. "USD").
        target_currency (str): The currency to convert to (e.g. "INR").

    Returns:
        ExchangeRate: The latest rate from base_currency to target_currency.

    Raises:
        ValueError: If no rate is available for the given currency pair.
        httpx.HTTPStatusError: If a request to Frankfurter fails.
    """
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            FRANKFURTER_URL,
            params={"from": base_currency, "to": target_currency},
        )
        response.raise_for_status()
        data = response.json()

    rate = data["rates"].get(target_currency)
    if rate is None:
        raise ValueError(
            f"Exchange rate not available for {base_currency} -> {target_currency}"
        )

    return ExchangeRate(
        base_currency=data["base"],
        target_currency=target_currency,
        rate=rate,
        date=data["date"],
    )


async def get_exchange_rate_for_destination(
    destination: str, base_currency: str
) -> ExchangeRate | None:
    """
    Looks up the local currency for a destination and fetches the
    exchange rate for it in one call.

    Args:
        destination (str): The travel destination (e.g. "Goa").
        base_currency (str): The currency to convert from (e.g. "USD").

    Returns:
        ExchangeRate | None: The exchange rate, or None if the
            destination has no known currency mapping.

    Raises:
        httpx.HTTPStatusError: If a request to Frankfurter fails.
    """
    try:
        target_currency = get_currency_for_destination(destination)
    except ValueError:
        return None

    return await get_exchange_rate(base_currency, target_currency)
