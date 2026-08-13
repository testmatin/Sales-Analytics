from sqlalchemy.orm import Session

from app.repositories.analytics_repository import AnalyticsRepository


class GeographyService:
    def __init__(self):
        self.repo = AnalyticsRepository()

    def regions(self, db: Session):
        return [{"name":x.name, "revenue":int(x.revenue), "orders":x.orders, "share":float(x.share)} for x in self.repo.regions(db)]

    def cities(self, db: Session):
        return self.regions(db)

    def sales(self, db: Session):
        return {"regions": self.regions(db)}
