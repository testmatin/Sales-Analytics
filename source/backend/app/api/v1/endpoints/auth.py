from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest
from app.services.auth_service import AuthService

router = APIRouter()
service = AuthService()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return service.register(db, payload.model_dump())


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return service.login(db, payload.email, payload.password)


@router.post("/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    return service.refresh(db, payload.refreshToken)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)):
    service.logout(db, payload.refreshToken)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return service.serialize_user(user)
