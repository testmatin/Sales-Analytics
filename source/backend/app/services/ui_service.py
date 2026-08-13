from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.user import User
from app.repositories.notification_repository import NotificationRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import ROLE_LABELS


class UIService:
    def __init__(self):
        self.notifications_repo = NotificationRepository()
        self.users = UserRepository()

    @staticmethod
    def profile(user: User):
        return {"name":user.full_name, "role":ROLE_LABELS.get(user.role, user.role), "email":user.email, "phone":user.phone or "", "initials":user.initials}

    @staticmethod
    def notification(item):
        return {"id":item.id, "type":item.type, "title":item.title, "message":item.message, "time":item.display_time, "read":item.read, "route":item.route}

    def get_all(self, db: Session, user: User):
        return {"profile":self.profile(user), "notifications":self.notifications(db, user)}

    def get_profile(self, user: User):
        return self.profile(user)

    def update_profile(self, db: Session, user: User, payload: dict):
        if payload.get("email") and payload["email"].lower() != user.email.lower():
            existing = self.users.get_by_email(db, payload["email"].lower())
            if existing and existing.id != user.id:
                raise AppError("EMAIL_ALREADY_EXISTS", "Email is already registered", 409)
            user.email = payload["email"].lower()
        user.full_name = payload.get("name", user.full_name)
        user.phone = payload.get("phone") or None
        user.initials = payload.get("initials") or user.initials
        self.users.save(db, user)
        return self.profile(user)

    def notifications(self, db: Session, user: User):
        return [self.notification(x) for x in self.notifications_repo.list_for_user(db, user.id)]

    def mark_notification_read(self, db: Session, user: User, notification_id: int):
        item = self.notifications_repo.get_for_user(db, user.id, notification_id)
        if not item:
            raise AppError("NOTIFICATION_NOT_FOUND", "Notification not found", 404)
        item.read = True
        db.add(item)
        db.commit()
        return self.notifications(db, user)

    def mark_all_read(self, db: Session, user: User):
        return [self.notification(x) for x in self.notifications_repo.mark_all_read(db, user.id)]
