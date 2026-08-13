from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.product import Product
from app.repositories.product_repository import ProductRepository


class ProductService:
    def __init__(self):
        self.repo = ProductRepository()

    @staticmethod
    def serialize(product: Product) -> dict:
        return {
            "id": product.public_id,
            "name": product.name,
            "category": product.category.name,
            "unitsSold": product.units_sold,
            "revenue": int(product.revenue),
            "growth": float(product.growth),
            "stock": product.stock,
            "status": product.status,
        }

    def list(self, db: Session, page=1, page_size=20, search=None, category=None, status=None, sort_by="revenue", sort_order="desc"):
        items, total = self.repo.list(db, page, page_size, search, category, status, sort_by, sort_order)
        pages = max(1, (total + page_size - 1) // page_size)
        return {"items": [self.serialize(x) for x in items], "page": page, "page_size": page_size, "total": total, "pages": pages}

    def get(self, db: Session, product_id: str):
        product = self.repo.get_by_public_id(db, product_id)
        if not product:
            raise AppError("PRODUCT_NOT_FOUND", "Product not found", 404)
        return self.serialize(product)

    def create(self, db: Session, payload: dict):
        category = self.repo.get_or_create_category(db, payload["category"])
        ids = db.scalars(select(Product.public_id)).all()
        numbers = [int(value.split("-")[-1]) for value in ids if value.startswith("P-") and value.split("-")[-1].isdigit()]
        next_number = max(numbers + [1000]) + 1
        public_id = f"P-{next_number}"
        units = int(payload.get("unitsSold", 0))
        revenue = Decimal(str(payload.get("revenue", 0)))
        unit_price = revenue / units if units else Decimal("0")
        product = Product(
            public_id=public_id,
            sku=f"SKU-{next_number}",
            name=payload["name"],
            category_id=category.id,
            units_sold=units,
            revenue=revenue,
            unit_price=unit_price,
            growth=Decimal(str(payload.get("growth", 0))),
            stock=int(payload.get("stock", 0)),
            status=payload.get("status", "active"),
        )
        return self.serialize(self.repo.create(db, product))

    def update(self, db: Session, product_id: str, payload: dict):
        product = self.repo.get_by_public_id(db, product_id)
        if not product:
            raise AppError("PRODUCT_NOT_FOUND", "Product not found", 404)
        if payload.get("category"):
            product.category_id = self.repo.get_or_create_category(db, payload.pop("category")).id
        field_map = {"name":"name", "unitsSold":"units_sold", "revenue":"revenue", "growth":"growth", "stock":"stock", "status":"status"}
        for key, attr in field_map.items():
            if key in payload and payload[key] is not None:
                setattr(product, attr, payload[key])
        return self.serialize(self.repo.save(db, product))

    def delete(self, db: Session, product_id: str):
        product = self.repo.get_by_public_id(db, product_id)
        if not product:
            raise AppError("PRODUCT_NOT_FOUND", "Product not found", 404)
        self.repo.delete(db, product)
