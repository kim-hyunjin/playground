from enum import Enum

from pydantic import BaseModel, Field


class Severity(str, Enum):
    HEALTHY = "healthy"
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"


class TreatmentType(str, Enum):
    ORGANIC = "organic"
    CHEMICAL = "chemical"
    PREVENTIVE = "preventive"


class Urgency(str, Enum):
    IMMEDIATE = "immediate"
    WITHIN_WEEK = "within_week"
    SEASONAL = "seasonal"


class Disease(BaseModel):
    name: str
    confidence: float = Field(ge=0.0, le=1.0)
    description: str


class Treatment(BaseModel):
    treatment_name: str
    treatment_type: TreatmentType
    instructions: str
    urgency: Urgency


class CropAnalysis(BaseModel):
    crop_detected: str
    severity: Severity
    diseases: list[Disease]
    treatments: list[Treatment]
    overall_health: str
    additional_notes: str


class BatchItemResult(BaseModel):
    filename: str
    analysis: CropAnalysis | None = None
    error: str | None = None


class BatchAnalysis(BaseModel):
    results: list[BatchItemResult]
