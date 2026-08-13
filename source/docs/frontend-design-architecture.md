# Sales Analytics Platform
## زبان طراحی و معماری پیاده‌سازی سامانه تحلیل داده‌های فروش

---

# 1. معرفی پروژه

**نام پروژه:** Sales Analytics Platform  
**موضوع:** سامانه تحلیل داده‌های فروش و نمایش گزارش‌های آماری  
**نوع محصول:** Dashboard / Business Intelligence / Analytics SaaS  
**Frontend:** React + Vite + TypeScript  
**Backend پیشنهادی:** FastAPI  
**Database پیشنهادی:** PostgreSQL  
**نسخه اولیه:** استفاده از Fake Data / Mock API

هدف پروژه، ساخت یک داشبورد مدرن و حرفه‌ای برای نمایش، تحلیل و مقایسه داده‌های فروش، مشتریان، محصولات، سفارش‌ها و گزارش‌های مدیریتی است.

سامانه باید از نظر تجربه کاربری شبیه یک محصول SaaS واقعی باشد و اطلاعات پیچیده را در قالب نمودارها، KPIها، جداول و Insightهای قابل فهم نمایش دهد.

---

# 2. اهداف اصلی محصول

- نمایش وضعیت کلی فروش در یک نگاه
- تحلیل روند فروش در بازه‌های زمانی مختلف
- بررسی عملکرد محصولات
- تحلیل رفتار مشتریان
- نمایش وضعیت سفارش‌ها
- تحلیل مناطق جغرافیایی
- مقایسه بازه‌های زمانی
- تولید گزارش آماری
- نمایش هشدارها و Insightهای مدیریتی
- آماده بودن برای اتصال به Backend واقعی
- Responsive بودن روی Desktop، Tablet و Mobile

---

# 3. شخصیت بصری محصول

محصول باید حس زیر را منتقل کند:

- مدرن
- حرفه‌ای
- داده‌محور
- تکنولوژیک
- مینیمال
- قابل اعتماد
- سریع
- مدیریتی
- Premium SaaS

از شلوغی بصری، رنگ‌های زیاد، Gradientهای افراطی و افکت‌های غیرضروری جلوگیری شود.

---

# 4. Design Language

## 4.1 سبک اصلی

سبک طراحی:

**Dark Modern Analytics Dashboard**

ترکیبی از:

- Dark UI
- Soft Glassmorphism
- Subtle Glow
- Large Data Typography
- Rounded Cards
- Clean Charts
- Soft Gradients
- Micro Interactions

---

# 5. Color System

## Background

```css
--bg-primary: #080B12;
--bg-secondary: #0D111B;
--bg-tertiary: #111725;
```

## Surface

```css
--surface-primary: #101621;
--surface-secondary: #151C2A;
--surface-hover: #1A2232;
```

## Border

```css
--border-primary: rgba(255, 255, 255, 0.06);
--border-secondary: rgba(255, 255, 255, 0.10);
```

## Text

```css
--text-primary: #F7F9FC;
--text-secondary: #AAB2C0;
--text-muted: #697386;
```

## Brand

```css
--primary: #6C5CE7;
--primary-light: #8B7CF6;
--secondary: #00D2FF;
```

## Status

```css
--success: #00D084;
--warning: #FFB020;
--danger: #FF5470;
--info: #4D9FFF;
```

---

# 6. Gradient System

Gradientها فقط به صورت محدود استفاده شوند.

## Primary Gradient

```css
background:
linear-gradient(
  135deg,
  #6C5CE7 0%,
  #00D2FF 100%
);
```

## Card Glow

```css
background:
radial-gradient(
  circle at top right,
  rgba(108, 92, 231, 0.12),
  transparent 45%
);
```

---

# 7. Typography

فونت رابط فارسی بهتر است یکی از موارد زیر باشد:

- Estedad
- Peyda
- Vazirmatn

فونت رابط انگلیسی:

- Inter
- Geist
- Plus Jakarta Sans

