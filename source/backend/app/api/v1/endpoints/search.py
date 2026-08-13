from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.search_service import SearchService

router = APIRouter()
service = SearchService()

@router.get("")
def search(q: str = Query(..., min_length=1), limit: int = Query(12, ge=1, le=30), db: Session = Depends(get_db)):
    return service.search(db, q, limit)
