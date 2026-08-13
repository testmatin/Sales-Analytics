def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["database"] == "ok"


def test_protected_route_requires_auth(client):
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "NOT_AUTHENTICATED"


def test_login_and_dashboard(client, admin_headers):
    response = client.get("/api/v1/dashboard?date_range=30d", headers=admin_headers)
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["summary"]["totalRevenue"] > 0
    assert len(body["salesTrend"]) > 0


def test_refresh_token_rotation(client, admin_tokens):
    old_refresh = admin_tokens["refreshToken"]
    refreshed = client.post("/api/v1/auth/refresh", json={"refreshToken": old_refresh})
    assert refreshed.status_code == 200, refreshed.text
    assert refreshed.json()["refreshToken"] != old_refresh

    reused = client.post("/api/v1/auth/refresh", json={"refreshToken": old_refresh})
    assert reused.status_code == 401
    assert reused.json()["error"]["code"] == "REFRESH_TOKEN_REVOKED"


def test_register_creates_viewer(client):
    response = client.post("/api/v1/auth/register", json={
        "name": "کاربر تست",
        "email": "test-user@example.com",
        "password": "StrongPass123!",
    })
    assert response.status_code == 201, response.text
    assert response.json()["user"]["role"] == "viewer"


def test_viewer_cannot_create_product(client):
    login = client.post("/api/v1/auth/login", json={"email": "viewer@nexa.example.com", "password": "Viewer123!"})
    headers = {"Authorization": f"Bearer {login.json()['accessToken']}"}
    response = client.post("/api/v1/products", headers=headers, json={
        "name": "محصول آزمایشی", "category": "تست", "unitsSold": 0, "revenue": 0,
        "growth": 0, "stock": 10, "status": "active"
    })
    assert response.status_code == 403


def test_admin_can_read_all_core_resources(client, admin_headers):
    for path in ["/api/v1/products", "/api/v1/customers/analytics", "/api/v1/orders", "/api/v1/insights", "/api/v1/reports", "/api/v1/ui"]:
        response = client.get(path, headers=admin_headers)
        assert response.status_code == 200, f"{path}: {response.text}"
