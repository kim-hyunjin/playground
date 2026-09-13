from fastapi import FastAPI
from exceptions import (
    PinCodeNotFoundError, 
    InvalidPinCodeError, 
    pin_code_not_found_handler, 
    invalid_pin_code_handler
)
from models import PincodeRequest, BulkRequest, BulkResponse, LocationResponse
from data import pincode_db

app = FastAPI(
    title="Pincode lookup API",
    description="Auto fill city and state from Indian pincode",
)

# Register custom exception handlers
app.add_exception_handler(PinCodeNotFoundError, pin_code_not_found_handler)
app.add_exception_handler(InvalidPinCodeError, invalid_pin_code_handler)

@app.get("/")
def root():
    return {"message": "Welcome to Pincode lookup API!"}

@app.post("/pincode", response_model=LocationResponse)
def lookup_pincode(request: PincodeRequest):
    if request.pincode not in pincode_db:
        raise PinCodeNotFoundError(request.pincode)
    
    return pincode_db[request.pincode]

@app.post("/pincode/bulk", response_model=BulkResponse)
def bulk_lookup_pincodes(request: BulkRequest):
    found = []
    missing = []
    for pincode in request.pincodes:
        if pincode in pincode_db:
            found.append(pincode_db[pincode])
        else:
            missing.append(pincode)

    return BulkResponse(found=len(found), results=found, not_found=len(missing), missing=missing)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)