import os
from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, field_validator
import re
from backend.models import Users
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from backend.database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import select
from starlette import status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix='/auth', 
    tags=['auth']
)
ph = PasswordHasher()


# Environment variables - fail loudly if SECRET_KEY is missing
ENV = os.getenv("ENV", "dev")
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    if ENV == "test":
        SECRET_KEY = "test-secret"  # safe default for CI/tests only
    else:
        raise RuntimeError("SECRET_KEY environment variable is not set. Application cannot start.")
    
ALGORITHM = 'HS256'
ENV = os.getenv('ENV', 'dev')
COOKIE_SAMESITE = os.getenv('COOKIE_SAMESITE', 'lax').lower()
# If SameSite is None, Secure must be True (browser requirement)
SECURE_COOKIE = (ENV == "prod") or (COOKIE_SAMESITE == "none")

ACCESS_TOKEN_EXPIRE_MINUTES = 20

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


class CreateUserRequest(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str
    role: str
    phone_number: Optional[str] = None

    @field_validator('password')
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


class Token(BaseModel):
    access_token: str
    token_type: str


def authenticate_user(username: str, plain_password: str, db: Session):
    user = db.scalar(select(Users).where(Users.username == username))
    if not user:
        return None

    try:
        ph.verify(user.hashed_password, plain_password)
        return user
    except VerifyMismatchError:
        return None


def create_access_token(username: str, user_id: int, role: str, expires_delta: timedelta):
    expires = datetime.now(timezone.utc) + expires_delta
    encode = {'sub': username, 'id': user_id, 'role': role, 'exp': expires}
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode a JWT token and return user info.
    Raises HTTPException on failure.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        user_role = payload.get('role')
        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail='Could not validate the user.'
            )
        return {'username': username, 'id': user_id, 'role': user_role}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail='Could not validate the user.'
        )


async def get_current_user(request: Request):
    auth_header = request.headers.get("authorization")
    token = None

    if auth_header and auth_header.lower().startswith("bearer "):
        token = auth_header.split(" ", 1)[1].strip()

    if not token:
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return decode_token(token)


@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    user_model = Users(
        email=create_user_request.email,
        username=create_user_request.username,
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        hashed_password=ph.hash(create_user_request.password),
        role=create_user_request.role,
        phone_number=create_user_request.phone_number,
        is_active=True
    )
    db.add(user_model)
    db.commit()


@router.post('/token', response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency
):
    """Existing Bearer token login - unchanged for backwards compatibility."""
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        username=user.username,
        user_id=user.id,
        role=user.role,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"access_token": token, "token_type": "bearer"}


@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        samesite="none",
        secure=True,
    )
    return {"ok": True}


@router.post('/logout')
async def logout(response: Response):
    """Clear the authentication cookie using matching attributes."""
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite=COOKIE_SAMESITE,
        secure=SECURE_COOKIE,
    )
    return {"ok": True}
