# Backend Architecture — Sales Analytics Platform

## 1) هدف

Backend سامانه تحلیل فروش با **FastAPI + PostgreSQL** پیاده‌سازی می‌شود و مسئول این بخش‌هاست:

- احراز هویت کاربران
- مدیریت محصولات
- مدیریت مشتریان
- مدیریت سفارش‌ها
- محاسبه KPIها
- تحلیل فروش
- گزارش‌گیری
- فیلترهای زمانی و جغرافیایی
- ارائه API به React
- آماده‌سازی برای AI Insights و Forecasting

---

## 2) Tech Stack

```text
Python 3.12+
FastAPI
Uvicorn
Pydantic
Pydantic Settings
SQLAlchemy 2.x
PostgreSQL
Alembic
psycopg
JWT
Pytest
HTTPX
Docker
```

معماری اصلی:

```text
React
  ↓
REST API
  ↓
FastAPI Router
  ↓
Service Layer
  ↓
Repository Layer
  ↓
SQLAlchemy
  ↓
PostgreSQL
```

---

## 3) ساختار پروژه

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── exceptions.py
│   │   └── logging.py
│   │
│   ├── database/
│   │   ├── base.py
│   │   ├── session.py
│   │   └── init_db.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── customer.py
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── payment.py
│   │   ├── region.py
│   │   └── sales_target.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── customer.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── dashboard.py
│   │   ├── analytics.py
│   │   └── report.py
│   │
│   ├── repositories/
│   │   ├── user_repository.py
│   │   ├── customer_repository.py
│   │   ├── product_repository.py
│   │   ├── order_repository.py
│   │   └── analytics_repository.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── customer_service.py
│   │   ├── product_service.py
│   │   ├── order_service.py
│   │   ├── dashboard_service.py
│   │   ├── analytics_service.py
│   │   └── report_service.py
│   │
│   ├── api/
│   │   ├── dependencies.py
│   │   └── v1/
│   │       ├── router.py
│   │       └── endpoints/
│   │           ├── auth.py
│   │           ├── dashboard.py
│   │           ├── sales.py
│   │           ├── products.py
│   │           ├── customers.py
│   │           ├── orders.py
│   │           ├── geography.py
│   │           ├── reports.py
│   │           └── insights.py
│   │
│   ├── utils/
│   │   ├── pagination.py
│   │   ├── date_range.py
│   │   └── statistics.py
│   │
│   └── tests/
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_orders.py
│       └── test_dashboard.py
│
├── alembic/
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env
├── .env.example
└── README.md
```

---

## 4) مسئولیت Layerها

### Router

Router فقط مسئول دریافت و پاسخ HTTP است.

```text
Request
↓
Validation
↓
Dependency
↓
Service
↓
Response
```

داخل Router نباید SQL یا Business Logic سنگین باشد.

### Service

مسئول:

- Business Logic
- Analytics
- محاسبات
- Validation سطح کسب‌وکار
- هماهنگی بین Repositoryها

### Repository

مسئول:

- Query
- Insert
- Update
- Delete
- Aggregation
- Filtering

### Schema

Pydantic Schema برای:

```text
Request
Response
Validation
```

### Model

SQLAlchemy Model برای ساختار دیتابیس.

---

## 5) نصب

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

نصب:

```bash
pip install fastapi
pip install "uvicorn[standard]"
pip install sqlalchemy
pip install alembic
pip install "psycopg[binary]"
pip install pydantic-settings
pip install "python-jose[cryptography]"
pip install pwdlib
pip install python-multipart
pip install pytest httpx
```

---

## 6) Environment Variables

`.env`

```env
APP_NAME=Sales Analytics API
DEBUG=true

DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/sales_analytics

SECRET_KEY=CHANGE_THIS_SECRET
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

FRONTEND_URL=http://localhost:5173
```

`.env` نباید Commit شود.

---

## 7) Config

`app/core/config.py`

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Sales Analytics API"
    DEBUG: bool = False

    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
```

---

## 8) SQLAlchemy Base

`app/database/base.py`

```python
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
```

---

## 9) Database Session

`app/database/session.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)
```

Dependency:

