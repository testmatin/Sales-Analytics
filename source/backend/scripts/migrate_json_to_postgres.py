from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models import (
    Activity,
    Category,
    CategorySalesStat,
    ChannelSalesStat,
    Customer,
    CustomerSegmentStat,
    CustomerSummary,
    DashboardKPI,
    Insight,
    Notification,
    Order,
    OrderItem,
    Product,
    RefreshToken,
    RegionStat,
    ReportDefinition,
    SalesTrend,
    User,
)

PERSIAN_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹", "0123456789")


def load_json(name: str):
    path = settings.SEED_DATA_DIR / name
    return json.loads(path.read_text(encoding="utf-8"))


def fake_jalali_to_gregorian(value: str | None) -> datetime:
    """Convert the project seed dates for year 1405 to Gregorian.

    The current seed data is in 1405. For unknown values, preserve ordering by
    falling back to the current time. The original display value is stored too.
    """
    if not value:
        return datetime.now(timezone.utc)
    try:
        clean = value.translate(PERSIAN_DIGITS)
        year, month, day = [int(part) for part in clean.split("/")]
        if year != 1405:
            return datetime.now(timezone.utc)
        month_lengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
        offset = sum(month_lengths[: month - 1]) + day - 1
        # 1405/01/01 ~= 2026-03-21 for the seed dataset.
        gregorian = datetime(2026, 3, 21, 12, 0, tzinfo=timezone.utc) + timedelta(days=offset)
        return gregorian
    except Exception:
        return datetime.now(timezone.utc)


def reset_database(db: Session) -> None:
    for model in [
        RefreshToken,
        Notification,
        OrderItem,
        Order,
        Customer,
        Product,
        Category,
        SalesTrend,
        CategorySalesStat,
        ChannelSalesStat,
        RegionStat,
        Activity,
        CustomerSegmentStat,
        CustomerSummary,
        DashboardKPI,
        Insight,
        ReportDefinition,
        User,
    ]:
        db.execute(delete(model))
    db.commit()


def seed_users(db: Session) -> dict[str, User]:
    dev_users = [
        ("admin@nexa.example.com", "آرمان رضایی", "AR", "admin", "Admin123!"),
        ("manager@nexa.example.com", "مدیر فروش", "MN", "manager", "Manager123!"),
        ("analyst@nexa.example.com", "تحلیلگر داده", "AN", "analyst", "Analyst123!"),
        ("viewer@nexa.example.com", "کاربر مشاهده‌گر", "VW", "viewer", "Viewer123!"),
    ]
    result: dict[str, User] = {}
    for email, name, initials, role, password in dev_users:
        user = db.scalar(select(User).where(User.email == email))
        if not user:
            user = User(
                email=email,
                full_name=name,
                initials=initials,
                role=role,
                password_hash=hash_password(password),
                is_active=True,
            )
            db.add(user)
            db.flush()
        result[email] = user
    db.commit()
    return result


