from fastapi.requests import Request
from fastapi.responses import JSONResponse


class PinCodeNotFoundError(Exception):
    def __init__(self, pincode: str):
        self.pincode = pincode


class InvalidPinCodeError(Exception):
    def __init__(self, pincode: str, reason: str = "Invalid pincode format"):
        self.pincode = pincode
        self.reason = reason


# Custom exception handlers
async def pin_code_not_found_handler(request: Request, exc: PinCodeNotFoundError):
    return JSONResponse(
        status_code=404,
        content={
            "error": "pincode_not_found",
            "message": f"No location found for pincode: {exc.pincode}",
        },
    )


async def invalid_pin_code_handler(request: Request, exc: InvalidPinCodeError):
    return JSONResponse(
        status_code=400,
        content={
            "error": "invalid_pincode",
            "message": f"Invalid pincode {exc.pincode}: {exc.reason}",
        },
    )