```python
from collections.abc import Generator
from sqlalchemy.orm import Session

from app.database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

---

## 10) Database Tables

جداول اصلی:

```text
users
customers
categories
products
orders
order_items
payments
regions
sales_targets
```

Relationship:

```text
Customer
   ↓
Order
   ↓
OrderItem
   ↓
Product
   ↓
Category
```

---

## 11) Product Model

```python
from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(
        String(255),
        index=True,
    )

    sku: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(15, 2)
    )

    stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id")
    )
```

---

## 12) Customer Model

```python
from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True)

    full_name: Mapped[str] = mapped_column(
        String(255)
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True,
    )
```

---

## 13) Order Model

```python
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)

    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id")
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
        index=True,
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(15, 2)
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True,
    )
```

---

## 14) Order Item Model

```python
from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id")
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id")
    )

    quantity: Mapped[int] = mapped_column(Integer)

    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(15, 2)
    )
```

---

## 15) Schema Pattern

برای هر Entity:

```text
Create
Update
Response
```

مثال:

```python
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    sku: str
    price: Decimal
    stock: int
    category_id: int


class ProductUpdate(BaseModel):
    name: str | None = None
    price: Decimal | None = None
    stock: int | None = None


class ProductResponse(ProductCreate):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )
```

---

## 16) Repository Pattern

```python
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product


class ProductRepository:

    def get_all(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 20,
    ):
        stmt = (
            select(Product)
            .offset(skip)
            .limit(limit)
        )

        return db.scalars(stmt).all()
```

---

## 17) Service Layer

```python
from sqlalchemy.orm import Session

from app.repositories.product_repository import ProductRepository


class ProductService:

    def __init__(self):
        self.repository = ProductRepository()

    def get_products(
        self,
        db: Session,
        skip: int,
        limit: int,
    ):
        return self.repository.get_all(
            db,
            skip,
            limit,
        )
```

---

## 18) Router

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.product_service import ProductService


router = APIRouter()

service = ProductService()


@router.get("/")
def get_products(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    return service.get_products(
        db,
        skip,
        limit,
    )
```

---

## 19) API Versioning

همه APIها از ابتدا:

```text
/api/v1/
```

مثلاً:

```text
/api/v1/products
/api/v1/orders
/api/v1/dashboard
```

---

## 20) API Router

```python
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    dashboard,
    sales,
    products,
    customers,
    orders,
    geography,
    reports,
    insights,
)


api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"],
)

api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"],
)

api_router.include_router(
    sales.router,
    prefix="/sales",
    tags=["Sales"],
)

api_router.include_router(
    products.router,
    prefix="/products",
    tags=["Products"],
)

api_router.include_router(
    customers.router,
    prefix="/customers",
    tags=["Customers"],
)

api_router.include_router(
    orders.router,
    prefix="/orders",
    tags=["Orders"],
)

api_router.include_router(
    geography.router,
    prefix="/geography",
    tags=["Geography"],
)

api_router.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"],
)

api_router.include_router(
    insights.router,
    prefix="/insights",
    tags=["Insights"],
)
```

---

## 21) main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix="/api/v1",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
```

اجرا:

```bash
uvicorn app.main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 22) APIهای Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

Roleها:

```text
admin
manager
analyst
viewer
```

---

## 23) APIهای Dashboard

```http
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/sales-chart
GET /api/v1/dashboard/top-products
GET /api/v1/dashboard/recent-orders
GET /api/v1/dashboard/activity
```

نمونه Summary:

```json
{
  "revenue": {
    "value": 12840000000,
    "growth": 18.4
  },
  "orders": {
    "value": 24821,
    "growth": 8.2
  },
  "customers": {
    "value": 8430,
    "growth": 12.5
  },
  "profit": {
    "value": 4200000000,
    "growth": 14.1
  }
}
```

---

## 24) APIهای Sales

```http
GET /api/v1/sales
GET /api/v1/sales/summary
GET /api/v1/sales/trend
GET /api/v1/sales/comparison
GET /api/v1/sales/category-distribution
```

Filterها:

```text
start_date
end_date
category_id
product_id
region
city
```

---

## 25) APIهای Products

```http
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/products
PATCH  /api/v1/products/{id}
DELETE /api/v1/products/{id}

GET /api/v1/products/top
GET /api/v1/products/performance
```

---

## 26) APIهای Customers

