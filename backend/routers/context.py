from fastapi import APIRouter, Depends, HTTPException

from models.schemas import ContextResponse
from services.llm_service import LLMService

router = APIRouter(tags=["context"])


@router.get("/context/{gap_id}", response_model=ContextResponse)
async def get_context(
    gap_id: str,
    llm_svc: LLMService = Depends(),
) -> ContextResponse:
    if not gap_id.strip():
        raise HTTPException(status_code=404, detail=f"Gap '{gap_id}' não encontrado.")
    return await llm_svc.get_context(gap_id)
