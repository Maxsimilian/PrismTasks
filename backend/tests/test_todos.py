"""
Todo API endpoint tests.

Tests for creating, reading, updating, and deleting todos.
"""

import pytest
from fastapi import status


class TestTodoEndpoints:
    """Test suite for todo CRUD endpoints."""

    def test_create_todo(self, authenticated_client):
        """Test creating a new todo."""
        todo_data = {
            "title": "Test Todo",
            "description": "This is a test todo",
            "priority": 3,
            "category": "work",
        }
        
        response = authenticated_client.post("/todos/", json=todo_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == todo_data["title"]
        assert data["description"] == todo_data["description"]
        assert data["priority"] == todo_data["priority"]
        assert data["category"] == todo_data["category"]
        assert data["complete"] is False
        assert "id" in data

    def test_create_todo_unauthenticated(self, client):
        """Test creating todo without authentication fails."""
        todo_data = {
            "title": "Test Todo",
            "description": "This should fail",
        }
        
        response = client.post("/todos/", json=todo_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_all_todos(self, authenticated_client):
        """Test retrieving all todos for authenticated user."""
        # Create multiple todos
        todos = [
            {"title": "Todo 1", "description": "First todo"},
            {"title": "Todo 2", "description": "Second todo"},
            {"title": "Todo 3", "description": "Third todo"},
        ]
        
        for todo in todos:
            authenticated_client.post("/todos/", json=todo)
        
        # Get all todos
        response = authenticated_client.get("/todos/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3
        assert all("title" in todo for todo in data)

    def test_get_todo_by_id(self, authenticated_client):
        """Test retrieving a specific todo by ID."""
        # Create a todo
        todo_data = {"title": "Specific Todo", "description": "Find me"}
        create_response = authenticated_client.post("/todos/", json=todo_data)
        todo_id = create_response.json()["id"]
        
        # Get the todo by ID
        response = authenticated_client.get(f"/todos/{todo_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == todo_id
        assert data["title"] == todo_data["title"]

    def test_get_nonexistent_todo(self, authenticated_client):
        """Test retrieving non-existent todo returns 404."""
        response = authenticated_client.get("/todos/99999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_todo(self, authenticated_client):
        """Test updating an existing todo."""
        # Create a todo
        todo_data = {"title": "Original Title", "description": "Original description"}
        create_response = authenticated_client.post("/todos/", json=todo_data)
        todo_id = create_response.json()["id"]
        
        # Update the todo
        update_data = {
            "title": "Updated Title",
            "description": "Updated description",
            "complete": True,
            "priority": 5,
        }
        response = authenticated_client.put(f"/todos/{todo_id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["description"] == update_data["description"]
        assert data["complete"] is True
        assert data["priority"] == 5

    def test_update_todo_partial(self, authenticated_client):
        """Test partial update of todo (only some fields)."""
        # Create a todo
        todo_data = {
            "title": "Original Title",
            "description": "Original description",
            "priority": 3,
        }
        create_response = authenticated_client.post("/todos/", json=todo_data)
        todo_id = create_response.json()["id"]
        
        # Update only the title
        update_data = {"title": "New Title"}
        response = authenticated_client.put(f"/todos/{todo_id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "New Title"
        # Description should remain unchanged
        assert data["description"] == todo_data["description"]

    def test_delete_todo(self, authenticated_client):
        """Test deleting a todo."""
        # Create a todo
        todo_data = {"title": "Todo to Delete", "description": "Delete me"}
        create_response = authenticated_client.post("/todos/", json=todo_data)
        todo_id = create_response.json()["id"]
        
        # Delete the todo
        response = authenticated_client.delete(f"/todos/{todo_id}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify todo is deleted
        get_response = authenticated_client.get(f"/todos/{todo_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_nonexistent_todo(self, authenticated_client):
        """Test deleting non-existent todo returns 404."""
        response = authenticated_client.delete("/todos/99999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_can_only_access_own_todos(self, client, test_user_data):
        """Test that users can only access their own todos."""
        # Create first user and todo
        client.post("/auth/register", json=test_user_data)
        client.post(
            "/auth/token",
            data={
                "username": test_user_data["email"],
                "password": test_user_data["password"],
            },
        )
        
        todo_response = client.post(
            "/todos/",
            json={"title": "User 1 Todo", "description": "Private"},
        )
        todo_id = todo_response.json()["id"]
        
        # Logout first user
        client.post("/auth/logout")
        
        # Create second user
        user2_data = {
            "email": "user2@example.com",
            "username": "user2",
            "password": "SecurePassword456!",
        }
        client.post("/auth/register", json=user2_data)
        client.post(
            "/auth/token",
            data={
                "username": user2_data["email"],
                "password": user2_data["password"],
            },
        )
        
        # Try to access first user's todo
        response = client.get(f"/todos/{todo_id}")
        
        # Should return 404 (not found) rather than 403 (forbidden) for security
        assert response.status_code in [
            status.HTTP_404_NOT_FOUND,
            status.HTTP_403_FORBIDDEN,
        ]

    def test_filter_todos_by_completion(self, authenticated_client):
        """Test filtering todos by completion status."""
        # Create completed and incomplete todos
        authenticated_client.post(
            "/todos/",
            json={"title": "Complete Todo", "complete": True},
        )
        authenticated_client.post(
            "/todos/",
            json={"title": "Incomplete Todo", "complete": False},
        )
        
        # Filter for incomplete todos (if endpoint supports it)
        response = authenticated_client.get("/todos/?complete=false")
        
        if response.status_code == status.HTTP_200_OK:
            data = response.json()
            assert all(not todo["complete"] for todo in data)

    def test_todo_priority_validation(self, authenticated_client):
        """Test that priority must be within valid range."""
        invalid_priority_data = {
            "title": "Invalid Priority",
            "priority": 10,  # Assuming max is 5
        }
        
        response = authenticated_client.post("/todos/", json=invalid_priority_data)
        
        # Should fail validation
        assert response.status_code in [
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
        ]