```http
GET   /api/v1/customers
GET   /api/v1/customers/{id}
POST  /api/v1/customers
PATCH /api/v1/customers/{id}

GET /api/v1/customers/summary
GET /api/v1/customers/growth
GET /api/v1/customers/segments
```

---

## 27) APIهای Orders

```http
GET   /api/v1/orders
GET   /api/v1/orders/{id}
POST  /api/v1/orders
PATCH /api/v1/orders/{id}
```

فیلترها:

```text
status
customer_id
city
start_date
end_date
min_amount
max_amount
```

---

## 28) Geography

```http
GET /api/v1/geography/sales
GET /api/v1/geography/cities
GET /api/v1/geography/regions
```

---

## 29) Reports

```http
GET  /api/v1/reports
POST /api/v1/reports/generate
GET  /api/v1/reports/{id}
GET  /api/v1/reports/{id}/download
```

Format:

```text
CSV
XLSX
PDF
```

برای MVP اول CSV کافی است.

---

## 30) Pagination

Request:

```http
GET /api/v1/orders?page=1&page_size=20
```

Response:

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 24821,
  "pages": 1242
}
```

---

## 31) Search & Sort

Search:

```http
GET /api/v1/products?search=iphone
```

Sort:

```http
GET /api/v1/orders?sort_by=created_at&sort_order=desc
```

فیلدهای Sort باید Whitelist شوند.

---

## 32) Dashboard Analytics

اشتباه:

```text
دریافت همه Orders
↓
محاسبه در Python
```

روش صحیح:

```text
Aggregation در PostgreSQL
↓
Result
↓
FastAPI
```

مثال:

```sql
SELECT SUM(total_amount)
FROM orders
WHERE status = 'completed';
```

---

## 33) KPI Logic

Revenue:

```text
SUM completed orders
```

Average Order Value:

```text
Revenue / Completed Orders
```

Growth:

```text
(Current - Previous) / Previous × 100
```

برای Previous = 0 باید Edge Case مدیریت شود.

---

## 34) Previous Period

اگر بازه:

```text
2026-08-01 → 2026-08-31
```

باشد، Backend دوره قبلی هم‌طول را برای Comparison محاسبه می‌کند.

---

## 35) Authentication

Flow:

```text
Login
↓
Verify Password
↓
JWT
↓
React
↓
Authorization: Bearer TOKEN
↓
FastAPI
```

Password فقط Hash شده ذخیره شود.

---

## 36) Role Permissions

### Admin

```text
Read
Create
Update
Delete
Reports
Users
Settings
```

### Manager

```text
Read
Create
Update
Reports
```

### Analyst

```text
Read
Analytics
Reports
```

### Viewer

```text
Read Only
```

---

## 37) Error Format

تمام خطاها ساختار استاندارد داشته باشند:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found",
    "details": null
  }
}
```

Status Codeها:

```text
200
201
204
400
401
403
404
409
422
500
```

---

## 38) Alembic

```bash
alembic init alembic
```

Migration:

```bash
alembic revision --autogenerate -m "initial tables"
```

Apply:

```bash
alembic upgrade head
```

---

## 39) Indexها

```text
orders.created_at
orders.status
orders.customer_id
orders.city

products.category_id
products.sku

customers.created_at
customers.email

order_items.order_id
order_items.product_id
```

---

## 40) Seed Data

برای Development:

```text
500 Customers
100 Products
5000 Orders
10000 Order Items
```

Script:

```text
scripts/seed.py
```

Flow:

```text
Categories
↓
Products
↓
Customers
↓
Orders
↓
OrderItems
↓
Payments
```

---

## 41) AI Insights

نسخه MVP:

```text
Rule-Based Insights
```

مثال:

```python
if revenue_growth >= 20:
    insight = "Revenue increased significantly."
```

نسخه آینده:

```text
Analytics
↓
Insight Service
↓
LLM / ML
↓
Management Insight
```

---

## 42) Forecasting

نسخه آینده:

```text
Historical Sales
↓
Forecast Service
↓
ML Model
↓
Prediction API
```

مثلاً:

```http
GET /api/v1/forecast/sales
```

---

## 43) Performance

قواعد:

