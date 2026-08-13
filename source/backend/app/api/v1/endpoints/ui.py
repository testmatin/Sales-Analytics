from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.ui import ProfileUpdate
from app.services.ui_service import UIService

router = APIRouter()
service = UIService()

@router.get("")
def ui_data(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return service.get_all(db, user)

@router.get("/profile")
def profile(user: User = Depends(get_current_user)):
    return service.get_profile(user)

@router.put("/profile")
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return service.update_profile(db, user, payload.model_dump())

@router.get("/notifications")
def notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return service.notifications(db, user)

@router.patch("/notifications/{notification_id}/read")
def mark_read(notification_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return service.mark_notification_read(db, user, notification_id)

@router.patch("/notifications/read-all")
def mark_all_read(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return service.mark_all_read(db, user)
