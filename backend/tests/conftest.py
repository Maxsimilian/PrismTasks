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

from backend.database import Base, get_db
from backend.main import app

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """
    Create a fresh database session for each test.
    
    Yields:
        Session: SQLAlchemy database session
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """
    Create a test client with database session override.
    
    Args:
        db_session: Database session fixture
        
    Yields:
        TestClient: FastAPI test client
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """
    Provide test user data for registration and login tests.
    
    Returns:
        dict: User registration data
    """
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "SecurePassword123!",
    }


@pytest.fixture
def authenticated_client(client, test_user_data):
    """
    Create an authenticated test client with a registered user.
    
    Args:
        client: FastAPI test client
        test_user_data: Test user registration data
        
    Returns:
        TestClient: Authenticated test client
    """
    # Register user
    client.post("/auth/register", json=test_user_data)
    
    # Login to get authentication cookie
    response = client.post(
        "/auth/token",
        data={
            "username": test_user_data["email"],
            "password": test_user_data["password"],
        },
    )
    
    assert response.status_code == 200
    
    return client
