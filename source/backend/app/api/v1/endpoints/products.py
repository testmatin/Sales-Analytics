from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, require_roles
from app.schemas.product import ProductCreate, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter()
service = ProductService()

@router.get("")
def list_products(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100), search: str | None = None, category: str | None = None, status_filter: str | None = Query(None, alias="status"), sort_by: str = "revenue", sort_order: str = Query("desc", pattern="^(asc|desc)$"), db: Session = Depends(get_db)):
    return service.list(db, page, page_size, search, category, status_filter, sort_by, sort_order)

@router.get("/top")
def top_products(limit: int = Query(5, ge=1, le=20), db: Session = Depends(get_db)):
    return service.list(db, 1, limit, sort_by="revenue", sort_order="desc")["items"]

@router.get("/performance")
def performance(db: Session = Depends(get_db)):
    return service.list(db, 1, 100, sort_by="growth", sort_order="desc")["items"]

@router.get("/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    return service.get(db, product_id)

@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_roles("admin", "manager"))])
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    return service.create(db, payload.model_dump())

@router.patch("/{product_id}", dependencies=[Depends(require_roles("admin", "manager"))])
def update_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)):
    return service.update(db, product_id, payload.model_dump(exclude_unset=True))

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_roles("admin"))])
def delete_product(product_id: str, db: Session = Depends(get_db)):
    service.delete(db, product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
