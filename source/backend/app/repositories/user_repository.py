from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken
from app.models.user import User


class UserRepository:
    def get_by_id(self, db: Session, user_id: int) -> User | None:
        return db.get(User, user_id)

    def get_by_email(self, db: Session, email: str) -> User | None:
        stmt = select(User).where(User.email == email.lower())
        return db.scalar(stmt)

    def create(self, db: Session, **values) -> User:
        user = User(**values)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def save(self, db: Session, user: User) -> User:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def add_refresh_token(self, db: Session, user_id: int, jti: str, expires_at) -> RefreshToken:
        token = RefreshToken(user_id=user_id, jti=jti, expires_at=expires_at)
        db.add(token)
        db.commit()
        db.refresh(token)
        return token

    def get_refresh_token(self, db: Session, jti: str) -> RefreshToken | None:
        return db.scalar(select(RefreshToken).where(RefreshToken.jti == jti))

    def revoke_refresh_token(self, db: Session, token: RefreshToken) -> None:
        token.revoked = True
        db.add(token)
        db.commit()
