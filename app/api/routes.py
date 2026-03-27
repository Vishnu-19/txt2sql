from fastapi import APIRouter
from app.api.models import QueryRequest
from app.services.query_service import run_query_flow

router = APIRouter()

@router.post("/query")
def query_db(request: QueryRequest):
    result = run_query_flow(
        db_config=request.db_config.dict(),
        question=request.question
    )
    return result