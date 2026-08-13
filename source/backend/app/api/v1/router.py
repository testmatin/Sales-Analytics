from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.api.v1.endpoints import auth, customers, dashboard, geography, insights, orders, products, reports, sales, search, ui

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])

protected = [Depends(get_current_user)]
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"], dependencies=protected)
api_router.include_router(sales.router, prefix="/sales", tags=["Sales"], dependencies=protected)
api_router.include_router(products.router, prefix="/products", tags=["Products"], dependencies=protected)
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"], dependencies=protected)
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"], dependencies=protected)
api_router.include_router(geography.router, prefix="/geography", tags=["Geography"], dependencies=protected)
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"], dependencies=protected)
api_router.include_router(insights.router, prefix="/insights", tags=["Insights"], dependencies=protected)
api_router.include_router(ui.router, prefix="/ui", tags=["UI Data"], dependencies=protected)
api_router.include_router(search.router, prefix="/search", tags=["Search"], dependencies=protected)
