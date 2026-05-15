from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

class AppException(Exception):
    def __init__(self, status_code: int, message: str, error_code: str = "APP_ERROR"):
        self.status_code = status_code
        self.message = message
        self.error_code = error_code

def add_exception_handlers(app: FastAPI):
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.message,
                "error_code": exc.error_code,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Validation Error",
                "error_code": "VALIDATION_ERROR",
                "details": exc.errors()
            },
        )
        
    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Database Error",
                "error_code": "DATABASE_ERROR"
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error",
                "error_code": "INTERNAL_SERVER_ERROR"
            },
        )
