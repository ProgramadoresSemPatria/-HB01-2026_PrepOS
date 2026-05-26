import json

from fastapi import APIRouter, Depends, HTTPException

from models.schemas import ContextResponse, RoadmapRequest, RoadmapTask
from services.llm_service import LLMService

router = APIRouter(tags=["roadmap"])


@router.post("/roadmap", response_model=list[RoadmapTask])
async def generate_roadmap(
    req: RoadmapRequest,
    llm_svc: LLMService = Depends(),
) -> list[RoadmapTask]:
    gaps_json = json.dumps([g.model_dump() for g in req.gaps], ensure_ascii=False)
    return await llm_svc.generate_roadmap(gaps_json, req.job_title)


@router.get("/context/{gap_id}", response_model=ContextResponse)
async def get_context(
    gap_id: str,
    llm_svc: LLMService = Depends(),
) -> ContextResponse:
    if not gap_id.strip():
        raise HTTPException(status_code=404, detail=f"Gap '{gap_id}' não encontrado.")
    return await llm_svc.get_context(gap_id)
