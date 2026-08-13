# Sales Analytics Platform — PostgreSQL + Authentication

پروژه Full-Stack سامانه تحلیل فروش:

- **Frontend:** React + Vite + TypeScript + Chart.js + Three.js
- **Backend:** FastAPI + SQLAlchemy 2 + Alembic
- **Database:** PostgreSQL 16
- **Authentication:** JWT Access/Refresh + Refresh Rotation + Argon2 Password Hash
- **Roles:** Admin / Manager / Analyst / Viewer

## ساختار

```text
sales-analytics-postgres-auth/
├── frontend/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── scripts/
│   └── seed_data/
├── docs/
└── docker-compose.yml
```

## سریع‌ترین روش اجرا

```bash
docker compose up --build
```

سپس:

- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

Frontend را در ترمینال دوم اجرا کن:

```bash
cd frontend
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## اجرای دستی Backend

ابتدا PostgreSQL بساز و `backend/.env` را مطابق `.env.example` تنظیم کن. سپس:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python scripts/migrate_json_to_postgres.py --reset
uvicorn app.main:app --reload
```

## حساب Development

```text
admin@nexa.example.com
Admin123!
```

حساب‌های Manager/Analyst/Viewer نیز در `backend/README.md` آمده‌اند.

## مهاجرت داده

Runtime دیگر از JSON استفاده نمی‌کند. JSONهای قبلی فقط در `backend/seed_data/` هستند و با این دستور وارد جدول‌های PostgreSQL می‌شوند:

```bash
python scripts/migrate_json_to_postgres.py --reset
```

Schema توسط Alembic ساخته می‌شود:

```bash
alembic upgrade head
```

## Auth

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

تمام APIهای Dashboard، Products، Customers، Orders، Reports، Search و UI نیاز به Bearer Token دارند.

## تست Backend

```bash
cd backend
pytest -q
```

تست‌ها با SQLite ایزوله اجرا می‌شوند، ولی Schema و تنظیم اصلی پروژه برای PostgreSQL است.
