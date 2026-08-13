from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product


class OrderRepository:
    SORT_FIELDS = {
        "id": Order.public_id,
        "amount": Order.total_amount,
        "city": Order.city,
        "date": Order.created_at,
        "status": Order.status,
    }

    def _options(self):
        return (
            selectinload(Order.customer),
            selectinload(Order.items).selectinload(OrderItem.product),
        )

    def list(self, db: Session, page: int, page_size: int, search: str | None = None, status: str | None = None, city: str | None = None, min_amount: int | None = None, max_amount: int | None = None, sort_by: str = "id", sort_order: str = "desc"):
        filters = []
        if search:
            q = f"%{search.strip()}%"
            filters.append((Order.public_id.ilike(q)) | (Customer.full_name.ilike(q)) | (Order.city.ilike(q)) | (Product.name.ilike(q)))
        if status:
            filters.append(Order.status == status)
        if city:
            filters.append(Order.city == city)
        if min_amount is not None:
            filters.append(Order.total_amount >= min_amount)
        if max_amount is not None:
            filters.append(Order.total_amount <= max_amount)

        join_products = bool(search)
        stmt = select(Order).join(Order.customer)
        count_stmt = select(func.count(func.distinct(Order.id))).join(Order.customer)
        if join_products:
            stmt = stmt.join(Order.items).join(OrderItem.product)
            count_stmt = count_stmt.join(Order.items).join(OrderItem.product)
        stmt = stmt.options(*self._options()).where(*filters)
        count_stmt = count_stmt.where(*filters)
        total = int(db.scalar(count_stmt) or 0)

        sort_column = self.SORT_FIELDS.get(sort_by, Order.created_at)
        order = sort_column.asc() if sort_order == "asc" else sort_column.desc()
        items = db.scalars(stmt.order_by(order).offset((page - 1) * page_size).limit(page_size)).unique().all()
        return items, total

    def get_by_public_id(self, db: Session, public_id: str) -> Order | None:
        stmt = select(Order).options(*self._options()).where(Order.public_id == public_id)
        return db.scalar(stmt)

    def create(self, db: Session, order: Order, item: OrderItem) -> Order:
        db.add(order)
        db.flush()
        item.order_id = order.id
        db.add(item)
        db.commit()
        return self.get_by_public_id(db, order.public_id)  # type: ignore[return-value]

    def save(self, db: Session, order: Order) -> Order:
        db.add(order)
        db.commit()
        return self.get_by_public_id(db, order.public_id)  # type: ignore[return-value]

    def recent(self, db: Session, limit: int = 5):
        stmt = select(Order).options(*self._options()).order_by(Order.created_at.desc()).limit(limit)
        return db.scalars(stmt).all()