## مقیاس تایپوگرافی

```text
Display       40px / 700
H1            32px / 700
H2            24px / 600
H3            20px / 600
Body Large    16px / 400
Body          14px / 400
Caption       12px / 400
KPI Number    28px - 36px / 700
```

اعداد KPI باید بزرگ، خوانا و دارای Contrast بالا باشند.

---

# 8. Spacing System

مبنای فاصله‌گذاری:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Spacing اصلی کارت‌ها:

```text
Padding: 20px - 24px
Gap: 16px - 24px
```

---

# 9. Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
```

کارت‌های اصلی:

```text
16px
```

دکمه‌ها:

```text
10px - 12px
```

---

# 10. Shadow System

Shadow باید بسیار نرم باشد.

```css
box-shadow:
0 8px 32px rgba(0, 0, 0, 0.20);
```

برای کارت Hover:

```css
box-shadow:
0 12px 40px rgba(0, 0, 0, 0.30);
```

---

# 11. Layout اصلی

ساختار Desktop:

```text
┌──────────────┬───────────────────────────────────────────┐
│              │ Navbar                                    │
│              ├───────────────────────────────────────────┤
│              │                                           │
│   Sidebar    │              Page Content                 │
│              │                                           │
│              │                                           │
│              │                                           │
└──────────────┴───────────────────────────────────────────┘
```

## Sidebar

عرض حالت باز:

```text
260px
```

عرض حالت Collapse:

```text
72px
```

## Content

```text
max-width: 1600px
padding: 24px - 32px
```

---

# 12. Sidebar

موارد اصلی:

```text
Overview
Sales Analytics
Products
Customers
Orders
Geography
Reports
AI Insights
Notifications
Settings
```

هر آیتم شامل:

- Icon
- Label
- Active State
- Hover State

Active Item:

```text
Background: rgba(108,92,231,0.12)
Text: #FFFFFF
Icon: Primary Color
```

---

# 13. Navbar

Navbar شامل:

- Search
- Date Filter
- Notification
- Theme Toggle
- User Avatar
- Profile Menu

نمونه:

```text
Search analytics...          Date ▼       🔔       User
```

---

# 14. Dashboard Page

Route:

```text
/dashboard
```

ترتیب پیشنهادی:

```text
Page Header

Global Filters

KPI Cards

Sales Overview Chart

Revenue vs Profit

Top Products

Sales By Category

Sales By Region

Recent Orders

Activity Feed
```

---

# 15. KPI Cards

KPIهای اصلی:

- Total Revenue
- Total Orders
- Net Profit
- Total Customers
- Average Order Value
- Conversion Rate

ساختار کارت:

```text
┌──────────────────────┐
│ Total Revenue        │
│                      │
│ $128,400             │
│                      │
│ ↑ 18.4% vs last month│
│              ▁▂▄▅▇  │
└──────────────────────┘
```

هر KPI باید شامل:

- عنوان
- عدد اصلی
- درصد تغییر
- Trend
- Mini Sparkline
- Tooltip

---

# 16. Sales Analytics

Route:

```text
/analytics/sales
```

بخش‌ها:

- Sales Trend
- Revenue
- Profit
- Order Volume
- Average Order Value
- Period Comparison
- Best Sales Day
- Worst Sales Day

فیلترها:

- Today
- Last 7 Days
- Last 30 Days
- This Month
- Last Month
- Custom Range

---

# 17. Product Analytics

Route:

```text
/products
```

بخش‌ها:

- Total Products
- Best Selling Product
- Lowest Selling Product
- Highest Revenue Product
- Top Categories
- Product Performance
- Product Sales Trend
- Product Return Rate

جدول:

```text
Product
Category
Units Sold
Revenue
Growth
Stock
Status
```

---

# 18. Customers Analytics

Route:

```text
/customers
```

KPIها:

- Total Customers
- New Customers
- Returning Customers
- Customer Lifetime Value
- Retention Rate
- Churn Rate

نمودارها:

- New vs Returning
- Customer Growth
- Customer Segments
- Purchase Frequency
- Average Spend

---

# 19. Customer Segmentation

Segmentها:

```text
VIP
High Value
Regular
New
At Risk
Lost
```

هر Segment دارای:

- تعداد مشتری
- Average Spend
- Revenue Share
- Growth Rate

---

# 20. Orders

Route:

```text
/orders
```

جدول:

```text
Order ID
Customer
Product
Amount
Status
Payment
City
Date
```

Status:

```text
Completed
Processing
Pending
Cancelled
Refunded
```

امکانات:

- Search
- Sort
- Filter
- Pagination
- Row Selection
- Export

---

# 21. Geography Analytics

Route:

```text
/geography
```

بخش‌ها:

- Sales by Province
- Revenue by City
- Orders by Location
- Customer Distribution
- Top Performing Region

نقشه ایران یا World Map در صورت نیاز.

Tooltip نقشه:

```text
Tehran

