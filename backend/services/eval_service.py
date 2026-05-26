from models.schemas import InterviewEvaluateRequest, InterviewEvaluateResponse
from services.llm_service import LLMService


class EvalService:
    def __init__(self, llm_svc: LLMService) -> None:
        self.llm_svc = llm_svc

    async def evaluate(self, req: InterviewEvaluateRequest) -> InterviewEvaluateResponse:
        return await self.llm_svc.evaluate_interview(
            question=req.question,
            transcript=req.transcript,
            gaps=req.gaps,
            round=req.round,
        )
