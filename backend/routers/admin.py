from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models import Todos
from backend.database import SessionLocal
from starlette import status
from pydantic import BaseModel, Field
from backend.routers.auth import get_current_user

router = APIRouter( 
    prefix='/admin', 
    tags=['admin'])

class TodoRequest(BaseModel):
    title:str = Field(min_length=3)
    description:str = Field(min_length=3, max_length=100)
    priority: int = Field(gt=0, lt=5)
    complete:bool = Field(default=False)

class TodoUpdateRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3)
    description: Optional[str] = Field(default=None, min_length=3, max_length=100)
    priority: Optional[int] = Field(default=None, gt=0, lt=5)
    complete: Optional[bool] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/todo', status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency, user: user_dependency):
    """Retrieve all todos in the system. Requires admin role."""
    if user is None or user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Not authorised')
    return db.scalars(select(Todos)).all()

@router.delete('/todo/{todo_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_by_id(user: user_dependency, db: db_dependency, todo_id: int):
    """Delete any todo by ID. Requires admin role."""
    if user is None or user.get('role') != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not authorised to perform this action')

    todo_item = db.scalar(select(Todos).where(Todos.id == todo_id))
    if not todo_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Todo item not found')

    db.delete(todo_item)
    db.commit()

@router.put('/todo/{todo_id}', status_code=status.HTTP_204_NO_CONTENT)
async def update_by_id(user: user_dependency, db: db_dependency, todo_update_request: TodoUpdateRequest, todo_id: int = Path(gt=0)):
    """Update any todo by ID. Requires admin role."""
    if user is None or user.get('role') != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not authorised to perform this action')
    todo_model = db.scalar(select(Todos).where(Todos.id == todo_id))

    if todo_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Item not found')

    for k, v in todo_update_request.model_dump(exclude_unset=True).items():
        setattr(todo_model, k, v)

    db.commit()
