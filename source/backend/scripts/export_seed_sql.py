from __future__ import annotations

import json
import sys
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.database.base import Base
import app.models  # noqa: F401
from scripts.migrate_json_to_postgres import seed_database

OUTPUT = BACKEND_ROOT / "database" / "seed.sql"

TABLE_ORDER = [
    "users", "categories", "products", "customers", "orders", "order_items",
    "dashboard_kpis", "sales_trend", "category_sales_stats", "channel_sales_stats", "region_stats",
    "activities", "customer_summary", "customer_segment_stats", "insights", "report_definitions", "notifications",
]


def sql_literal(value) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float, Decimal)):
        return str(value)
    if isinstance(value, (datetime, date)):
        return "'" + value.isoformat().replace("'", "''") + "'"
    if isinstance(value, (list, dict)):
        raw = json.dumps(value, ensure_ascii=False).replace("'", "''")
        return f"'{raw}'::json"
    return "'" + str(value).replace("'", "''") + "'"


def main() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        seed_database(session, reset=False)

    lines = [
        "-- Generated development seed data for PostgreSQL",
        "-- Development credentials are documented in backend/README.md",
        "BEGIN;",
        "",
    ]

    with engine.connect() as connection:
        for table_name in TABLE_ORDER:
            table = Base.metadata.tables[table_name]
            rows = connection.execute(select(table)).mappings().all()
            if not rows:
                continue
            lines.append(f"-- {table_name}")
            columns = [column.name for column in table.columns]
            column_sql = ", ".join(f'"{name}"' for name in columns)
            for row in rows:
                values = ", ".join(sql_literal(row[name]) for name in columns)
                lines.append(f'INSERT INTO "{table_name}" ({column_sql}) VALUES ({values}) ON CONFLICT DO NOTHING;')
            lines.append("")

        for table_name in TABLE_ORDER:
            table = Base.metadata.tables[table_name]
            pk_columns = list(table.primary_key.columns)
            if len(pk_columns) == 1 and str(pk_columns[0].type).upper() == "INTEGER":
                pk = pk_columns[0].name
                lines.append(
                    f"SELECT setval(pg_get_serial_sequence('{table_name}', '{pk}'), "
                    f"GREATEST(COALESCE((SELECT MAX(\"{pk}\") FROM \"{table_name}\"), 1), 1), true);"
                )

    lines.extend(["", "COMMIT;", ""])
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
