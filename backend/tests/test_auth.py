"""
Authentication endpoint tests.

Tests for user registration, login, logout, and user retrieval endpoints.
"""

import pytest
from fastapi import status


class TestAuthEndpoints:
    """Test suite for authentication endpoints."""

    def test_register_new_user(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post("/auth/register", json=test_user_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]
        assert "id" in data
        assert "password" not in data  # Password should never be returned

    def test_register_duplicate_email(self, client, test_user_data):
        """Test registration with duplicate email fails."""
        # Register first user
        client.post("/auth/register", json=test_user_data)
        
        # Attempt to register with same email
        response = client.post("/auth/register", json=test_user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in response.json()["detail"].lower()

    def test_register_invalid_email(self, client):
        """Test registration with invalid email format fails."""
        invalid_data = {
            "email": "not-an-email",
            "username": "testuser",
            "password": "SecurePassword123!",
        }
        
        response = client.post("/auth/register", json=invalid_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_weak_password(self, client):
        """Test registration with weak password fails."""
        weak_password_data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "123",  # Too short
        }
        
        response = client.post("/auth/register", json=weak_password_data)
        
        # Should fail validation
        assert response.status_code in [
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
        ]

    def test_login_success(self, client, test_user_data):
        """Test successful login with correct credentials."""
        # Register user first
        client.post("/auth/register", json=test_user_data)
        
        # Login
        response = client.post(
            "/auth/token",
            data={
                "username": test_user_data["email"],
                "password": test_user_data["password"],
            },
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, test_user_data):
        """Test login with incorrect password fails."""
        # Register user first
        client.post("/auth/register", json=test_user_data)
        
        # Attempt login with wrong password
        response = client.post(
            "/auth/token",
            data={
                "username": test_user_data["email"],
                "password": "WrongPassword123!",
            },
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "incorrect" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user fails."""
        response = client.post(
            "/auth/token",
            data={
                "username": "nonexistent@example.com",
                "password": "SomePassword123!",
            },
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user(self, authenticated_client):
        """Test retrieving current authenticated user."""
        response = authenticated_client.get("/user/get_user")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "email" in data
        assert "username" in data
        assert "id" in data
        assert "password" not in data

    def test_get_current_user_unauthenticated(self, client):
        """Test retrieving user without authentication fails."""
        response = client.get("/user/get_user")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout(self, authenticated_client):
        """Test successful logout."""
        response = authenticated_client.post("/auth/logout")
        
        assert response.status_code == status.HTTP_200_OK
        
        # Verify user is logged out by attempting to access protected endpoint
        response = authenticated_client.get("/user/get_user")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_password_hashing(self, client, test_user_data, db_session):
        """Test that passwords are properly hashed in database."""
        from backend.models import User
        
        # Register user
        client.post("/auth/register", json=test_user_data)
        
        # Retrieve user from database
        user = db_session.query(User).filter(User.email == test_user_data["email"]).first()
        
        # Password should be hashed, not plain text
        assert user.hashed_password != test_user_data["password"]
        assert len(user.hashed_password) > 50  # Argon2 hashes are long
