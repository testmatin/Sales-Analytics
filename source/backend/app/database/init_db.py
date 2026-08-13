from app.database.base import Base
from app.database.session import engine
import app.models  # noqa: F401


def init_db() -> None:
    """Development helper only. Prefer `alembic upgrade head` for real environments."""
    Base.metadata.create_all(bind=engine)
