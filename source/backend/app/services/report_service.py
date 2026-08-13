import csv
import io
import json

from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.repositories.analytics_repository import AnalyticsRepository
from app.services.customer_service import CustomerService
from app.services.dashboard_service import DashboardService
from app.services.order_service import OrderService
from app.services.product_service import ProductService


class ReportService:
    def __init__(self):
        self.repo = AnalyticsRepository()
        self.dashboard = DashboardService()
        self.products = ProductService()
        self.customers = CustomerService()
        self.orders = OrderService()

    def list(self, db: Session):
        return [{"id":x.id, "title":x.title, "description":x.description, "formats":x.formats} for x in self.repo.reports(db)]

    def data(self, db: Session, report_type: str):
        if report_type == "sales":
            return [self.dashboard.get_summary(db)]
        if report_type == "products":
            return self.products.list(db, 1, 100)["items"]
        if report_type == "customers":
            return self.customers.list(db, 1, 100)["items"]
        if report_type == "orders":
            return self.orders.list(db, 1, 100)["items"]
        raise AppError("REPORT_NOT_FOUND", "Report not found", 404)

    def json_bytes(self, db: Session, report_type: str) -> bytes:
        return json.dumps(self.data(db, report_type), ensure_ascii=False, indent=2).encode("utf-8")

    def csv_bytes(self, db: Session, report_type: str) -> bytes:
        rows = self.data(db, report_type)
        output = io.StringIO()
        if rows:
            writer = csv.DictWriter(output, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)
        return ("\ufeff" + output.getvalue()).encode("utf-8")
