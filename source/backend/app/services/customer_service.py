from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.customer import Customer
from app.repositories.customer_repository import CustomerRepository


class CustomerService:
    def __init__(self):
        self.repo = CustomerRepository()

    @staticmethod
    def serialize(customer: Customer) -> dict:
        return {
            "id": customer.public_id,
            "fullName": customer.full_name,
            "email": customer.email,
            "phone": customer.phone,
            "city": customer.city,
            "segment": customer.segment,
            "createdAt": customer.display_created_at or customer.created_at.date().isoformat(),
        }

    def analytics(self, db: Session):
        summary = self.repo.summary(db)
        segments = self.repo.segments(db)
        if not summary:
            raise AppError("ANALYTICS_NOT_SEEDED", "Customer analytics data is not seeded", 503)
        return {
            "summary": {
                "total": summary.total, "new": summary.new, "returning": summary.returning_customers,
                "retentionRate": float(summary.retention_rate), "churnRate": float(summary.churn_rate),
                "lifetimeValue": int(summary.lifetime_value),
            },
            "segments": [
                {"name": x.name, "customers": x.customers, "averageSpend": int(x.average_spend), "revenueShare": float(x.revenue_share), "growth": float(x.growth)}
                for x in segments
            ],
        }

    def list(self, db: Session, page=1, page_size=20, search=None, city=None, segment=None):
        items, total = self.repo.list(db, page, page_size, search, city, segment)
        return {"items":[self.serialize(x) for x in items], "page":page, "page_size":page_size, "total":total, "pages":max(1,(total+page_size-1)//page_size)}

    def get(self, db: Session, customer_id: str):
        customer = self.repo.get_by_public_id(db, customer_id)
        if not customer:
            raise AppError("CUSTOMER_NOT_FOUND", "Customer not found", 404)
        return self.serialize(customer)

    def create(self, db: Session, payload: dict):
        ids = db.scalars(select(Customer.public_id)).all()
        numbers = [int(value.split("-")[-1]) for value in ids if value.startswith("C-") and value.split("-")[-1].isdigit()]
        next_number = max(numbers + [1000]) + 1
        customer = Customer(
            public_id=f"C-{next_number}", full_name=payload["fullName"], email=payload.get("email"), phone=payload.get("phone"),
            city=payload.get("city"), segment=payload.get("segment", "New"), display_created_at=payload.get("createdAt"), created_at=datetime.now(timezone.utc),
        )
        return self.serialize(self.repo.create(db, customer))

    def update(self, db: Session, customer_id: str, payload: dict):
        customer = self.repo.get_by_public_id(db, customer_id)
        if not customer:
            raise AppError("CUSTOMER_NOT_FOUND", "Customer not found", 404)
        mapping = {"fullName":"full_name", "email":"email", "phone":"phone", "city":"city", "segment":"segment"}
        for key, attr in mapping.items():
            if key in payload and payload[key] is not None:
                setattr(customer, attr, payload[key])
        return self.serialize(self.repo.save(db, customer))
