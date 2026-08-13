from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.repositories.analytics_repository import AnalyticsRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.services.order_service import OrderService
from app.services.product_service import ProductService


class DashboardService:
    def __init__(self):
        self.analytics = AnalyticsRepository()
        self.products = ProductRepository()
        self.orders = OrderRepository()
        self.product_service = ProductService()
        self.order_service = OrderService()

    @staticmethod
    def _trend_count(date_range: str) -> int:
        return {"7d": 4, "30d": 7, "90d": 10}.get(date_range, 7)

    def get_summary(self, db: Session):
        item = self.analytics.kpis(db)
        if not item:
            raise AppError("DASHBOARD_NOT_SEEDED", "Dashboard KPI data is not seeded", 503)
        return {
            "totalRevenue": int(item.total_revenue), "totalOrders": item.total_orders, "netProfit": int(item.net_profit),
            "totalCustomers": item.total_customers, "averageOrderValue": int(item.average_order_value), "conversionRate": float(item.conversion_rate),
            "revenueGrowth": float(item.revenue_growth), "ordersGrowth": float(item.orders_growth), "profitGrowth": float(item.profit_growth),
            "customersGrowth": float(item.customers_growth), "aovGrowth": float(item.aov_growth), "conversionGrowth": float(item.conversion_growth),
        }

    def get_sales_chart(self, db: Session, date_range="30d"):
        items = self.analytics.sales_trend(db)[-self._trend_count(date_range):]
        return [{"label":x.label, "revenue":float(x.revenue), "profit":float(x.profit), "orders":x.orders} for x in items]

    def get_top_products(self, db: Session, limit=5):
        return [self.product_service.serialize(x) for x in self.products.top(db, limit)]

    def get_recent_orders(self, db: Session, limit=5):
        return [self.order_service.serialize(x) for x in self.orders.recent(db, limit)]

    def get_activity(self, db: Session):
        return [{"type":x.type, "title":x.title, "time":x.time} for x in self.analytics.activities(db)]

    def get_dashboard(self, db: Session, date_range="30d"):
        return {
            "summary": self.get_summary(db),
            "salesTrend": self.get_sales_chart(db, date_range),
            "categorySales": [{"name":x.name, "value":float(x.value)} for x in self.analytics.category_sales(db)],
            "channelSales": [{"name":x.name, "revenue":float(x.revenue)} for x in self.analytics.channel_sales(db)],
            "regions": [{"name":x.name, "revenue":int(x.revenue), "orders":x.orders, "share":float(x.share)} for x in self.analytics.regions(db)],
            "activity": self.get_activity(db),
        }
