from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.auth import UserCreate
from app.core.security import get_password_hash

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(select(User).filter(User.id == user_id))
        return result.scalars().first()

    async def create(self, user_in: UserCreate) -> User:
        db_obj = User(
            email=user_in.email,
            name=user_in.name,
            hashed_password=get_password_hash(user_in.password),
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
