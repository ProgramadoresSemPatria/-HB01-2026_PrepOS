from fastapi import APIRouter, Depends

from models.schemas import LeetCodeEvaluateRequest, LeetCodeEvaluateResponse, LeetCodeProblem
from services.llm_service import LLMService

router = APIRouter(prefix="/leetcode", tags=["leetcode"])


@router.get("/", response_model=list[LeetCodeProblem])
async def get_problems(
    stack: str,
    seniority: str,
    gaps: str,
    llm_svc: LLMService = Depends(),
) -> list[LeetCodeProblem]:
    return await llm_svc.get_leetcode_problems(stack, seniority, gaps)


@router.post("/evaluate", response_model=LeetCodeEvaluateResponse)
async def evaluate_solution(
    req: LeetCodeEvaluateRequest,
    llm_svc: LLMService = Depends(),
) -> LeetCodeEvaluateResponse:
    return await llm_svc.evaluate_leetcode(
        req.slug, req.title, req.description, req.solution, req.language
    )
