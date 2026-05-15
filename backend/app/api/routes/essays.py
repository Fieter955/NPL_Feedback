from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.essay import EssayResponse, EssayHistoryItem
from app.schemas.common import StandardResponse
from app.repositories.essay_repository import EssayRepository
from app.services.scoring_service import ScoringService

router = APIRouter()
scoring_service = ScoringService()

@router.post("/evaluate", response_model=StandardResponse[EssayResponse])
async def evaluate_essay(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    
    # Process and evaluate
    extracted_text, evaluation_result = await scoring_service.process_and_evaluate(file)
    
    # Save to database
    essay_repo = EssayRepository(db)
    essay = await essay_repo.create(
        user_id=current_user.id,
        filename=file.filename,
        extracted_text=extracted_text,
        evaluation_data=evaluation_result
    )
    
    return StandardResponse(data=EssayResponse.from_orm(essay))

@router.get("/history", response_model=StandardResponse[List[EssayHistoryItem]])
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    essay_repo = EssayRepository(db)
    history = await essay_repo.get_history_by_user(user_id=current_user.id)
    return StandardResponse(data=[EssayHistoryItem.from_orm(item) for item in history])

@router.get("/{id}", response_model=StandardResponse[EssayResponse])
async def get_essay(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    essay_repo = EssayRepository(db)
    essay = await essay_repo.get_by_id_and_user(essay_id=id, user_id=current_user.id)
    if not essay:
        raise HTTPException(status_code=404, detail="Essay not found")
    return StandardResponse(data=EssayResponse.from_orm(essay))

@router.delete("/{id}", response_model=StandardResponse[bool])
async def delete_essay(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    essay_repo = EssayRepository(db)
    essay = await essay_repo.get_by_id_and_user(essay_id=id, user_id=current_user.id)
    if not essay:
        raise HTTPException(status_code=404, detail="Essay not found")
    
    success = await essay_repo.delete(essay_id=id)
    return StandardResponse(data=success, message="Essay deleted successfully")
