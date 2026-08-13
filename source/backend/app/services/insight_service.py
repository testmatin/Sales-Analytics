from sqlalchemy.orm import Session

from app.repositories.analytics_repository import AnalyticsRepository


class InsightService:
    def __init__(self):
        self.repo = AnalyticsRepository()

    def list(self, db: Session):
        return [{"id":x.id, "type":x.type, "title":x.title, "description":x.description, "score":x.score} for x in self.repo.insights(db)]
