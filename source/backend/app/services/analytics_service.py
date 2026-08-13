from sqlalchemy.orm import Session

from app.services.dashboard_service import DashboardService


class AnalyticsService:
    def __init__(self):
        self.dashboard = DashboardService()

    def summary(self, db: Session):
        return self.dashboard.get_summary(db)

    def trend(self, db: Session, date_range="30d"):
        return self.dashboard.get_sales_chart(db, date_range)

    def category_distribution(self, db: Session):
        return self.dashboard.get_dashboard(db)["categorySales"]

    def comparison(self, db: Session):
        summary = self.summary(db)
        return {
            "revenueGrowth": summary["revenueGrowth"], "ordersGrowth": summary["ordersGrowth"],
            "profitGrowth": summary["profitGrowth"], "customersGrowth": summary["customersGrowth"],
        }
