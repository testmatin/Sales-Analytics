# Sales Analytics Backend — PostgreSQL + JWT

این Backend دیگر در زمان اجرا از JSON استفاده نمی‌کند. داده‌های قدیمی داخل `seed_data/` فقط برای انتقال اولیه به PostgreSQL نگه داشته شده‌اند.

## اجرای سریع با Docker

از پوشه `backend`:

```bash
docker compose up --build
```

Compose به ترتیب PostgreSQL را بالا می‌آورد، Migrationهای Alembic را اجرا می‌کند، داده‌های Seed را وارد می‌کند و سپس FastAPI را روی پورت 8000 اجرا می‌کند.

Swagger:

```text
http://localhost:8000/docs
```

## اجرای دستی

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python scripts/migrate_json_to_postgres.py --reset
uvicorn app.main:app --reload
```

## حساب‌های Development

| نقش | ایمیل | رمز |
|---|---|---|
| Admin | `admin@nexa.example.com` | `Admin123!` |
| Manager | `manager@nexa.example.com` | `Manager123!` |
| Analyst | `analyst@nexa.example.com` | `Analyst123!` |
| Viewer | `viewer@nexa.example.com` | `Viewer123!` |

این رمزها فقط برای Development هستند و باید در محیط واقعی حذف/تعویض شوند.

## Auth API

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Access token کوتاه‌مدت است. Refresh token با `jti` در جدول `refresh_tokens` ثبت می‌شود، در Refresh چرخش (rotation) دارد و در Logout revoke می‌شود.

## انتقال داده‌های JSON

فایل‌های قدیمی اینجا هستند:

```text
seed_data/
├── customer_records.json
├── customers.json
├── dashboard.json
├── insights.json
├── orders.json
├── products.json
├── reports.json
└── ui.json
```

بعد از ساخت جدول‌ها:

```bash
python scripts/migrate_json_to_postgres.py --reset
```

بدون `--reset` اسکریپت به شکل idempotent تلاش می‌کند داده‌های موجود را دوباره نسازد.

## Migrationهای دیتابیس

```bash
alembic upgrade head
```

برای Migration جدید:

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## Import مستقیم با psql

اگر نمی‌خواهی اسکریپت Python اجرا کنی، دو فایل آماده وجود دارد:

```text
database/schema.sql
database/seed.sql
```

روی دیتابیس خالی:

```bash
psql -U postgres -d sales_analytics -f database/schema.sql
psql -U postgres -d sales_analytics -f database/seed.sql
```

`schema.sql` از Migration فعلی Alembic به dialect PostgreSQL تولید شده و `seed.sql` داده‌های فعلی پروژه را به جدول‌های relational منتقل می‌کند.
