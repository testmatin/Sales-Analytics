from decimal import Decimal

from sqlalchemy import Integer, JSON, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class DashboardKPI(Base):
    __tablename__ = "dashboard_kpis"
    id: Mapped[int] = mapped_column(primary_key=True, default=1)
    total_revenue: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)
    total_orders: Mapped[int] = mapped_column(Integer, default=0)
    net_profit: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)
    total_customers: Mapped[int] = mapped_column(Integer, default=0)
    average_order_value: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)
    conversion_rate: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    revenue_growth: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    orders_growth: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    profit_growth: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    customers_growth: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    aov_growth: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    conversion_growth: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)


class SalesTrend(Base):
    __tablename__ = "sales_trend"
    id: Mapped[int] = mapped_column(primary_key=True)
    sort_order: Mapped[int] = mapped_column(Integer, index=True)
    label: Mapped[str] = mapped_column(String(80))
    revenue: Mapped[Decimal] = mapped_column(Numeric(18, 2))
    profit: Mapped[Decimal] = mapped_column(Numeric(18, 2))
    orders: Mapped[int] = mapped_column(Integer)


class CategorySalesStat(Base):
    __tablename__ = "category_sales_stats"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    value: Mapped[Decimal] = mapped_column(Numeric(8, 2))


class ChannelSalesStat(Base):
    __tablename__ = "channel_sales_stats"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    revenue: Mapped[Decimal] = mapped_column(Numeric(18, 2))


class RegionStat(Base):
    __tablename__ = "region_stats"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    revenue: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)
    orders: Mapped[int] = mapped_column(Integer, default=0)
    share: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)


class Activity(Base):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(300))
    time: Mapped[str] = mapped_column(String(80))


class CustomerSummary(Base):
    __tablename__ = "customer_summary"
    id: Mapped[int] = mapped_column(primary_key=True, default=1)
    total: Mapped[int] = mapped_column(Integer, default=0)
    new: Mapped[int] = mapped_column(Integer, default=0)
    returning_customers: Mapped[int] = mapped_column(Integer, default=0)
    retention_rate: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    churn_rate: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    lifetime_value: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)


class CustomerSegmentStat(Base):
    __tablename__ = "customer_segment_stats"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    customers: Mapped[int] = mapped_column(Integer, default=0)
    average_spend: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)
    revenue_share: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    growth: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)


class Insight(Base):
    __tablename__ = "insights"
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(40), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(1200))
    score: Mapped[int] = mapped_column(Integer)


class ReportDefinition(Base):
    __tablename__ = "report_definitions"
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(600))
    formats: Mapped[list[str]] = mapped_column(JSON, default=list)
