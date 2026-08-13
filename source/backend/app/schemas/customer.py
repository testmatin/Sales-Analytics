from pydantic import BaseModel, EmailStr


class CustomerCreate(BaseModel):
    fullName: str
    email: EmailStr | None = None
    phone: str | None = None
    city: str | None = None
    segment: str = "New"
    createdAt: str | None = None


class CustomerUpdate(BaseModel):
    fullName: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    city: str | None = None
    segment: str | None = None
