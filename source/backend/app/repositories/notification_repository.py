from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:
    def list_for_user(self, db: Session, user_id: int):
        stmt = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc(), Notification.id.desc())
        return db.scalars(stmt).all()

    def get_for_user(self, db: Session, user_id: int, notification_id: int) -> Notification | None:
        stmt = select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
        return db.scalar(stmt)

    def mark_all_read(self, db: Session, user_id: int):
        items = self.list_for_user(db, user_id)
        for item in items:
            item.read = True
        db.commit()
        return self.list_for_user(db, user_id)