Revenue
3.2B

Orders
8,240

Customers
4,120
```

---

# 22. Reports

Route:

```text
/reports
```

Report Types:

- Monthly Sales Report
- Product Performance Report
- Customer Report
- Revenue Report
- Branch Performance
- Order Report

Export:

```text
PDF
Excel
CSV
```

---

# 23. AI Insights

Route:

```text
/insights
```

در نسخه اولیه Insightها می‌توانند Rule Based یا Fake باشند.

مثال:

```text
Sales increased by 18.4% compared with last month.

Electronics is currently the fastest growing category.

Tehran generated the highest revenue this month.

Fashion sales have declined for three consecutive weeks.
```

کارت‌ها:

```text
Opportunity
Warning
Trend
Recommendation
```

---

# 24. Forecast

در نسخه توسعه‌یافته:

- Sales Prediction
- Revenue Forecast
- Demand Forecast
- Product Demand Prediction

نمایش:

```text
Actual
Forecast
Confidence Range
```

---

# 25. Notifications

انواع Notification:

- Revenue Target Reached
- Low Stock
- Sales Drop
- High Growth
- New Report Generated
- Unusual Activity

---

# 26. Empty States

صفحه بدون دیتا نباید خالی باشد.

نمونه:

```text
No sales data available.

Try changing your date range or filters.
```

همراه با:

- Icon
- متن
- CTA

---

# 27. Loading States

استفاده از:

- Skeleton Card
- Skeleton Table
- Skeleton Chart

از Spinner تمام صفحه فقط در موارد ضروری استفاده شود.

---

# 28. Animation System

Animationها باید نرم و کوتاه باشند.

Duration:

```text
150ms
200ms
300ms
```

موارد قابل Animation:

- Card Hover
- Sidebar Collapse
- Modal
- Dropdown
- KPI Number
- Chart Entry
- Page Transition

پیشنهاد:

```text
Framer Motion
```

---

# 29. Responsive Design

## Desktop

```text
>= 1280px
```

Sidebar کامل + Grid چهار ستونه.

## Tablet

```text
768px - 1279px
```

Sidebar Collapse + Grid دو ستونه.

## Mobile

```text
< 768px
```

- Sidebar تبدیل به Drawer
- KPI Cards تک ستونه
- Table دارای Horizontal Scroll
- Charts Responsive
- Global Filters داخل Bottom Sheet یا Drawer

---

# 30. Accessibility

- Contrast مناسب
- Keyboard Navigation
- Focus State
- aria-label
- Tooltip برای Icon Buttons
- عدم استفاده از رنگ به تنهایی برای وضعیت‌ها

---

# 31. Frontend Technology Stack

پیشنهاد اصلی:

```text
React
Vite
TypeScript
Tailwind CSS
React Router
TanStack Query
Zustand
Recharts
Lucide React
Framer Motion
Axios
React Hook Form
Zod
```

---

# 32. معماری Frontend

معماری پیشنهادی:

```text
Feature-Based Architecture
```

ساختار:

```text
src/
│
├── app/
│
├── assets/
│
├── components/
│
├── features/
│
├── layouts/
│
├── pages/
│
├── hooks/
│
├── services/
│
├── store/
│
├── lib/
│
├── utils/
│
├── types/
│
└── styles/
```

---

# 33. ساختار کامل پروژه React

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Skeleton.tsx
│   │   └── DataTable.tsx
│   │
│   ├── charts/
│   │   ├── SalesChart.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── ProfitChart.tsx
│   │   ├── DonutChart.tsx
│   │   ├── BarChart.tsx
│   │   └── FunnelChart.tsx
│   │
│   └── shared/
│       ├── PageHeader.tsx
│       ├── DateRangePicker.tsx
│       ├── FilterBar.tsx
│       ├── EmptyState.tsx
│       └── ErrorState.tsx
│
├── layouts/
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   └── MobileNavigation.tsx
│
├── features/
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── sales/
│   ├── products/
│   ├── customers/
│   ├── orders/
│   ├── geography/
│   ├── reports/
│   └── insights/
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── SalesPage.tsx
│   ├── ProductsPage.tsx
│   ├── CustomersPage.tsx
│   ├── OrdersPage.tsx
│   ├── GeographyPage.tsx
│   ├── ReportsPage.tsx
│   ├── InsightsPage.tsx
│   └── SettingsPage.tsx
│
├── services/
│   ├── api.ts
│   ├── endpoints.ts
│   └── mockApi.ts
│
├── store/
│   ├── appStore.ts
│   ├── filterStore.ts
│   └── uiStore.ts
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useLocalStorage.ts
│
├── lib/
│   ├── queryClient.ts
│   └── axios.ts
│
├── data/
│   ├── sales.mock.ts
│   ├── products.mock.ts
│   ├── customers.mock.ts
│   ├── orders.mock.ts
│   └── insights.mock.ts
│
├── types/
│   ├── sales.ts
│   ├── product.ts
│   ├── customer.ts
│   ├── order.ts
│   └── common.ts
│
├── utils/
│   ├── formatCurrency.ts
│   ├── formatNumber.ts
│   ├── formatDate.ts
│   ├── calculateGrowth.ts
│   └── generateChartData.ts
│
├── styles/
│   └── globals.css
│
└── main.tsx
```

