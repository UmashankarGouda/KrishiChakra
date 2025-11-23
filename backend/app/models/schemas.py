from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class FieldInput(BaseModel):
    id: str
    name: str
    location: str
    size: float
    soil_type: str
    climate_zone: str
    season: str
    current_crop: Optional[str] = None
    previous_crops: Optional[List[str]] = []
    
class CustomPlanRequest(BaseModel):
    field: FieldInput
    planning_years: int = Field(default=3, alias="planningYears")
    specific_requirements: Optional[str] = Field(default=None, alias="specificRequirements")
    
    class Config:
        populate_by_name = True

class CropRotationStep(BaseModel):
    year: int
    season: str
    crop: str
    reason: str
    expected_yield: str = Field(alias="expectedYield")
    soil_benefits: List[str] = Field(alias="soilBenefits")
    
    class Config:
        populate_by_name = True

class CropRotationPlan(BaseModel):
    id: str
    field_id: str = Field(alias="fieldId")
    planning_years: int = Field(alias="planningYears")
    crops: List[CropRotationStep]
    overall_benefits: List[str] = Field(alias="overallBenefits")
    profit_estimate: str = Field(alias="profitEstimate")
    risk_assessment: str = Field(alias="riskAssessment")
    recommendations: List[str]
    created_at: str = Field(alias="createdAt")
    
    class Config:
        populate_by_name = True  # Allow both snake_case and camelCase
        json_schema_extra = {
            "example": {
                "id": "plan-123",
                "fieldId": "field-456",
                "planningYears": 3,
                "crops": [],
                "overallBenefits": ["Soil health improvement"],
                "profitEstimate": "₹1,50,000",
                "riskAssessment": "Medium risk",
                "recommendations": ["Use organic fertilizers"],
                "createdAt": "2025-10-24T10:00:00"
            }
        }

class RAGResponse(BaseModel):
    success: bool
    plan: Optional[CropRotationPlan] = None
    error: Optional[str] = None
    processing_time: Optional[float] = None