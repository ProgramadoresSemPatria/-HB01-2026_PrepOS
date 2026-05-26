from fastapi import APIRouter, Depends

from models.schemas import PitchCard, PitchRequest
from services.llm_service import LLMService

router = APIRouter(prefix="/pitch", tags=["pitch"])


@router.post("/", response_model=list[PitchCard])
async def generate_pitch(
    req: PitchRequest,
    llm_svc: LLMService = Depends(),
) -> list[PitchCard]:
    return await llm_svc.generate_pitch(req.candidate_json, req.job_json)
