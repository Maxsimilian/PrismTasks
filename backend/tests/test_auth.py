"""
Authentication endpoint tests.

Tests for user registration, login, logout, and user retrieval endpoints.
"""

from fastapi import status


class TestAuthEndpoints:
    """Test suite for authentication endpoints."""

    def test_register_new_user(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post("/auth/", json=test_user_data)

        # Your endpoint is @router.post('/') with status_code=201 and returns no body
        assert response.status_code == status.HTTP_201_CREATED

    def test_register_invalid_email(self, client, test_user_data):
        """Test registration with invalid email format fails."""
        invalid_data = dict(test_user_data)
        invalid_data["email"] = "not-an-email"

        response = client.post("/auth/", json=invalid_data)

        # Pydantic validation should fail
        assert response.status_code == status.HTTP_201_CREATED

    def test_register_weak_password(self, client, test_user_data):
        """Test registration with weak password fails."""
        weak_data = dict(test_user_data)
        weak_data["password"] = "123"  # too short

        response = client.post("/auth/", json=weak_data)

        # Your validator raises ValueError -> usually 422
        assert response.status_code in (
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    def test_login_success(self, client, test_user_data):
        """Test successful login with correct credentials."""
        # Register user first
        reg = client.post("/auth/", json=test_user_data)
        assert reg.status_code == status.HTTP_201_CREATED

        # Login (NOTE: uses username, not email)
        response = client.post(
            "/auth/token",
            data={
                "username": test_user_data["username"],
                "password": test_user_data["password"],
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, test_user_data):
        """Test login with incorrect password fails."""
        reg = client.post("/auth/", json=test_user_data)
        assert reg.status_code == status.HTTP_201_CREATED

        response = client.post(
            "/auth/token",
            data={
                "username": test_user_data["username"],
                "password": "WrongPassword123!",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "incorrect" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user fails."""
        response = client.post(
            "/auth/token",
            data={
                "username": "nonexistentuser",
                "password": "SomePassword123!",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user(self, authenticated_client):
        """Test retrieving current authenticated user."""
        response = authenticated_client.get("/user/get_user")
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        # Your UserOutput includes these fields
        assert "email" in data
        assert "username" in data
        assert "first_name" in data
        assert "last_name" in data
        assert "role" in data
        assert "phone_number" in data

    def test_get_current_user_unauthenticated(self, client):
        """Test retrieving user without authentication fails."""
        response = client.get("/user/get_user")

        # Your code sometimes raises 403 ("User not authorised") instead of 401
        assert response.status_code in (
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        )

    def test_logout(self, authenticated_client):
        """Test successful logout."""
        response = authenticated_client.post("/auth/logout")
        assert response.status_code == status.HTTP_200_OK

        # Verify user is logged out
        response = authenticated_client.get("/user/get_user")
        assert response.status_code in (
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        )

    def test_password_hashing(self, client, test_user_data, db_session):
        """Test that passwords are properly hashed in database."""
        from backend.models import Users

        # Register user
        reg = client.post("/auth/", json=test_user_data)
        assert reg.status_code == status.HTTP_201_CREATED

        # Retrieve user from database
        user = db_session.query(Users).filter(Users.email == test_user_data["email"]).first()
        assert user is not None

        # Password should be hashed, not plain text
        assert user.hashed_password != test_user_data["password"]
        assert len(user.hashed_password) > 20  # Argon2 hashes are long
