from typing import Literal
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    category: str = Field(min_length=2, max_length=120)
    unitsSold: int = 0
    revenue: int = 0
    growth: float = 0
    stock: int = 0
    status: Literal["active", "low_stock"] = "active"


class ProductUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    unitsSold: int | None = None
    revenue: int | None = None
    growth: float | None = None
    stock: int | None = None
    status: Literal["active", "low_stock"] | None = None
