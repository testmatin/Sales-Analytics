from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.geography_service import GeographyService

router = APIRouter()
service = GeographyService()

@router.get("/sales")
def sales(db: Session = Depends(get_db)):
    return service.sales(db)

@router.get("/cities")
def cities(db: Session = Depends(get_db)):
    return service.cities(db)

@router.get("/regions")
def regions(db: Session = Depends(get_db)):
    return service.regions(db)
