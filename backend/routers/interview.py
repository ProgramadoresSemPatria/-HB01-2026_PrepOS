from fastapi import APIRouter, Depends
from fastapi.responses import Response

from models.schemas import (
    InterviewEvaluateRequest,
    InterviewEvaluateResponse,
    InterviewStartRequest,
    InterviewStartResponse,
    TTSRequest,
)
from services.llm_service import LLMService
from services.tts_service import TTSService

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/start", response_model=InterviewStartResponse)
async def start_interview(
    req: InterviewStartRequest,
    llm_svc: LLMService = Depends(),
) -> InterviewStartResponse:
    return await llm_svc.generate_interview_questions(req.gaps, req.session_id)


@router.post("/tts")
async def text_to_speech(
    req: TTSRequest,
    tts_svc: TTSService = Depends(),
) -> Response:
    audio_bytes = await tts_svc.synthesize(req.question_text, req.voice)
    return Response(content=audio_bytes, media_type="audio/mpeg")


@router.post("/evaluate", response_model=InterviewEvaluateResponse)
async def evaluate_answer(
    req: InterviewEvaluateRequest,
    llm_svc: LLMService = Depends(),
) -> InterviewEvaluateResponse:
    return await llm_svc.evaluate_interview(req.question, req.transcript, req.gaps, req.round)
