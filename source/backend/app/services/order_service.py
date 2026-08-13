from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.repositories.customer_repository import CustomerRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository


class OrderService:
    def __init__(self):
        self.repo = OrderRepository()
        self.customers = CustomerRepository()
        self.products = ProductRepository()

    @staticmethod
    def serialize(order: Order) -> dict:
        product_name = order.items[0].product.name if order.items else "—"
        return {
            "id": order.public_id,
            "customer": order.customer.full_name,
            "product": product_name,
            "amount": int(order.total_amount),
            "status": order.status,
            "payment": order.payment_method,
            "city": order.city or "",
            "date": order.display_date or order.created_at.date().isoformat(),
        }

    def list(self, db: Session, page=1, page_size=20, search=None, status=None, city=None, min_amount=None, max_amount=None, sort_by="id", sort_order="desc"):
        items, total = self.repo.list(db, page, page_size, search, status, city, min_amount, max_amount, sort_by, sort_order)
        return {"items":[self.serialize(x) for x in items], "page":page, "page_size":page_size, "total":total, "pages":max(1,(total+page_size-1)//page_size)}

    def get(self, db: Session, order_id: str):
        order = self.repo.get_by_public_id(db, order_id)
        if not order:
            raise AppError("ORDER_NOT_FOUND", "Order not found", 404)
        return self.serialize(order)

    def create(self, db: Session, payload: dict):
        customer = self.customers.get_by_name(db, payload["customer"])
        product = self.products.get_by_name(db, payload["product"])
        if not customer:
            raise AppError("CUSTOMER_NOT_FOUND", "Customer not found", 404)
        if not product:
            raise AppError("PRODUCT_NOT_FOUND", "Product not found", 404)
        ids = db.scalars(select(Order.public_id)).all()
        numbers = [int(value.split("-")[-1]) for value in ids if value.startswith("ORD-") and value.split("-")[-1].isdigit()]
        next_number = max(numbers + [48000]) + 1
        amount = Decimal(str(payload["amount"]))
        order = Order(
            public_id=f"ORD-{next_number}", customer_id=customer.id, status=payload.get("status", "pending"), total_amount=amount,
            payment_method=payload.get("payment", "آنلاین"), city=payload.get("city"), display_date=payload.get("date"), created_at=datetime.now(timezone.utc),
        )
        item = OrderItem(order_id=0, product_id=product.id, quantity=1, unit_price=amount)
        return self.serialize(self.repo.create(db, order, item))

    def update(self, db: Session, order_id: str, payload: dict):
        order = self.repo.get_by_public_id(db, order_id)
        if not order:
            raise AppError("ORDER_NOT_FOUND", "Order not found", 404)
        if payload.get("customer"):
            customer = self.customers.get_by_name(db, payload["customer"])
            if not customer:
                raise AppError("CUSTOMER_NOT_FOUND", "Customer not found", 404)
            order.customer_id = customer.id
        if payload.get("product"):
            product = self.products.get_by_name(db, payload["product"])
            if not product:
                raise AppError("PRODUCT_NOT_FOUND", "Product not found", 404)
            if order.items:
                order.items[0].product_id = product.id
        mapping = {"amount":"total_amount", "status":"status", "payment":"payment_method", "city":"city", "date":"display_date"}
        for key, attr in mapping.items():
            if key in payload and payload[key] is not None:
                setattr(order, attr, payload[key])
        return self.serialize(self.repo.save(db, order))
