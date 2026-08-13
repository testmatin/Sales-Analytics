from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()
service = AnalyticsService()

@router.get("")
def sales(date_range: str = Query("30d", pattern="^(7d|30d|90d)$"), db: Session = Depends(get_db)):
    return {"summary": service.summary(db), "trend": service.trend(db, date_range), "categoryDistribution": service.category_distribution(db)}

@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    return service.summary(db)

@router.get("/trend")
def trend(date_range: str = Query("30d", pattern="^(7d|30d|90d)$"), db: Session = Depends(get_db)):
    return service.trend(db, date_range)

@router.get("/comparison")
def comparison(db: Session = Depends(get_db)):
    return service.comparison(db)

@router.get("/category-distribution")
def category_distribution(db: Session = Depends(get_db)):
    return service.category_distribution(db)
