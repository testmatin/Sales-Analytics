# PostgreSQL bootstrap files

سه روش داری:

## روش 1 — Alembic + Python Seed (پیشنهادی)

```bash
alembic upgrade head
python scripts/migrate_json_to_postgres.py --reset
```

## روش 2 — SQL مستقیم

ابتدا دیتابیس را بساز:

```bash
psql -U postgres -d postgres -f database/create_database.sql
```

بعد Schema و Data:

```bash
psql -U postgres -d sales_analytics -f database/schema.sql
psql -U postgres -d sales_analytics -f database/seed.sql
```

## روش 3 — Docker

از ریشه پروژه:

```bash
docker compose up --build
```

در این حالت Migration و Seed به شکل خودکار اجرا می‌شوند.
