from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, Token
from app.schemas.common import StandardResponse
from app.repositories.user_repository import UserRepository
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=StandardResponse[UserResponse])
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)) -> Any:
    user_repo = UserRepository(db)
    user = await user_repo.get_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = await user_repo.create(user_in=user_in)
    return StandardResponse(data=UserResponse.from_orm(user))

@router.post("/login", response_model=StandardResponse[Token])
async def login(
    db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user_repo = UserRepository(db)
    user = await user_repo.get_by_email(email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.id)
    return StandardResponse(data=Token(access_token=access_token, token_type="bearer"))

@router.get("/me", response_model=StandardResponse[UserResponse])
async def read_users_me(current_user: User = Depends(get_current_user)) -> Any:
    return StandardResponse(data=UserResponse.from_orm(current_user))
