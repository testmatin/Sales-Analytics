import os
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///./test_sales_analytics.db"
os.environ["SECRET_KEY"] = "test-secret-key-that-is-long-enough-for-tests"
os.environ["DEBUG"] = "false"

import pytest
from fastapi.testclient import TestClient

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.main import app
from scripts.migrate_json_to_postgres import seed_database


@pytest.fixture(scope="session", autouse=True)
def database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db, reset=True)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=engine)
    Path("test_sales_analytics.db").unlink(missing_ok=True)


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def admin_tokens(client: TestClient):
    response = client.post("/api/v1/auth/login", json={"email": "admin@nexa.example.com", "password": "Admin123!"})
    assert response.status_code == 200, response.text
    return response.json()


@pytest.fixture()
def admin_headers(admin_tokens):
    return {"Authorization": f"Bearer {admin_tokens['accessToken']}"}
