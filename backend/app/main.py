from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import api_router
from app.core.exceptions import add_exception_handlers
from app.core.database import engine, Base
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
# Using a wildcard or env-based origin is better for Railway deployments
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
add_exception_handlers(app)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up API...")
    # In a real production app we would rely solely on alembic for migrations.
    # We create tables here for convenience if they don't exist.
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all) # Only for dev reset
        await conn.run_sync(Base.metadata.create_all)
        pass

@app.get("/")
async def root():
    return {"message": "Welcome to AI Essay Evaluator API"}
