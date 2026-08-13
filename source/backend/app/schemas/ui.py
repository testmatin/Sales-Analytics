from pydantic import BaseModel, EmailStr, Field


class ProfileUpdate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    role: str = ""
    email: EmailStr
    phone: str = ""
    initials: str = Field(min_length=1, max_length=12)
