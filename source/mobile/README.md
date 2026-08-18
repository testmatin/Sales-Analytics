# Sales Analytics Mobile — Expo SDK 57

نسخه موبایل داشبورد Sales Analytics با React Native و Expo Router.

## اجرا

```bash
npm install
npx expo start
```

برای Android Emulator:

```bash
npx expo start --android
```

## اتصال به بک‌اند FastAPI

فایل `.env` بسازید و آدرس سرویس را وارد کنید:

```env
EXPO_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com
```

اگر آدرس API تنظیم نشده باشد برنامه با داده‌های آزمایشی داخلی اجرا می‌شود.

## صفحات

- ورود / حالت آزمایشی
- داشبورد KPI و روند فروش
- سفارش‌ها و جستجو
- محصولات و موجودی
- مشتری‌ها
- گزارش‌ها
- AI Insights
- تنظیمات و وضعیت API
