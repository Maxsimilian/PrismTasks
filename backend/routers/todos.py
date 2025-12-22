from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from backend.models import Todos
from backend.database import SessionLocal
from starlette import status
from pydantic import BaseModel, Field
from .auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class TodoRequest(BaseModel):
    title:str = Field(min_length=3)
    description:str = Field(min_length=3, max_length=100)
    priority: int = Field(gt=0, lt=6)
    complete:bool = Field(default=False)


@router.get('/', status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    """Retrieve all todos belonging to the authenticated user."""
    return db.scalars(select(Todos).where(Todos.owner_id == user.get('id'))).all()

@router.get('/todo/{todo_id}', status_code=status.HTTP_200_OK)
async def todo_by_id(user: user_dependency, db: db_dependency, todo_id: int = Path(gt=0)):
    """Retrieve a specific todo by ID for the authenticated user."""
    if user is None:
        raise HTTPException(status_code=401, detail='Not authenticated')
    todo_item = db.scalar(select(Todos).where(and_(Todos.id == todo_id, Todos.owner_id == user.get('id'))))
    if todo_item is not None:
        return todo_item
    raise HTTPException(status_code=404, detail='Todo not found')

@router.post('/todo', status_code=status.HTTP_201_CREATED)
async def create_todo(user: user_dependency, db: db_dependency, todo_request: TodoRequest):
    """Create a new todo for the authenticated user."""
    if user is None:
        raise HTTPException(status_code=401, detail='Not authenticated')
    todo_model = Todos(**todo_request.model_dump(), owner_id=user.get('id'))
    db.add(todo_model)
    db.commit()

@router.put('/todo/{todo_id}', status_code=status.HTTP_204_NO_CONTENT)
async def update_todo(user: user_dependency, db: db_dependency, todo_request: TodoRequest, todo_id: int = Path(gt=0)):
    """Update an existing todo by ID for the authenticated user."""
    if user is None:
        raise HTTPException(status_code=401, detail='Not authenticated')
    todo_model = db.scalar(select(Todos).where(and_(Todos.id == todo_id, Todos.owner_id == user.get('id'))))

    if todo_model is None:
        raise HTTPException(status_code=404, detail='Item not found')

    for k, v in todo_request.model_dump().items():
        setattr(todo_model, k, v)
    db.commit()

@router.delete('/todo/{todo_id}', status_code=status.HTTP_204_NO_CONTENT)
async def todo_delete(user: user_dependency, db: db_dependency, todo_id: int = Path(gt=0)):
    """Delete a todo by ID for the authenticated user."""
    if user is None:
        raise HTTPException(status_code=403, detail='Not authorised to perform this action')
    todo_model = db.scalar(select(Todos).where(and_(Todos.id == todo_id, Todos.owner_id == user.get('id'))))
    if todo_model is None:
        raise HTTPException(status_code=404, detail='Item not found')
    db.delete(todo_model)
    db.commit()
