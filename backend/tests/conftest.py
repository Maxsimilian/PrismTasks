"""
Test configuration and fixtures for backend tests.

This module provides shared fixtures and configuration for all backend tests,
including database setup, test client, and authentication helpers.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database import Base
from backend.main import app
from backend.routers import auth, todos, user, admin

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[auth.get_db] = override_get_db
    app.dependency_overrides[todos.get_db] = override_get_db
    app.dependency_overrides[user.get_db] = override_get_db
    app.dependency_overrides[admin.get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "role": "user",
        "phone_number": "07123456789",
        "password": "SecurePassword123!",
    }


@pytest.fixture
def authenticated_client(client, test_user_data):
    reg = client.post("/auth/", json=test_user_data)
    assert reg.status_code in (200, 201), reg.text

    resp = client.post(
        "/auth/login",
        data={
            "username": test_user_data["username"],
            "password": test_user_data["password"],
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200, resp.text
    return client
