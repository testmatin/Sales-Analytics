from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, require_roles
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.services.customer_service import CustomerService

router = APIRouter()
service = CustomerService()

@router.get("")
def list_customers(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100), search: str | None = None, city: str | None = None, segment: str | None = None, db: Session = Depends(get_db)):
    return service.list(db, page, page_size, search, city, segment)

@router.get("/analytics")
def analytics(db: Session = Depends(get_db)):
    return service.analytics(db)

@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    return service.analytics(db)["summary"]

@router.get("/segments")
def segments(db: Session = Depends(get_db)):
    return service.analytics(db)["segments"]

@router.get("/growth")
def growth(db: Session = Depends(get_db)):
    return [{"name": item["name"], "growth": item["growth"]} for item in service.analytics(db)["segments"]]

@router.get("/{customer_id}")
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    return service.get(db, customer_id)

@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_roles("admin", "manager"))])
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    return service.create(db, payload.model_dump())

@router.patch("/{customer_id}", dependencies=[Depends(require_roles("admin", "manager"))])
def update_customer(customer_id: str, payload: CustomerUpdate, db: Session = Depends(get_db)):
    return service.update(db, customer_id, payload.model_dump(exclude_unset=True))