- Pagination
- Index
- Aggregate در Database
- جلوگیری از N+1
- Select فقط Columnهای لازم
- Query Cache
- Redis در آینده
- Background Job برای Exportهای سنگین

---

## 44) N+1

بد:

```text
100 Orders
↓
100 Customer Queries
↓
100 Product Queries
```

صحیح:

```text
JOIN
selectinload
joinedload
```

---

## 45) Sync یا Async؟

برای MVP:

```text
Sync SQLAlchemy
```

کاملاً مناسب است.

در آینده در صورت نیاز:

```text
FastAPI
↓
AsyncSession
↓
asyncpg
↓
PostgreSQL
```

پیشنهاد: پروژه را از ابتدا بی‌دلیل Async و پیچیده نکن.

---

## 46) Testing

ابزارها:

```text
Pytest
HTTPX
```

سطوح:

```text
Unit Tests
Integration Tests
API Tests
```

موارد مهم تست:

```text
Authentication
Orders
Products
Dashboard KPI
Filtering
Pagination
Growth Calculation
```

---

## 47) CORS

Development:

```text
http://localhost:5173
```

در Production فقط Domain واقعی Frontend مجاز باشد.

---

## 48) اتصال React

React:

```text
http://localhost:5173
```

FastAPI:

```text
http://localhost:8000
```

API:

```text
http://localhost:8000/api/v1
```

React:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

`.env` Frontend:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 49) Data Flow نهایی

```text
React Component
     ↓
Custom Hook
     ↓
TanStack Query
     ↓
Axios
     ↓
FastAPI Router
     ↓
Service
     ↓
Repository
     ↓
SQLAlchemy
     ↓
PostgreSQL
```

---

## 50) Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [
  "uvicorn",
  "app.main:app",
  "--host",
  "0.0.0.0",
  "--port",
  "8000"
]
```

---

## 51) Docker Compose

```yaml
services:

  api:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: sales_analytics
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 52) MVP Backend Scope

نسخه اول فقط:

```text
Products
Customers
Orders
Dashboard Summary
Sales Chart
Top Products
Recent Orders
Pagination
Date Filters
```

---

## 53) ترتیب ساخت

```text
1. FastAPI Project

2. Config

3. PostgreSQL Connection

4. SQLAlchemy Models

5. Alembic

6. Seed Data

7. Repository Layer

8. Service Layer

9. Routers

10. Products API

11. Customers API

12. Orders API

13. Dashboard Analytics

14. اتصال React

15. Authentication

16. Reports
```

---

## 54) اولین Endpointها

```text
GET  /health

GET  /api/v1/products
POST /api/v1/products

GET  /api/v1/customers
POST /api/v1/customers

GET  /api/v1/orders
POST /api/v1/orders

GET /api/v1/dashboard/summary
GET /api/v1/dashboard/sales-chart
GET /api/v1/dashboard/top-products
```

---

## 55) Definition of Done

Backend MVP زمانی آماده است که:

- [ ] FastAPI اجرا شود
- [ ] PostgreSQL متصل باشد
- [ ] Alembic Migration کار کند
- [ ] Product CRUD آماده باشد
- [ ] Customer API آماده باشد
- [ ] Order API آماده باشد
- [ ] Dashboard Summary آماده باشد
- [ ] Sales Chart آماده باشد
- [ ] Top Products آماده باشد
- [ ] Pagination وجود داشته باشد
- [ ] Date Filtering وجود داشته باشد
- [ ] Error Handling استاندارد باشد
- [ ] Swagger کامل باشد
- [ ] React به API وصل شود
- [ ] Testهای اصلی وجود داشته باشند
- [ ] Docker اجرا شود

---

# جمع‌بندی معماری

قاعده اصلی Backend:

```text
FastAPI Router
      ↓
Service Layer
      ↓
Repository Layer
      ↓
SQLAlchemy
      ↓
PostgreSQL
```

سمت Frontend:

```text
React
  ↓
TanStack Query
  ↓
Axios
  ↓
FastAPI
```

این معماری برای MVP ساده است، ولی بعداً می‌توان بدون بازنویسی هسته پروژه این قابلیت‌ها را اضافه کرد:

```text
Authentication
Role-Based Access
Advanced Reports
Redis
Notifications
AI Insights
Forecasting
Anomaly Detection
Real-Time Analytics
```
