from fastapi import APIRouter
from app.api.models import QueryRequest, DBValidationRequest, DBValidationResponse
from app.services.query_service import run_query_flow, validate_db_connection

router = APIRouter()

@router.post("/validate-db", response_model=DBValidationResponse)
def validate_db(request: DBValidationRequest):
    """Validate database connection and return table list"""
    result = validate_db_connection(request.db_config.dict())
    return result

@router.post("/query")
def query_db(request: QueryRequest):
    result = run_query_flow(
        db_config=request.db_config.dict(),
        question=request.question
    )
    return result