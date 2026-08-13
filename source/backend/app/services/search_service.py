from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.analytics import Insight
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product


class SearchService:
    def search(self, db: Session, query: str, limit: int = 12):
        q = f"%{query.strip()}%"
        results = []

        products = db.scalars(select(Product).options(selectinload(Product.category)).where(or_(Product.name.ilike(q), Product.public_id.ilike(q))).limit(limit)).all()
        for product in products:
            results.append({"id":product.public_id, "title":product.name, "subtitle":product.category.name, "route":"/products", "type":"product"})

        remaining = max(0, limit - len(results))
        if remaining:
            stmt = (select(Order).join(Order.customer).join(Order.items).join(OrderItem.product)
                    .options(selectinload(Order.customer), selectinload(Order.items).selectinload(OrderItem.product))
                    .where(or_(Order.public_id.ilike(q), Customer.full_name.ilike(q), Product.name.ilike(q))).limit(remaining))
            for order in db.scalars(stmt).unique().all():
                results.append({"id":order.public_id, "title":order.public_id, "subtitle":order.customer.full_name, "route":"/orders", "type":"order"})

        remaining = max(0, limit - len(results))
        if remaining:
            for insight in db.scalars(select(Insight).where(or_(Insight.title.ilike(q), Insight.description.ilike(q))).limit(remaining)).all():
                results.append({"id":str(insight.id), "title":insight.title, "subtitle":"Insight", "route":"/insights", "type":"insight"})
        return results[:limit]
