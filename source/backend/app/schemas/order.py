from typing import Literal
from pydantic import BaseModel

OrderStatus = Literal["completed", "processing", "pending", "refunded"]


class OrderCreate(BaseModel):
    customer: str
    product: str
    amount: int
    status: OrderStatus = "pending"
    payment: str = "آنلاین"
    city: str
    date: str


class OrderUpdate(BaseModel):
    customer: str | None = None
    product: str | None = None
    amount: int | None = None
    status: OrderStatus | None = None
    payment: str | None = None
    city: str | None = None
    date: str | None = None
