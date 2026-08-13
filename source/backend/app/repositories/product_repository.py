from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.category import Category
from app.models.product import Product


class ProductRepository:
    SORT_FIELDS = {
        "id": Product.public_id,
        "name": Product.name,
        "unitsSold": Product.units_sold,
        "revenue": Product.revenue,
        "growth": Product.growth,
        "stock": Product.stock,
    }

    def get_category_by_name(self, db: Session, name: str) -> Category | None:
        return db.scalar(select(Category).where(Category.name == name))

    def get_or_create_category(self, db: Session, name: str) -> Category:
        category = self.get_category_by_name(db, name)
        if category:
            return category
        category = Category(name=name)
        db.add(category)
        db.flush()
        return category

    def list(self, db: Session, page: int, page_size: int, search: str | None = None, category: str | None = None, status: str | None = None, sort_by: str = "revenue", sort_order: str = "desc"):
        filters = []
        if search:
            q = f"%{search.strip()}%"
            filters.append((Product.name.ilike(q)) | (Product.public_id.ilike(q)) | (Product.sku.ilike(q)))
        if category:
            filters.append(Category.name == category)
        if status:
            filters.append(Product.status == status)

        base = select(Product).join(Product.category).options(selectinload(Product.category)).where(*filters)
        count_stmt = select(func.count(Product.id)).join(Product.category).where(*filters)
        total = int(db.scalar(count_stmt) or 0)
        sort_column = self.SORT_FIELDS.get(sort_by, Product.revenue)
        order = sort_column.asc() if sort_order == "asc" else sort_column.desc()
        items = db.scalars(base.order_by(order).offset((page - 1) * page_size).limit(page_size)).all()
        return items, total

    def get_by_public_id(self, db: Session, public_id: str) -> Product | None:
        stmt = select(Product).options(selectinload(Product.category)).where(Product.public_id == public_id)
        return db.scalar(stmt)

    def get_by_name(self, db: Session, name: str) -> Product | None:
        return db.scalar(select(Product).options(selectinload(Product.category)).where(Product.name == name))

    def create(self, db: Session, product: Product) -> Product:
        db.add(product)
        db.commit()
        db.refresh(product)
        return self.get_by_public_id(db, product.public_id)  # type: ignore[return-value]

    def save(self, db: Session, product: Product) -> Product:
        db.add(product)
        db.commit()
        db.refresh(product)
        return self.get_by_public_id(db, product.public_id)  # type: ignore[return-value]

    def delete(self, db: Session, product: Product) -> None:
        db.delete(product)
        db.commit()

    def top(self, db: Session, limit: int = 5):
        stmt = select(Product).options(selectinload(Product.category)).order_by(Product.revenue.desc()).limit(limit)
        return db.scalars(stmt).all()
