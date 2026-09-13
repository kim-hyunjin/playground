from exceptions import InvalidPinCodeError
from pydantic import BaseModel, field_validator


class PincodeRequest(BaseModel):
    pincode: str

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value):
        if not value.isdigit() or len(value) != 6:
            raise InvalidPinCodeError(value, "Pincode must be a 6-digit number.")
        return value


class LocationResponse(BaseModel):
    status: str = "success"
    pincode: str
    city: str
    state: str
    district: str


class BulkRequest(BaseModel):
    pincodes: list[str]

    @field_validator("pincodes")
    @classmethod
    def validate_pincodes(cls, values):
        if len(values) == 0:
            raise ValueError("Pincodes list cannot be empty.")
        if len(values) > 20:
            raise ValueError("Pincodes list cannot contain more than 20 pincodes.")

        for pincode in values:
            if not pincode.isdigit() or len(pincode) != 6:
                raise InvalidPinCodeError(
                    pincode,
                    f"Invalid pincode: {pincode}. Each pincode must be a 6-digit number.",
                )
        return values


class BulkResponse(BaseModel):
    status: str = "success"
    found: int
    not_found: int
    results: list[LocationResponse]
    missing: list[str] = []
