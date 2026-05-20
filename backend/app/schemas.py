from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    email: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class UserProfileSetup(BaseModel):
    email: str
    full_name: str
    skill: str
    city: str
    biography: str = ""

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    skill: Optional[str]
    city: Optional[str]
    biography: Optional[str]
    wallet_balance: float

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class VoiceRequest(BaseModel):
    transcript: str
    skill: str
    location: str

class JobSchema(BaseModel):
    id: int
    title: str
    employer: str
    details: str
    distance: str
    rate: int
    confidence: float
    badge: str
    category: str
    customer_phone: Optional[str]
    customer_email: Optional[str]
    customer_name: Optional[str]

    class Config:
        from_attributes = True

class NegotiateRequest(BaseModel):
    job_id: int
    base_rate: int

class EmployerVerifyRequest(BaseModel):
    employer_phone: str

class WorkVerificationRequest(BaseModel):
    job_id: int
    image_uri: str
