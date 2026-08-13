from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import CustomerSegmentStat, CustomerSummary
from app.models.customer import Customer


class CustomerRepository:
    def list(self, db: Session, page: int, page_size: int, search: str | None = None, city: str | None = None, segment: str | None = None):
        filters = []
        if search:
            q = f"%{search.strip()}%"
            filters.append((Customer.full_name.ilike(q)) | (Customer.public_id.ilike(q)) | (Customer.email.ilike(q)))
        if city:
            filters.append(Customer.city == city)
        if segment:
            filters.append(Customer.segment == segment)

        total = int(db.scalar(select(func.count(Customer.id)).where(*filters)) or 0)
        stmt = select(Customer).where(*filters).order_by(Customer.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
        return db.scalars(stmt).all(), total

    def get_by_public_id(self, db: Session, public_id: str) -> Customer | None:
        return db.scalar(select(Customer).where(Customer.public_id == public_id))

    def get_by_name(self, db: Session, full_name: str) -> Customer | None:
        return db.scalar(select(Customer).where(Customer.full_name == full_name))

    def create(self, db: Session, customer: Customer) -> Customer:
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    def save(self, db: Session, customer: Customer) -> Customer:
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    def summary(self, db: Session) -> CustomerSummary | None:
        return db.get(CustomerSummary, 1)

    def segments(self, db: Session):
        return db.scalars(select(CustomerSegmentStat).order_by(CustomerSegmentStat.id)).all()