---

# 34. React Router Architecture

```text
/
│
├── /dashboard
│
├── /analytics
│   ├── /sales
│   └── /performance
│
├── /products
├── /customers
├── /orders
├── /geography
├── /reports
├── /insights
└── /settings
```

Router:

```tsx
createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "analytics/sales",
        element: <SalesPage />
      },
      {
        path: "products",
        element: <ProductsPage />
      },
      {
        path: "customers",
        element: <CustomersPage />
      },
      {
        path: "orders",
        element: <OrdersPage />
      },
      {
        path: "geography",
        element: <GeographyPage />
      },
      {
        path: "reports",
        element: <ReportsPage />
      },
      {
        path: "insights",
        element: <InsightsPage />
      }
    ]
  }
]);
```

---

# 35. Component Architecture

کامپوننت‌ها به سه دسته تقسیم شوند.

## UI Components

Generic:

```text
Button
Input
Card
Badge
Modal
Select
Dropdown
Tooltip
Skeleton
```

## Business Components

وابسته به پروژه:

```text
RevenueCard
SalesOverview
TopProducts
CustomerSegments
RecentOrders
SalesByRegion
InsightCard
```

## Page Components

```text
DashboardPage
SalesPage
ProductsPage
CustomersPage
```

---

# 36. State Management

سه نوع State در پروژه وجود دارد.

## Local State

با:

```text
useState
```

مثال:

- Modal State
- Dropdown State

## Global UI State

با Zustand:

```text
Sidebar
Theme
Global Filters
```

## Server State

با:

```text
TanStack Query
```

مثال:

- Sales
- Products
- Customers
- Orders
- Reports

---

# 37. Zustand Store

نمونه:

