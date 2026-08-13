"""initial PostgreSQL schema

Revision ID: 0001_initial_postgres_schema
Revises:
Create Date: 2026-08-12
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0001_initial_postgres_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("initials", sa.String(12), nullable=False, server_default="U"),
        sa.Column("role", sa.String(30), nullable=False, server_default="viewer"),
        sa.Column("password_hash", sa.String(512), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_role", "users", ["role"])
    op.create_index("ix_users_is_active", "users", ["is_active"])

    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("jti", sa.String(64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("jti", name="uq_refresh_tokens_jti"),
    )
    op.create_index("ix_refresh_tokens_user_id", "refresh_tokens", ["user_id"])
    op.create_index("ix_refresh_tokens_jti", "refresh_tokens", ["jti"])
    op.create_index("ix_refresh_tokens_expires_at", "refresh_tokens", ["expires_at"])
    op.create_index("ix_refresh_tokens_revoked", "refresh_tokens", ["revoked"])

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.UniqueConstraint("name", name="uq_categories_name"),
    )
    op.create_index("ix_categories_name", "categories", ["name"])

    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("public_id", sa.String(40), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("sku", sa.String(100), nullable=False),
        sa.Column("unit_price", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("stock", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(30), nullable=False, server_default="active"),
        sa.Column("units_sold", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("revenue", sa.Numeric(18, 2), nullable=False, server_default="0"),
        sa.Column("growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("public_id", name="uq_products_public_id"),
        sa.UniqueConstraint("sku", name="uq_products_sku"),
    )
    op.create_index("ix_products_public_id", "products", ["public_id"])
    op.create_index("ix_products_name", "products", ["name"])
    op.create_index("ix_products_sku", "products", ["sku"])
    op.create_index("ix_products_status", "products", ["status"])
    op.create_index("ix_products_category_id", "products", ["category_id"])

    op.create_table(
        "customers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("public_id", sa.String(40), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("segment", sa.String(60), nullable=False, server_default="New"),
        sa.Column("display_created_at", sa.String(30), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("public_id", name="uq_customers_public_id"),
        sa.UniqueConstraint("email", name="uq_customers_email"),
    )
    op.create_index("ix_customers_public_id", "customers", ["public_id"])
    op.create_index("ix_customers_full_name", "customers", ["full_name"])
    op.create_index("ix_customers_email", "customers", ["email"])
    op.create_index("ix_customers_city", "customers", ["city"])
    op.create_index("ix_customers_segment", "customers", ["segment"])
    op.create_index("ix_customers_created_at", "customers", ["created_at"])

    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("public_id", sa.String(40), nullable=False),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id"), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("total_amount", sa.Numeric(18, 2), nullable=False),
        sa.Column("payment_method", sa.String(80), nullable=False, server_default="آنلاین"),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("display_date", sa.String(30), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("public_id", name="uq_orders_public_id"),
    )
    op.create_index("ix_orders_public_id", "orders", ["public_id"])
    op.create_index("ix_orders_customer_id", "orders", ["customer_id"])
    op.create_index("ix_orders_status", "orders", ["status"])
    op.create_index("ix_orders_city", "orders", ["city"])
    op.create_index("ix_orders_created_at", "orders", ["created_at"])

    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("unit_price", sa.Numeric(15, 2), nullable=False),
    )
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])
    op.create_index("ix_order_items_product_id", "order_items", ["product_id"])

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", sa.String(40), nullable=False, server_default="info"),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("message", sa.String(1000), nullable=False),
        sa.Column("display_time", sa.String(80), nullable=False, server_default="اکنون"),
        sa.Column("read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("route", sa.String(255), nullable=False, server_default="/"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"])
    op.create_index("ix_notifications_read", "notifications", ["read"])
    op.create_index("ix_notifications_created_at", "notifications", ["created_at"])

    op.create_table(
        "dashboard_kpis",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("total_revenue", sa.Numeric(18, 2), nullable=False, server_default="0"),
        sa.Column("total_orders", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("net_profit", sa.Numeric(18, 2), nullable=False, server_default="0"),
        sa.Column("total_customers", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("average_order_value", sa.Numeric(18, 2), nullable=False, server_default="0"),
        sa.Column("conversion_rate", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("revenue_growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("orders_growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("profit_growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("customers_growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("aov_growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("conversion_growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
    )

    op.create_table(
        "sales_trend",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("label", sa.String(80), nullable=False),
        sa.Column("revenue", sa.Numeric(18, 2), nullable=False),
        sa.Column("profit", sa.Numeric(18, 2), nullable=False),
        sa.Column("orders", sa.Integer(), nullable=False),
    )
    op.create_index("ix_sales_trend_sort_order", "sales_trend", ["sort_order"])

    op.create_table(
        "category_sales_stats",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False, unique=True),
        sa.Column("value", sa.Numeric(8, 2), nullable=False),
    )

    op.create_table(
        "channel_sales_stats",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False, unique=True),
        sa.Column("revenue", sa.Numeric(18, 2), nullable=False),
    )

    op.create_table(
        "region_stats",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False, unique=True),
        sa.Column("revenue", sa.Numeric(18, 2), nullable=False, server_default="0"),
        sa.Column("orders", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("share", sa.Numeric(8, 2), nullable=False, server_default="0"),
    )
    op.create_index("ix_region_stats_name", "region_stats", ["name"])

    op.create_table(
        "activities",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("type", sa.String(40), nullable=False),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("time", sa.String(80), nullable=False),
    )

    op.create_table(
        "customer_summary",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("total", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("new", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("returning_customers", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("retention_rate", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("churn_rate", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("lifetime_value", sa.Numeric(18, 2), nullable=False, server_default="0"),
    )

    op.create_table(
        "customer_segment_stats",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(80), nullable=False, unique=True),
        sa.Column("customers", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("average_spend", sa.Numeric(18, 2), nullable=False, server_default="0"),
        sa.Column("revenue_share", sa.Numeric(8, 2), nullable=False, server_default="0"),
        sa.Column("growth", sa.Numeric(8, 2), nullable=False, server_default="0"),
    )

    op.create_table(
        "insights",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("type", sa.String(40), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.String(1200), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
    )
    op.create_index("ix_insights_type", "insights", ["type"])

    op.create_table(
        "report_definitions",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.String(600), nullable=False),
        sa.Column("formats", sa.JSON(), nullable=False),
    )


def downgrade() -> None:
    for table in [
        "report_definitions", "insights", "customer_segment_stats", "customer_summary", "activities", "region_stats",
        "channel_sales_stats", "category_sales_stats", "sales_trend", "dashboard_kpis", "notifications", "order_items",
        "orders", "customers", "products", "categories", "refresh_tokens", "users",
    ]:
        op.drop_table(table)
