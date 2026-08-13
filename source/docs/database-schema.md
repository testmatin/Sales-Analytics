# طراحی دیتابیس PostgreSQL

## جداول هویتی

- `users`: کاربران، نقش، وضعیت و Password Hash
- `refresh_tokens`: نشست‌های Refresh Token و وضعیت revoke
- `notifications`: اعلان‌های هر کاربر

## جداول فروش

- `categories`: دسته‌بندی محصولات
- `products`: محصول، موجودی، فروش تجمیعی و درآمد
- `customers`: مشتری و Segment
- `orders`: سفارش، مبلغ، وضعیت و روش پرداخت
- `order_items`: اقلام هر سفارش و ارتباط Order ↔ Product

## جداول Analytics

- `dashboard_kpis`: KPIهای فعلی داشبورد
- `sales_trend`: نقاط سری زمانی فروش
- `category_sales_stats`: سهم دسته‌ها
- `channel_sales_stats`: درآمد کانال‌ها
- `region_stats`: آمار مناطق
- `activities`: Activity Feed
- `customer_summary`: خلاصه Analytics مشتری
- `customer_segment_stats`: آمار Segmentهای مشتری
- `insights`: Insightهای مدیریتی
- `report_definitions`: تعریف گزارش‌ها

## روابط اصلی

```text
User 1 ─── N RefreshToken
User 1 ─── N Notification

Category 1 ─── N Product
Customer 1 ─── N Order
Order 1 ─── N OrderItem
Product 1 ─── N OrderItem
```

شناسه‌های `P-1001`, `C-1001` و `ORD-48291` به صورت `public_id` نگهداری می‌شوند و در کنار کلید داخلی عددی PostgreSQL قرار دارند.
