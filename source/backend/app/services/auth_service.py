from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository

ROLE_LABELS = {
    "admin": "مدیر سیستم",
    "manager": "مدیر",
    "analyst": "تحلیلگر",
    "viewer": "مشاهده‌گر",
}


class AuthService:
    def __init__(self):
        self.repo = UserRepository()

    @staticmethod
    def serialize_user(user: User) -> dict:
        return {
            "id": user.id,
            "email": user.email,
            "name": user.full_name,
            "phone": user.phone or "",
            "initials": user.initials,
            "role": user.role,
            "roleLabel": ROLE_LABELS.get(user.role, user.role),
            "isActive": user.is_active,
        }

    def register(self, db: Session, payload: dict) -> dict:
        email = payload["email"].strip().lower()
        if self.repo.get_by_email(db, email):
            raise AppError("EMAIL_ALREADY_EXISTS", "Email is already registered", 409)
        name = payload["name"].strip()
        initials = payload.get("initials") or "".join(part[:1] for part in name.split()[:2]).upper() or "U"
        user = self.repo.create(
            db,
            email=email,
            full_name=name,
            phone=payload.get("phone") or None,
            initials=initials[:12],
            role="viewer",
            password_hash=hash_password(payload["password"]),
            is_active=True,
        )
        return self._issue_tokens(db, user)

    def login(self, db: Session, email: str, password: str) -> dict:
        user = self.repo.get_by_email(db, email.strip().lower())
        if not user or not verify_password(password, user.password_hash):
            raise AppError("INVALID_CREDENTIALS", "Invalid email or password", 401)
        if not user.is_active:
            raise AppError("USER_INACTIVE", "User account is inactive", 403)
        return self._issue_tokens(db, user)

    def _issue_tokens(self, db: Session, user: User) -> dict:
        access_token = create_access_token(user.id, user.role)
        refresh_token, jti, expires_at = create_refresh_token(user.id, user.role)
        self.repo.add_refresh_token(db, user.id, jti, expires_at)
        return {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "tokenType": "bearer",
            "user": self.serialize_user(user),
        }

    def refresh(self, db: Session, refresh_token: str) -> dict:
        payload = decode_token(refresh_token, expected_type="refresh")
        jti = payload.get("jti")
        user_id = int(payload.get("sub", 0))
        stored = self.repo.get_refresh_token(db, jti) if jti else None
        if not stored or stored.revoked or stored.user_id != user_id:
            raise AppError("REFRESH_TOKEN_REVOKED", "Refresh token is invalid or revoked", 401)

        expires_at = stored.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at <= datetime.now(timezone.utc):
            raise AppError("TOKEN_EXPIRED", "Refresh token has expired", 401)

        user = self.repo.get_by_id(db, user_id)
        if not user or not user.is_active:
            raise AppError("USER_INACTIVE", "User account is inactive", 401)

        self.repo.revoke_refresh_token(db, stored)
        return self._issue_tokens(db, user)

    def logout(self, db: Session, refresh_token: str) -> None:
        try:
            payload = decode_token(refresh_token, expected_type="refresh")
        except AppError:
            return
        jti = payload.get("jti")
        if not jti:
            return
        stored = self.repo.get_refresh_token(db, jti)
        if stored and not stored.revoked:
            self.repo.revoke_refresh_token(db, stored)
