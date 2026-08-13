# Sales Analytics Frontend

React/Vite/TypeScript frontend for the Sales Analytics Platform.

## Important

This frontend contains **no fake application JSON data**. All dashboard, products, orders, customers, insights, profile, notifications, search and report data are loaded from the FastAPI backend.

## API URL

Default:

```text
http://localhost:8000/api/v1
```

Optional `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Start the backend first from `../backend`.
