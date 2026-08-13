from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.dashboard_service import DashboardService

router = APIRouter()
service = DashboardService()

@router.get("")
def dashboard(date_range: str = Query("30d", pattern="^(7d|30d|90d)$"), db: Session = Depends(get_db)):
    return service.get_dashboard(db, date_range)

@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    return service.get_summary(db)

@router.get("/sales-chart")
def sales_chart(date_range: str = Query("30d", pattern="^(7d|30d|90d)$"), db: Session = Depends(get_db)):
    return service.get_sales_chart(db, date_range)

@router.get("/top-products")
def top_products(limit: int = Query(5, ge=1, le=20), db: Session = Depends(get_db)):
    return service.get_top_products(db, limit)

@router.get("/recent-orders")
def recent_orders(limit: int = Query(5, ge=1, le=20), db: Session = Depends(get_db)):
    return service.get_recent_orders(db, limit)

@router.get("/activity")
def activity(db: Session = Depends(get_db)):
    return service.get_activity(db)
