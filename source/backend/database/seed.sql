-- Generated development seed data for PostgreSQL
-- Development credentials are documented in backend/README.md
BEGIN;

-- users
INSERT INTO "users" ("id", "email", "full_name", "phone", "initials", "role", "password_hash", "is_active", "created_at", "updated_at") VALUES (1, 'admin@nexa.example.com', 'آرمان رضایی', NULL, 'AR', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$DqZtksbNACRL/3ml3G/GOA$6PkBqFxKzt3RSeO8JDliW8IswLX8eBfo6mqxI0oqbbo', TRUE, '2026-08-12T16:49:52.625352', '2026-08-12T16:49:52.625356') ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "email", "full_name", "phone", "initials", "role", "password_hash", "is_active", "created_at", "updated_at") VALUES (2, 'manager@nexa.example.com', 'مدیر فروش', NULL, 'MN', 'manager', '$argon2id$v=19$m=65536,t=3,p=4$q9N2Qkw6VEGaO63BN2nVOA$E+r1U5XLc2JV3/a8gAeSe3TO1a8LxMEeoRSrli6xb/c', TRUE, '2026-08-12T16:49:52.683100', '2026-08-12T16:49:52.683104') ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "email", "full_name", "phone", "initials", "role", "password_hash", "is_active", "created_at", "updated_at") VALUES (3, 'analyst@nexa.example.com', 'تحلیلگر داده', NULL, 'AN', 'analyst', '$argon2id$v=19$m=65536,t=3,p=4$3tXUnIm5XQHSZCo6fR73WQ$YYGZ/29Xc9QXK7/REEhkR3X7HWxISUi/CVHWBQN1cbo', TRUE, '2026-08-12T16:49:52.734599', '2026-08-12T16:49:52.734603') ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "email", "full_name", "phone", "initials", "role", "password_hash", "is_active", "created_at", "updated_at") VALUES (4, 'viewer@nexa.example.com', 'کاربر مشاهده‌گر', NULL, 'VW', 'viewer', '$argon2id$v=19$m=65536,t=3,p=4$cnj7bsfXO57pqFqqBfHNrQ$iSgbljvoIM2MGKW4WO0tZ86kVipa0GO3RjmgUvVsEYs', TRUE, '2026-08-12T16:49:52.787273', '2026-08-12T16:49:52.787277') ON CONFLICT DO NOTHING;

-- categories
INSERT INTO "categories" ("id", "name") VALUES (1, 'کالای دیجیتال') ON CONFLICT DO NOTHING;
INSERT INTO "categories" ("id", "name") VALUES (2, 'خانه و آشپزخانه') ON CONFLICT DO NOTHING;
INSERT INTO "categories" ("id", "name") VALUES (3, 'مد و پوشاک') ON CONFLICT DO NOTHING;
INSERT INTO "categories" ("id", "name") VALUES (4, 'زیبایی و سلامت') ON CONFLICT DO NOTHING;

-- products
INSERT INTO "products" ("id", "public_id", "name", "sku", "unit_price", "stock", "status", "units_sold", "revenue", "growth", "category_id", "created_at", "updated_at") VALUES (1, 'P-1001', 'گوشی Nova X12', 'SKU-1001', 1850961.54, 184, 'active', 1248, 2310000000.00, 24.80, 1, '2026-08-12T16:49:52.792784', '2026-08-12T16:49:52.792788') ON CONFLICT DO NOTHING;
INSERT INTO "products" ("id", "public_id", "name", "sku", "unit_price", "stock", "status", "units_sold", "revenue", "growth", "category_id", "created_at", "updated_at") VALUES (2, 'P-1002', 'هدفون AirBeat Pro', 'SKU-1002', 1298174.44, 92, 'active', 986, 1280000000.00, 18.20, 1, '2026-08-12T16:49:52.794202', '2026-08-12T16:49:52.794205') ON CONFLICT DO NOTHING;
INSERT INTO "products" ("id", "public_id", "name", "sku", "unit_price", "stock", "status", "units_sold", "revenue", "growth", "category_id", "created_at", "updated_at") VALUES (3, 'P-1003', 'قهوه‌ساز Smart Brew', 'SKU-1003', 1230366.49, 67, 'active', 764, 940000000.00, 12.40, 2, '2026-08-12T16:49:52.794724', '2026-08-12T16:49:52.794726') ON CONFLICT DO NOTHING;
INSERT INTO "products" ("id", "public_id", "name", "sku", "unit_price", "stock", "status", "units_sold", "revenue", "growth", "category_id", "created_at", "updated_at") VALUES (4, 'P-1004', 'کتانی Urban Flex', 'SKU-1004', 1005617.98, 41, 'low_stock', 712, 716000000.00, -3.60, 3, '2026-08-12T16:49:52.795124', '2026-08-12T16:49:52.795125') ON CONFLICT DO NOTHING;
INSERT INTO "products" ("id", "public_id", "name", "sku", "unit_price", "stock", "status", "units_sold", "revenue", "growth", "category_id", "created_at", "updated_at") VALUES (5, 'P-1005', 'ساعت Pulse Fit', 'SKU-1005', 991279.07, 109, 'active', 688, 682000000.00, 15.90, 1, '2026-08-12T16:49:52.795511', '2026-08-12T16:49:52.795512') ON CONFLICT DO NOTHING;
INSERT INTO "products" ("id", "public_id", "name", "sku", "unit_price", "stock", "status", "units_sold", "revenue", "growth", "category_id", "created_at", "updated_at") VALUES (6, 'P-1006', 'سرم Glow C', 'SKU-1006', 657004.83, 56, 'active', 621, 408000000.00, 8.10, 4, '2026-08-12T16:49:52.795896', '2026-08-12T16:49:52.795897') ON CONFLICT DO NOTHING;

-- customers
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (1, 'C-1001', 'علی رضایی', 'ali.rezaei@example.local', '09121234501', 'تهران', 'VIP', '1405/04/03', '2026-06-24T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (2, 'C-1002', 'مریم احمدی', 'maryam.ahmadi@example.local', '09121234502', 'مشهد', 'High Value', '1405/04/08', '2026-06-29T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (3, 'C-1003', 'سینا کریمی', 'sina.karimi@example.local', '09121234503', 'اصفهان', 'Regular', '1405/04/12', '2026-07-03T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (4, 'C-1004', 'زهرا یوسفی', 'zahra.yousefi@example.local', '09121234504', 'شیراز', 'New', '1405/05/01', '2026-07-23T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (5, 'C-1005', 'امیر محمدی', 'amir.mohammadi@example.local', '09121234505', 'تبریز', 'High Value', '1405/03/27', '2026-06-17T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (6, 'C-1006', 'سارا اکبری', 'sara.akbari@example.local', '09121234506', 'کرج', 'At Risk', '1405/02/16', '2026-05-06T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (7, 'C-1007', 'رضا نادری', 'reza.naderi@example.local', '09121234507', 'تهران', 'Regular', '1405/03/11', '2026-06-01T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (8, 'C-1008', 'نازنین حسینی', 'nazanin.hosseini@example.local', '09121234508', 'رشت', 'New', '1405/05/04', '2026-07-26T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (9, 'C-1009', 'محمد مرادی', 'mohammad.moradi@example.local', '09121234509', 'قم', 'VIP', '1405/01/22', '2026-04-11T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "customers" ("id", "public_id", "full_name", "email", "phone", "city", "segment", "display_created_at", "created_at") VALUES (10, 'C-1010', 'الهام شریفی', 'elham.sharifi@example.local', '09121234510', 'اهواز', 'Lost', '1404/11/08', '2026-08-12T16:49:52.801325') ON CONFLICT DO NOTHING;

-- orders
INSERT INTO "orders" ("id", "public_id", "customer_id", "status", "total_amount", "payment_method", "city", "display_date", "created_at") VALUES (1, 'ORD-48291', 1, 'completed', 28400000.00, 'آنلاین', 'تهران', '۱۴۰۵/۰۵/۲۱', '2026-08-12T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "orders" ("id", "public_id", "customer_id", "status", "total_amount", "payment_method", "city", "display_date", "created_at") VALUES (2, 'ORD-48290', 2, 'processing', 4850000.00, 'آنلاین', 'مشهد', '۱۴۰۵/۰۵/۲۱', '2026-08-12T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "orders" ("id", "public_id", "customer_id", "status", "total_amount", "payment_method", "city", "display_date", "created_at") VALUES (3, 'ORD-48289', 3, 'completed', 7200000.00, 'کیف پول', 'اصفهان', '۱۴۰۵/۰۵/۲۰', '2026-08-11T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "orders" ("id", "public_id", "customer_id", "status", "total_amount", "payment_method", "city", "display_date", "created_at") VALUES (4, 'ORD-48288', 4, 'pending', 2890000.00, 'درگاه', 'شیراز', '۱۴۰۵/۰۵/۲۰', '2026-08-11T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "orders" ("id", "public_id", "customer_id", "status", "total_amount", "payment_method", "city", "display_date", "created_at") VALUES (5, 'ORD-48287', 5, 'completed', 6150000.00, 'آنلاین', 'تبریز', '۱۴۰۵/۰۵/۲۰', '2026-08-11T12:00:00') ON CONFLICT DO NOTHING;
INSERT INTO "orders" ("id", "public_id", "customer_id", "status", "total_amount", "payment_method", "city", "display_date", "created_at") VALUES (6, 'ORD-48286', 6, 'refunded', 1580000.00, 'آنلاین', 'کرج', '۱۴۰۵/۰۵/۱۹', '2026-08-10T12:00:00') ON CONFLICT DO NOTHING;

-- order_items
INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price") VALUES (1, 1, 1, 1, 28400000.00) ON CONFLICT DO NOTHING;
INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price") VALUES (2, 2, 2, 1, 4850000.00) ON CONFLICT DO NOTHING;
INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price") VALUES (3, 3, 3, 1, 7200000.00) ON CONFLICT DO NOTHING;
INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price") VALUES (4, 4, 4, 1, 2890000.00) ON CONFLICT DO NOTHING;
INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price") VALUES (5, 5, 5, 1, 6150000.00) ON CONFLICT DO NOTHING;
INSERT INTO "order_items" ("id", "order_id", "product_id", "quantity", "unit_price") VALUES (6, 6, 6, 1, 1580000.00) ON CONFLICT DO NOTHING;

-- dashboard_kpis
INSERT INTO "dashboard_kpis" ("id", "total_revenue", "total_orders", "net_profit", "total_customers", "average_order_value", "conversion_rate", "revenue_growth", "orders_growth", "profit_growth", "customers_growth", "aov_growth", "conversion_growth") VALUES (1, 12840000000.00, 8240, 3720000000.00, 4912, 1558252.00, 4.86, 18.40, 12.70, 21.20, 8.90, 5.30, 0.70) ON CONFLICT DO NOTHING;

-- sales_trend
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (1, 1, '۱ مرداد', 312.00, 88.00, 198) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (2, 2, '۴ مرداد', 374.00, 102.00, 224) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (3, 3, '۷ مرداد', 352.00, 96.00, 216) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (4, 4, '۱۰ مرداد', 438.00, 128.00, 272) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (5, 5, '۱۳ مرداد', 471.00, 139.00, 291) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (6, 6, '۱۶ مرداد', 449.00, 131.00, 280) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (7, 7, '۱۹ مرداد', 518.00, 153.00, 322) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (8, 8, '۲۲ مرداد', 563.00, 169.00, 346) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (9, 9, '۲۵ مرداد', 541.00, 158.00, 337) ON CONFLICT DO NOTHING;
INSERT INTO "sales_trend" ("id", "sort_order", "label", "revenue", "profit", "orders") VALUES (10, 10, '۲۸ مرداد', 612.00, 184.00, 374) ON CONFLICT DO NOTHING;

-- category_sales_stats
INSERT INTO "category_sales_stats" ("id", "name", "value") VALUES (1, 'کالای دیجیتال', 36.00) ON CONFLICT DO NOTHING;
INSERT INTO "category_sales_stats" ("id", "name", "value") VALUES (2, 'خانه و آشپزخانه', 24.00) ON CONFLICT DO NOTHING;
INSERT INTO "category_sales_stats" ("id", "name", "value") VALUES (3, 'مد و پوشاک', 18.00) ON CONFLICT DO NOTHING;
INSERT INTO "category_sales_stats" ("id", "name", "value") VALUES (4, 'زیبایی و سلامت', 13.00) ON CONFLICT DO NOTHING;
INSERT INTO "category_sales_stats" ("id", "name", "value") VALUES (5, 'سایر', 9.00) ON CONFLICT DO NOTHING;

-- channel_sales_stats
INSERT INTO "channel_sales_stats" ("id", "name", "revenue") VALUES (1, 'وب‌سایت', 4820.00) ON CONFLICT DO NOTHING;
INSERT INTO "channel_sales_stats" ("id", "name", "revenue") VALUES (2, 'اپلیکیشن', 3650.00) ON CONFLICT DO NOTHING;
INSERT INTO "channel_sales_stats" ("id", "name", "revenue") VALUES (3, 'مارکت‌پلیس', 2440.00) ON CONFLICT DO NOTHING;
INSERT INTO "channel_sales_stats" ("id", "name", "revenue") VALUES (4, 'فروش حضوری', 1930.00) ON CONFLICT DO NOTHING;

-- region_stats
INSERT INTO "region_stats" ("id", "name", "revenue", "orders", "share") VALUES (1, 'تهران', 3200000000.00, 2210, 78.00) ON CONFLICT DO NOTHING;
INSERT INTO "region_stats" ("id", "name", "revenue", "orders", "share") VALUES (2, 'اصفهان', 1920000000.00, 1284, 57.00) ON CONFLICT DO NOTHING;
INSERT INTO "region_stats" ("id", "name", "revenue", "orders", "share") VALUES (3, 'خراسان رضوی', 1610000000.00, 1042, 49.00) ON CONFLICT DO NOTHING;
INSERT INTO "region_stats" ("id", "name", "revenue", "orders", "share") VALUES (4, 'فارس', 1280000000.00, 814, 39.00) ON CONFLICT DO NOTHING;
INSERT INTO "region_stats" ("id", "name", "revenue", "orders", "share") VALUES (5, 'آذربایجان شرقی', 960000000.00, 602, 31.00) ON CONFLICT DO NOTHING;

-- activities
INSERT INTO "activities" ("id", "type", "title", "time") VALUES (1, 'success', 'هدف فروش ماهانه به ۸۶٪ رسید', '۱۲ دقیقه پیش') ON CONFLICT DO NOTHING;
INSERT INTO "activities" ("id", "type", "title", "time") VALUES (2, 'trend', 'کالای دیجیتال ۲۱٪ رشد هفتگی داشته است', '۳۵ دقیقه پیش') ON CONFLICT DO NOTHING;
INSERT INTO "activities" ("id", "type", "title", "time") VALUES (3, 'warning', 'فروش پوشاک برای سومین هفته کاهش یافته است', '۱ ساعت پیش') ON CONFLICT DO NOTHING;
INSERT INTO "activities" ("id", "type", "title", "time") VALUES (4, 'info', 'گزارش مدیریتی جدید آماده بررسی است', '۲ ساعت پیش') ON CONFLICT DO NOTHING;

-- customer_summary
INSERT INTO "customer_summary" ("id", "total", "new", "returning_customers", "retention_rate", "churn_rate", "lifetime_value") VALUES (1, 4912, 486, 2874, 68.40, 7.80, 8420000.00) ON CONFLICT DO NOTHING;

-- customer_segment_stats
INSERT INTO "customer_segment_stats" ("id", "name", "customers", "average_spend", "revenue_share", "growth") VALUES (1, 'VIP', 286, 24800000.00, 31.00, 14.20) ON CONFLICT DO NOTHING;
INSERT INTO "customer_segment_stats" ("id", "name", "customers", "average_spend", "revenue_share", "growth") VALUES (2, 'High Value', 742, 13400000.00, 28.00, 10.60) ON CONFLICT DO NOTHING;
INSERT INTO "customer_segment_stats" ("id", "name", "customers", "average_spend", "revenue_share", "growth") VALUES (3, 'Regular', 2210, 4900000.00, 25.00, 5.10) ON CONFLICT DO NOTHING;
INSERT INTO "customer_segment_stats" ("id", "name", "customers", "average_spend", "revenue_share", "growth") VALUES (4, 'New', 486, 2200000.00, 9.00, 18.70) ON CONFLICT DO NOTHING;
INSERT INTO "customer_segment_stats" ("id", "name", "customers", "average_spend", "revenue_share", "growth") VALUES (5, 'At Risk', 312, 3600000.00, 5.00, -8.40) ON CONFLICT DO NOTHING;
INSERT INTO "customer_segment_stats" ("id", "name", "customers", "average_spend", "revenue_share", "growth") VALUES (6, 'Lost', 876, 1900000.00, 2.00, -16.10) ON CONFLICT DO NOTHING;

-- insights
INSERT INTO "insights" ("id", "type", "title", "description", "score") VALUES (1, 'opportunity', 'فرصت رشد کالای دیجیتال', 'فروش کالای دیجیتال نسبت به دوره قبل ۲۱٪ رشد داشته و بیشترین سهم درآمد را ایجاد کرده است.', 92) ON CONFLICT DO NOTHING;
INSERT INTO "insights" ("id", "type", "title", "description", "score") VALUES (2, 'warning', 'افت سه‌هفته‌ای پوشاک', 'دسته مد و پوشاک سه هفته متوالی افت فروش ثبت کرده است؛ بررسی قیمت و کمپین پیشنهاد می‌شود.', 76) ON CONFLICT DO NOTHING;
INSERT INTO "insights" ("id", "type", "title", "description", "score") VALUES (3, 'trend', 'تهران همچنان منطقه اول', 'تهران بیشترین درآمد و تعداد سفارش را در بازه فعلی ثبت کرده است.', 88) ON CONFLICT DO NOTHING;
INSERT INTO "insights" ("id", "type", "title", "description", "score") VALUES (4, 'recommendation', 'تمرکز روی مشتریان Returning', 'بیش از نیمی از مشتریان فعال بازگشتی هستند؛ پیشنهادهای وفاداری می‌تواند ارزش طول عمر مشتری را افزایش دهد.', 84) ON CONFLICT DO NOTHING;

-- report_definitions
INSERT INTO "report_definitions" ("id", "title", "description", "formats") VALUES ('sales', 'گزارش فروش ماهانه', 'خلاصه فروش، سود، سفارش و مقایسه با دوره قبل', '["csv", "json"]'::json) ON CONFLICT DO NOTHING;
INSERT INTO "report_definitions" ("id", "title", "description", "formats") VALUES ('products', 'گزارش عملکرد محصولات', 'رتبه‌بندی محصولات، رشد و وضعیت موجودی', '["csv", "json"]'::json) ON CONFLICT DO NOTHING;
INSERT INTO "report_definitions" ("id", "title", "description", "formats") VALUES ('customers', 'گزارش مشتریان', 'بخش‌بندی، نگهداشت و ارزش طول عمر مشتری', '["csv", "json"]'::json) ON CONFLICT DO NOTHING;
INSERT INTO "report_definitions" ("id", "title", "description", "formats") VALUES ('orders', 'گزارش سفارش‌ها', 'فهرست سفارش‌ها، مبالغ، شهر و وضعیت', '["csv", "json"]'::json) ON CONFLICT DO NOTHING;

-- notifications
INSERT INTO "notifications" ("id", "user_id", "type", "title", "message", "display_time", "read", "route", "created_at") VALUES (1, 1, 'success', 'هدف فروش ماهانه رد شد', 'فروش این ماه از ۱۲ میلیارد تومان عبور کرد.', '۸ دقیقه پیش', FALSE, '/', '2026-08-12T16:49:52.825484') ON CONFLICT DO NOTHING;
INSERT INTO "notifications" ("id", "user_id", "type", "title", "message", "display_time", "read", "route", "created_at") VALUES (2, 1, 'warning', 'موجودی محصول کم است', 'موجودی کتانی Urban Flex به سطح هشدار رسیده است.', '۲۷ دقیقه پیش', FALSE, '/products', '2026-08-12T16:49:52.825488') ON CONFLICT DO NOTHING;
INSERT INTO "notifications" ("id", "user_id", "type", "title", "message", "display_time", "read", "route", "created_at") VALUES (3, 1, 'info', 'گزارش جدید آماده است', 'گزارش عملکرد فروش ماهانه آماده بررسی است.', '۱ ساعت پیش', FALSE, '/reports', '2026-08-12T16:49:52.825489') ON CONFLICT DO NOTHING;
INSERT INTO "notifications" ("id", "user_id", "type", "title", "message", "display_time", "read", "route", "created_at") VALUES (4, 1, 'trend', 'رشد کانال اپلیکیشن', 'درآمد اپلیکیشن در بازه اخیر ۱۴٪ رشد کرده است.', '۳ ساعت پیش', TRUE, '/analytics/sales', '2026-08-12T16:49:52.825489') ON CONFLICT DO NOTHING;
INSERT INTO "notifications" ("id", "user_id", "type", "title", "message", "display_time", "read", "route", "created_at") VALUES (5, 1, 'info', 'ورود جدید به سامانه', 'ورود موفق از مرورگر Chrome ثبت شد.', 'دیروز', TRUE, '/profile', '2026-08-12T16:49:52.825490') ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "users"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('categories', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "categories"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "products"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('customers', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "customers"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('orders', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "orders"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('order_items', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "order_items"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('dashboard_kpis', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "dashboard_kpis"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('sales_trend', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "sales_trend"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('category_sales_stats', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "category_sales_stats"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('channel_sales_stats', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "channel_sales_stats"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('region_stats', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "region_stats"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('activities', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "activities"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('customer_summary', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "customer_summary"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('customer_segment_stats', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "customer_segment_stats"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('insights', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "insights"), 1), 1), true);
SELECT setval(pg_get_serial_sequence('notifications', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "notifications"), 1), 1), true);

COMMIT;
