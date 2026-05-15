from fastapi import APIRouter
from app.schemas.common import StandardResponse

router = APIRouter()

@router.get("", response_model=StandardResponse[str])
async def health_check():
    return StandardResponse(data="Healthy", message="Service is running correctly")
