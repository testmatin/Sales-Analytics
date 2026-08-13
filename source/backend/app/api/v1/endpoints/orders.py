from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, require_roles
from app.schemas.order import OrderCreate, OrderUpdate
from app.services.order_service import OrderService

router = APIRouter()
service = OrderService()

@router.get("")
def list_orders(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100), search: str | None = None, status_filter: str | None = Query(None, alias="status"), city: str | None = None, min_amount: int | None = Query(None, ge=0), max_amount: int | None = Query(None, ge=0), sort_by: str = "id", sort_order: str = Query("desc", pattern="^(asc|desc)$"), db: Session = Depends(get_db)):
    return service.list(db, page, page_size, search, status_filter, city, min_amount, max_amount, sort_by, sort_order)

@router.get("/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    return service.get(db, order_id)

@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_roles("admin", "manager"))])
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    return service.create(db, payload.model_dump())

@router.patch("/{order_id}", dependencies=[Depends(require_roles("admin", "manager"))])
def update_order(order_id: str, payload: OrderUpdate, db: Session = Depends(get_db)):
    return service.update(db, order_id, payload.model_dump(exclude_unset=True))
