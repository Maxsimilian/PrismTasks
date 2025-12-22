from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models import Users
from backend.database import SessionLocal
from starlette import status
from pydantic import BaseModel, Field, field_validator
import re
from backend.routers.auth import get_current_user, create_access_token
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

router = APIRouter(
    prefix='/user', 
    tags=['user']
)

ph = PasswordHasher()

class UserOutput(BaseModel):
    id: int
    username:str
    email:str
    first_name:str
    last_name:str
    role: str
    phone_number: Optional[str] = None

    class Config:
        from_attributes = True 

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def password_complexity(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Must contain at least one number')
        if not re.search(r'[^A-Za-z0-9]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserUpdateRequest(BaseModel):
    username:Optional[str] = None
    email:Optional[str] = None
    first_name:Optional[str] = None
    last_name:Optional[str] = None
    phone_number: Optional[str] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/get_user', status_code=status.HTTP_200_OK, response_model=UserOutput)
async def get_user_info(db: db_dependency, user: user_dependency):
    """Retrieve the authenticated user's profile information."""
    if user is None:
        raise HTTPException(status_code=403, detail='User not authorised')
    user_data = db.scalar(select(Users).where(Users.id == user.get('id')))
    if user_data is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user_data

@router.patch('/change_password', status_code=status.HTTP_204_NO_CONTENT)
async def change_password(db: db_dependency, user: user_dependency, change_password_request: ChangePasswordRequest):
    """Change the authenticated user's password."""
    if user is None:
        raise HTTPException(status_code=403, detail='User not authorised')
    user_data = db.scalar(select(Users).where(Users.id == user.get('id')))
    if user_data is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    if change_password_request.old_password == change_password_request.new_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='New password must be different from the old password')
    try:
        ph.verify(user_data.hashed_password, change_password_request.old_password)
    except VerifyMismatchError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Your request is invalid')
    new_hashed_password = ph.hash(change_password_request.new_password)
    user_data.hashed_password = new_hashed_password
    db.commit()
    

@router.put('/update_user', status_code=status.HTTP_204_NO_CONTENT)
async def update_user_data(db: db_dependency, user_request: UserUpdateRequest, user: user_dependency):
    """Update the authenticated user's profile information."""
    if user is None:
        raise HTTPException(status_code=401, detail='Unauthorised')
    user_data = db.scalar(select(Users).where(Users.id == user.get('id')))
    if user_data is None:
        raise HTTPException(status_code=401, detail='Unauthorised')

    for k, v in user_request.model_dump(exclude_unset=True).items():
        setattr(user_data, k, v)
    db.commit()