def seed_core_data(db: Session) -> None:
    products_data = load_json("products.json")
    customer_records = load_json("customer_records.json")
    orders_data = load_json("orders.json")
    dashboard_data = load_json("dashboard.json")
    customer_analytics = load_json("customers.json")
    insights_data = load_json("insights.json")
    reports_data = load_json("reports.json")
    ui_data = load_json("ui.json")

    categories: dict[str, Category] = {}
    for row in products_data:
        name = row["category"]
        category = db.scalar(select(Category).where(Category.name == name))
        if not category:
            category = Category(name=name)
            db.add(category)
            db.flush()
        categories[name] = category

    products_by_name: dict[str, Product] = {}
    for row in products_data:
        product = db.scalar(select(Product).where(Product.public_id == row["id"]))
        units = int(row.get("unitsSold", 0))
        revenue = Decimal(str(row.get("revenue", 0)))
        unit_price = revenue / units if units else Decimal("0")
        if not product:
            product = Product(
                public_id=row["id"],
                name=row["name"],
                sku=f"SKU-{row['id'].replace('P-', '')}",
                unit_price=unit_price,
                stock=int(row.get("stock", 0)),
                status=row.get("status", "active"),
                units_sold=units,
                revenue=revenue,
                growth=Decimal(str(row.get("growth", 0))),
                category_id=categories[row["category"]].id,
            )
            db.add(product)
            db.flush()
        products_by_name[product.name] = product

    customers_by_name: dict[str, Customer] = {}
    for row in customer_records:
        customer = db.scalar(select(Customer).where(Customer.public_id == row["id"]))
        if not customer:
            customer = Customer(
                public_id=row["id"],
                full_name=row["fullName"],
                email=row.get("email"),
                phone=row.get("phone"),
                city=row.get("city"),
                segment=row.get("segment", "New"),
                display_created_at=row.get("createdAt"),
                created_at=fake_jalali_to_gregorian(row.get("createdAt")),
            )
            db.add(customer)
            db.flush()
        customers_by_name[customer.full_name] = customer

    for row in orders_data:
        order = db.scalar(select(Order).where(Order.public_id == row["id"]))
        if order:
            continue
        customer = customers_by_name[row["customer"]]
        product = products_by_name[row["product"]]
        order = Order(
            public_id=row["id"],
            customer_id=customer.id,
            status=row.get("status", "pending"),
            total_amount=Decimal(str(row.get("amount", 0))),
            payment_method=row.get("payment", "آنلاین"),
            city=row.get("city"),
            display_date=row.get("date"),
            created_at=fake_jalali_to_gregorian(row.get("date")),
        )
        db.add(order)
        db.flush()
        db.add(OrderItem(order_id=order.id, product_id=product.id, quantity=1, unit_price=Decimal(str(row.get("amount", 0)))))

    summary = dashboard_data["summary"]
    kpi = db.get(DashboardKPI, 1)
    if not kpi:
        kpi = DashboardKPI(id=1)
        db.add(kpi)
    kpi.total_revenue = summary["totalRevenue"]
    kpi.total_orders = summary["totalOrders"]
    kpi.net_profit = summary["netProfit"]
    kpi.total_customers = summary["totalCustomers"]
    kpi.average_order_value = summary["averageOrderValue"]
    kpi.conversion_rate = summary["conversionRate"]
    kpi.revenue_growth = summary["revenueGrowth"]
    kpi.orders_growth = summary["ordersGrowth"]
    kpi.profit_growth = summary["profitGrowth"]
    kpi.customers_growth = summary["customersGrowth"]
    kpi.aov_growth = summary["aovGrowth"]
    kpi.conversion_growth = summary["conversionGrowth"]

    if not db.scalar(select(SalesTrend.id).limit(1)):
        for index, row in enumerate(dashboard_data["salesTrend"], start=1):
            db.add(SalesTrend(sort_order=index, label=row["label"], revenue=row["revenue"], profit=row["profit"], orders=row["orders"]))

    if not db.scalar(select(CategorySalesStat.id).limit(1)):
        for row in dashboard_data["categorySales"]:
            db.add(CategorySalesStat(name=row["name"], value=row["value"]))

    if not db.scalar(select(ChannelSalesStat.id).limit(1)):
        for row in dashboard_data["channelSales"]:
            db.add(ChannelSalesStat(name=row["name"], revenue=row["revenue"]))

    if not db.scalar(select(RegionStat.id).limit(1)):
        for row in dashboard_data["regions"]:
            db.add(RegionStat(name=row["name"], revenue=row["revenue"], orders=row["orders"], share=row["share"]))

    if not db.scalar(select(Activity.id).limit(1)):
        for row in dashboard_data["activity"]:
            db.add(Activity(type=row["type"], title=row["title"], time=row["time"]))

    customer_summary = customer_analytics["summary"]
    summary_row = db.get(CustomerSummary, 1)
    if not summary_row:
        summary_row = CustomerSummary(id=1)
        db.add(summary_row)
    summary_row.total = customer_summary["total"]
    summary_row.new = customer_summary["new"]
    summary_row.returning_customers = customer_summary["returning"]
    summary_row.retention_rate = customer_summary["retentionRate"]
    summary_row.churn_rate = customer_summary["churnRate"]
    summary_row.lifetime_value = customer_summary["lifetimeValue"]

    if not db.scalar(select(CustomerSegmentStat.id).limit(1)):
        for row in customer_analytics["segments"]:
            db.add(CustomerSegmentStat(
                name=row["name"], customers=row["customers"], average_spend=row["averageSpend"],
                revenue_share=row["revenueShare"], growth=row["growth"],
            ))

    if not db.scalar(select(Insight.id).limit(1)):
        for row in insights_data:
            db.add(Insight(id=row["id"], type=row["type"], title=row["title"], description=row["description"], score=row["score"]))

    if not db.scalar(select(ReportDefinition.id).limit(1)):
        for row in reports_data:
            db.add(ReportDefinition(id=row["id"], title=row["title"], description=row["description"], formats=row["formats"]))

    admin = db.scalar(select(User).where(User.email == "admin@nexa.example.com"))
    if admin and not db.scalar(select(Notification.id).where(Notification.user_id == admin.id).limit(1)):
        for row in ui_data.get("notifications", []):
            db.add(Notification(
                user_id=admin.id,
                type=row.get("type", "info"),
                title=row["title"],
                message=row["message"],
                display_time=row.get("time", "اکنون"),
                read=bool(row.get("read", False)),
                route=row.get("route", "/"),
            ))

    db.commit()


def seed_database(db: Session, reset: bool = False) -> None:
    if reset:
        reset_database(db)
    seed_users(db)
    seed_core_data(db)


def main() -> None:
    from app.database.session import SessionLocal
    parser = argparse.ArgumentParser(description="Migrate existing JSON demo data into PostgreSQL/SQLAlchemy tables.")
    parser.add_argument("--reset", action="store_true", help="Delete existing rows before importing seed data")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        seed_database(db, reset=args.reset)
        print("Migration completed successfully.")
        print("Development admin: admin@nexa.example.com / Admin123!")
    finally:
        db.close()


if __name__ == "__main__":
    main()
