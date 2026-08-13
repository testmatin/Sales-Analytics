from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analytics import (
    Activity,
    CategorySalesStat,
    ChannelSalesStat,
    DashboardKPI,
    Insight,
    RegionStat,
    ReportDefinition,
    SalesTrend,
)


class AnalyticsRepository:
    def kpis(self, db: Session) -> DashboardKPI | None:
        return db.get(DashboardKPI, 1)

    def sales_trend(self, db: Session):
        return db.scalars(select(SalesTrend).order_by(SalesTrend.sort_order)).all()

    def category_sales(self, db: Session):
        return db.scalars(select(CategorySalesStat).order_by(CategorySalesStat.id)).all()

    def channel_sales(self, db: Session):
        return db.scalars(select(ChannelSalesStat).order_by(ChannelSalesStat.id)).all()

    def regions(self, db: Session):
        return db.scalars(select(RegionStat).order_by(RegionStat.revenue.desc())).all()

    def activities(self, db: Session):
        return db.scalars(select(Activity).order_by(Activity.id)).all()

    def insights(self, db: Session):
        return db.scalars(select(Insight).order_by(Insight.id)).all()

    def reports(self, db: Session):
        return db.scalars(select(ReportDefinition).order_by(ReportDefinition.id)).all()