```tsx
interface FilterState {
  dateRange: string;
  category: string;
  region: string;

  setDateRange: (value: string) => void;
  setCategory: (value: string) => void;
  setRegion: (value: string) => void;
}
```

---

# 38. Fake Data Architecture

نسخه اول بدون Backend واقعی اجرا شود.

```text
React
   ↓
Mock Service
   ↓
Fake JSON Data
```

ساختار:

```text
data/
├── sales.mock.ts
├── products.mock.ts
├── customers.mock.ts
├── orders.mock.ts
└── insights.mock.ts
```

---

# 39. Mock API

به جای Import مستقیم Fake Data، بهتر است یک لایه Service وجود داشته باشد.

```tsx
export async function getDashboardData() {
  await new Promise(resolve =>
    setTimeout(resolve, 500)
  );

  return dashboardMockData;
}
```

مزیت:

بعداً فقط Service تغییر می‌کند.

UI بدون تغییر به FastAPI متصل می‌شود.

---

# 40. API Layer

ساختار:

```text
React Component
      ↓
Custom Hook
      ↓
TanStack Query
      ↓
Service
      ↓
Axios
      ↓
REST API
```

مثال:

```tsx
const {
  data,
  isLoading,
  error
} = useQuery({
  queryKey: ["sales"],
  queryFn: getSales
});
```

---

# 41. Backend Architecture

Backend پیشنهادی:

```text
FastAPI
```

ساختار:

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── sales.py
│   │   ├── products.py
│   │   ├── customers.py
│   │   ├── orders.py
│   │   └── reports.py
│   │
│   ├── models/
│   │
│   ├── schemas/
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── database/
│   │
│   └── core/
│
└── requirements.txt
```

---

# 42. Backend Layer Architecture

```text
API Route
   ↓
Service
   ↓
Repository
   ↓
Database
```

Route مسئول:

- دریافت Request
- Validation
- ارسال Response

Service مسئول:

- Business Logic
- Analytics Logic

Repository مسئول:

- Database Query

---

# 43. API Endpoints

## Dashboard

```http
GET /api/dashboard/summary
GET /api/dashboard/charts
```

## Sales

```http
GET /api/sales
GET /api/sales/summary
GET /api/sales/trend
GET /api/sales/comparison
```

## Products

```http
GET /api/products
GET /api/products/top
GET /api/products/{id}
```

## Customers

```http
GET /api/customers
GET /api/customers/segments
GET /api/customers/growth
```

## Orders

```http
GET /api/orders
GET /api/orders/{id}
```

## Reports

```http
GET /api/reports
POST /api/reports/export
```

---

# 44. Database

Database پیشنهادی:

```text
PostgreSQL
```

جداول اصلی:

```text
users
customers
products
categories
orders
order_items
payments
regions
sales_targets
reports
```

---

# 45. Data Model

ارتباط اصلی:

```text
Customer

   ↓

Order

   ↓

Order Item

   ↓

Product

   ↓

Category
```

---

# 46. Performance

برای جلوگیری از کند شدن Dashboard:

- Pagination
- Server Side Filtering
- Database Index
- Aggregation Query
- API Cache
- React Query Cache
- Lazy Loading
- Code Splitting
- Memoization در نقاط لازم

---

# 47. Chart Strategy

پیشنهاد:

```text
Recharts
```

انواع نمودار:

```text
Line Chart
Area Chart
Bar Chart
Stacked Bar
Donut Chart
Pie Chart
Funnel
Sparkline
```

هر نمودار باید:

- Responsive
- Tooltip
- Legend
- Loading State
- Empty State
- Period Filter

داشته باشد.

---

# 48. Dashboard Grid

Desktop:

```text
12 Column Grid
```

مثال:

```text
Revenue       3 Columns
Orders        3 Columns
Customers     3 Columns
Profit        3 Columns

Sales Chart   8 Columns
Top Products  4 Columns

