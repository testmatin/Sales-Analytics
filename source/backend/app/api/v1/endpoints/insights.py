from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.insight_service import InsightService

router = APIRouter()
service = InsightService()

@router.get("")
def insights(db: Session = Depends(get_db)):
    return service.list(db)
