from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.essay import EssayEvaluation
from typing import List

class EssayRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: int, filename: str, extracted_text: str, evaluation_data: dict) -> EssayEvaluation:
        db_obj = EssayEvaluation(
            user_id=user_id,
            original_filename=filename,
            extracted_text=extracted_text,
            final_score=evaluation_data.get("final_score", 0),
            grade=evaluation_data.get("grade", "N/A"),
            summary=evaluation_data.get("summary", ""),
            subscores=evaluation_data.get("subscores", {}),
            strengths=evaluation_data.get("strengths", []),
            weaknesses=evaluation_data.get("weaknesses", []),
            suggestions=evaluation_data.get("suggestions", []),
            detailed_feedback=evaluation_data.get("detailed_feedback", [])
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def get_history_by_user(self, user_id: int) -> List[EssayEvaluation]:
        result = await self.db.execute(
            select(EssayEvaluation)
            .filter(EssayEvaluation.user_id == user_id)
            .order_by(EssayEvaluation.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id_and_user(self, essay_id: int, user_id: int) -> EssayEvaluation | None:
        result = await self.db.execute(
            select(EssayEvaluation)
            .filter(EssayEvaluation.id == essay_id, EssayEvaluation.user_id == user_id)
        )
        return result.scalars().first()

    async def delete(self, essay_id: int) -> bool:
        result = await self.db.execute(select(EssayEvaluation).filter(EssayEvaluation.id == essay_id))
        essay = result.scalars().first()
        if essay:
            await self.db.delete(essay)
            await self.db.commit()
            return True
        return False