Map           6 Columns
Orders        6 Columns
```

---

# 49. Error Handling

هر API Request باید سه State داشته باشد:

```text
Loading
Success
Error
```

Error Component:

```text
Something went wrong.

Retry
```

---

# 50. Security

در نسخه Backend:

- JWT Authentication
- Refresh Token
- Role Based Access
- Input Validation
- Rate Limiting
- CORS
- Environment Variables

---

# 51. Authentication

Roleها:

```text
Admin
Manager
Analyst
Viewer
```

مثلاً:

Admin:

```text
Full Access
```

Viewer:

```text
Read Only
```

---

# 52. Performance Optimization React

استفاده از:

```text
React.lazy
Suspense
useMemo
useCallback
TanStack Query Cache
Virtualized Tables
```

اما فقط در جاهایی که واقعاً نیاز است.

---

# 53. Page Loading

Routeها Lazy Load شوند.

```tsx
const DashboardPage = lazy(
  () => import("@/pages/DashboardPage")
);
```

---

# 54. UX Guidelines

کاربر در هر لحظه باید بداند:

- الان کجاست
- چه بازه زمانی انتخاب شده
- داده متعلق به چه Segmentی است
- وضعیت نسبت به دوره قبل چگونه است

---

# 55. Filter Architecture

Global Filters:

```text
Date
Region
Category
Branch
Product
```

Global Filter State:

```text
FilterBar
   ↓
Zustand
   ↓
Query Key
   ↓
API Request
```

مثلاً:

```text
sales
+
date
+
region
+
category
```

---

# 56. Data Flow

معماری جریان داده:

```text
User Interaction
      ↓
Component
      ↓
Global / Local State
      ↓
TanStack Query
      ↓
Service
      ↓
API
      ↓
FastAPI
      ↓
PostgreSQL
      ↓
Response
      ↓
React Query Cache
      ↓
UI Update
```

---

# 57. معماری نسخه MVP

نسخه اول:

```text
React
  ↓
Mock Services
  ↓
Fake Data
```

صفحات:

```text
Dashboard
Sales
Products
Customers
Orders
Reports
```

---

# 58. نسخه دوم

```text
React
  ↓
FastAPI
  ↓
PostgreSQL
```

اضافه شود:

- Authentication
- Real Data
- Export
- Advanced Filtering

---

# 59. نسخه سوم

اضافه شود:

- AI Insights
- Forecasting
- Anomaly Detection
- Smart Alerts
- Real Time Analytics

---

# 60. معماری نهایی

```text
                ┌───────────────────┐
                │       React       │
                │     Dashboard     │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │   TanStack Query  │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │      FastAPI      │
                │      REST API     │
                └─────────┬─────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          Sales        Products     Customers
         Service       Service       Service
             │            │            │
             └────────────┼────────────┘
                          │
                          ▼
                ┌───────────────────┐
                │    PostgreSQL     │
                └───────────────────┘
```

---

# 61. پیشنهاد نهایی Technology Stack

## Frontend

```text
React
Vite
TypeScript
Tailwind CSS
React Router
TanStack Query
Zustand
Recharts
Framer Motion
Lucide React
Axios
Zod
React Hook Form
```

## Backend

```text
FastAPI
Pydantic
SQLAlchemy
Alembic
PostgreSQL
```

## Future

```text
Redis
Docker
Nginx
WebSocket
Celery
AI/ML Service
```

---

# 62. نتیجه نهایی

ساختار پروژه باید از ابتدا به شکلی طراحی شود که Fake Data صرفاً جای API واقعی را گرفته باشد.

یعنی UI نباید مستقیماً به فایل‌های Mock وابسته باشد.

معماری صحیح:

```text
UI
 ↓
Hooks
 ↓
Query
 ↓
Services
 ↓
Data Source
```

در MVP:

```text
Data Source = Mock Data
```

در Production:

```text
Data Source = FastAPI
```

این معماری باعث می‌شود پروژه بدون بازنویسی Frontend از یک نمونه نمایشی به یک سامانه واقعی و قابل توسعه تبدیل شود.
