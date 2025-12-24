"""
User endpoint tests.

Tests for user profile endpoints including delete account functionality.
"""

from fastapi import status
import pytest


@pytest.fixture
def auth_headers(client, test_user_data):
    """Get authentication headers for a test user."""
    # Register the user
    client.post("/auth/", json=test_user_data)
    
    # Login and get token
    response = client.post(
        "/auth/token",
        data={
            "username": test_user_data["username"],
            "password": test_user_data["password"],
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


class TestUserEndpoints:
    """Test suite for user endpoints."""

    def test_delete_account_success(self, client, db_session, auth_headers):
        """Test successful account deletion."""
        from backend.models import Users

        # Verify user exists before deletion
        user = db_session.query(Users).filter(Users.username == "testuser").first()
        assert user is not None

        # Delete account
        response = client.delete("/user/delete_account", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify user no longer exists
        db_session.expire_all()
        user = db_session.query(Users).filter(Users.username == "testuser").first()
        assert user is None

    def test_delete_account_also_deletes_todos(self, client, db_session, auth_headers):
        """Test that deleting account also removes associated todos."""
        from backend.models import Users, Todos

        # Get user id
        user = db_session.query(Users).filter(Users.username == "testuser").first()
        user_id = user.id

        # Create a todo for this user
        todo = Todos(
            title="Test Todo",
            description="Test Description",
            priority=1,
            complete=False,
            owner_id=user_id,
        )
        db_session.add(todo)
        db_session.commit()

        # Verify todo exists
        todos = db_session.query(Todos).filter(Todos.owner_id == user_id).all()
        assert len(todos) == 1

        # Delete account
        response = client.delete("/user/delete_account", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify todos are also deleted
        db_session.expire_all()
        todos = db_session.query(Todos).filter(Todos.owner_id == user_id).all()
        assert len(todos) == 0

    def test_delete_account_unauthenticated(self, client):
        """Test that unauthenticated users cannot delete accounts."""
        response = client.delete("/user/delete_account")
        assert response.status_code in (
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        )
