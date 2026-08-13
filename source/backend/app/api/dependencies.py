from collections.abc import Callable, Generator

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import decode_token
from app.database.session import SessionLocal
from app.models.user import User
from app.repositories.user_repository import UserRepository


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AppError("NOT_AUTHENTICATED", "Authentication required", 401)

    token = authorization.split(" ", 1)[1].strip()
    payload = decode_token(token, expected_type="access")
    user_id = payload.get("sub")
    if not user_id:
        raise AppError("INVALID_TOKEN", "Invalid access token", 401)

    user = UserRepository().get_by_id(db, int(user_id))
    if not user or not user.is_active:
        raise AppError("USER_INACTIVE", "User is inactive or does not exist", 401)
    return user


def require_roles(*roles: str) -> Callable:
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise AppError("FORBIDDEN", "You do not have permission for this action", 403)
        return user

    return dependency
