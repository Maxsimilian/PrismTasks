from fastapi import status


def _create_todo(authenticated_client, title="Test Todo", description="Desc", priority=3, complete=False):
    # Create
    resp = authenticated_client.post(
        "/todo",
        json={
            "title": title,
            "description": description,
            "priority": priority,
            "complete": complete,
        },
    )
    assert resp.status_code == status.HTTP_201_CREATED

    # Since POST /todo returns no JSON, fetch from GET /
    list_resp = authenticated_client.get("/")
    assert list_resp.status_code == status.HTTP_200_OK
    todos = list_resp.json()
    # Find by title (good enough for tests)
    created = next((t for t in todos if t["title"] == title and t["description"] == description), None)
    assert created is not None
    return created


class TestTodoEndpoints:
    def test_create_todo(self, authenticated_client):
        created = _create_todo(authenticated_client, title="Test Todo", description="This is a test todo", priority=3)
        assert created["title"] == "Test Todo"
        assert created["description"] == "This is a test todo"
        assert created["priority"] == 3
        assert created["complete"] is False
        assert "id" in created

    def test_create_todo_unauthenticated(self, client):
        resp = client.post("/todo", json={"title": "NoAuth", "description": "x", "priority": 1})
        assert resp.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)

    def test_get_all_todos(self, authenticated_client):
        _create_todo(authenticated_client, title="Todo 1", description="desc", priority=1)
        _create_todo(authenticated_client, title="Todo 2", description="desc", priority=1)
        _create_todo(authenticated_client, title="Todo 3", description="desc", priority=1)

        resp = authenticated_client.get("/")
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()

        assert len(data) == 3

    def test_get_todo_by_id(self, authenticated_client):
        created = _create_todo(authenticated_client, title="Specific Todo", description="Find me", priority=2)
        todo_id = created["id"]

        resp = authenticated_client.get(f"/todo/{todo_id}")
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()
        assert data["id"] == todo_id
        assert data["title"] == "Specific Todo"

    def test_get_nonexistent_todo(self, authenticated_client):
        resp = authenticated_client.get("/todo/99999")
        assert resp.status_code == status.HTTP_404_NOT_FOUND

    def test_update_todo(self, authenticated_client):
        created = _create_todo(authenticated_client, title="Original Title", description="Original", priority=2)
        todo_id = created["id"]

        resp = authenticated_client.put(
            f"/todo/{todo_id}",
            json={
                "title": "Updated Title",
                "description": "Updated description",
                "priority": 4,
                "complete": True,
            },
        )
        assert resp.status_code == status.HTTP_204_NO_CONTENT

        # verify
        get_resp = authenticated_client.get(f"/todo/{todo_id}")
        assert get_resp.status_code == status.HTTP_200_OK
        updated = get_resp.json()
        assert updated["title"] == "Updated Title"
        assert updated["complete"] is True

    def test_update_todo_partial(self, authenticated_client):
        created = _create_todo(authenticated_client, title="Partial", description="Original", priority=2)
        todo_id = created["id"]

        resp = authenticated_client.put(f"/todo/{todo_id}", json={"title": "Partial Updated"})
        # If your backend requires full payload, allow validation failure
        if resp.status_code == status.HTTP_204_NO_CONTENT:
            get_resp = authenticated_client.get(f"/todo/{todo_id}")
            assert get_resp.status_code == status.HTTP_200_OK
            assert get_resp.json()["title"] == "Partial Updated"
        else:
            assert resp.status_code in (status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_delete_todo(self, authenticated_client):
        created = _create_todo(authenticated_client, title="Delete Me", description="Delete me", priority=1)
        todo_id = created["id"]

        resp = authenticated_client.delete(f"/todo/{todo_id}")
        assert resp.status_code == status.HTTP_204_NO_CONTENT

        get_resp = authenticated_client.get(f"/todo/{todo_id}")
        assert get_resp.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_nonexistent_todo(self, authenticated_client):
        resp = authenticated_client.delete("/todo/99999")
        assert resp.status_code == status.HTTP_404_NOT_FOUND

    def test_todo_priority_validation(self, authenticated_client):
        resp = authenticated_client.post("/todo", json={"title": "Bad", "description": "x", "priority": 10})
        assert resp.status_code in (status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY)
