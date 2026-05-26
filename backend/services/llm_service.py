import json

from fastapi import HTTPException
from openai import AsyncOpenAI, OpenAIError

from core.config import settings
from models.schemas import (
    AnalyzeResponse,
    ContextResponse,
    InterviewEvaluateResponse,
    InterviewStartResponse,
    LeetCodeEvaluateResponse,
    LeetCodeProblem,
    PitchCard,
    RoadmapTask,
)
from services.prompts import (
    ANALYZE_SYSTEM_PROMPT,
    CONTEXT_SYSTEM_PROMPT,
    INTERVIEW_EVAL_SYSTEM_PROMPT,
    INTERVIEW_QUESTIONS_SYSTEM_PROMPT,
    LEETCODE_EVAL_SYSTEM_PROMPT,
    LEETCODE_SYSTEM_PROMPT,
    PITCH_SYSTEM_PROMPT,
    ROADMAP_SYSTEM_PROMPT,
)


class LLMService:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"

    async def _chat_json(self, system: str, user: str) -> dict:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                timeout=30,
            )
            choice = response.choices[0]

            # finish_reason "length" ou "content_filter" resulta em content=None.
            # A SDK não lança exceção nesses casos — precisamos detectar explicitamente.
            if choice.message.content is None:
                finish_reason = choice.finish_reason
                raise HTTPException(
                    status_code=502,
                    detail=f"Resposta truncada ou bloqueada pelo serviço de IA (finish_reason={finish_reason}).",
                )

            return json.loads(choice.message.content)
        except OpenAIError:
            raise HTTPException(status_code=503, detail="Serviço de IA indisponível. Tente novamente.")
        except json.JSONDecodeError:
            raise HTTPException(status_code=502, detail="Resposta inválida do serviço de IA.")

    async def analyze(self, candidate_text: str, job_text: str) -> AnalyzeResponse:
        data = await self._chat_json(
            ANALYZE_SYSTEM_PROMPT,
            f"Candidato:\n{candidate_text}\n\nVaga:\n{job_text}",
        )
        return AnalyzeResponse(**data)

    async def generate_roadmap(self, gaps_json: str, job_title: str) -> list[RoadmapTask]:
        data = await self._chat_json(
            ROADMAP_SYSTEM_PROMPT,
            f"Job title: {job_title}\n\nGaps:\n{gaps_json}",
        )
        # O prompt garante o envelope {"tasks": [...]}; .get com [] evita KeyError
        # se o modelo, em casos raros, omitir a chave.
        tasks = data.get("tasks", [])
        return [RoadmapTask(**t) for t in tasks]

    async def get_context(self, skill: str) -> ContextResponse:
        data = await self._chat_json(
            CONTEXT_SYSTEM_PROMPT,
            f"Skill: {skill}",
        )
        return ContextResponse(**data)

    async def get_leetcode_problems(self, stack: str, seniority: str, gaps: str) -> list[LeetCodeProblem]:
        data = await self._chat_json(
            LEETCODE_SYSTEM_PROMPT,
            f"Stack: {stack}\nSeniority: {seniority}\nGaps: {gaps}",
        )
        # Chave "problems" agora é explícita no prompt — contrato determinista.
        problems = data.get("problems", [])
        return [LeetCodeProblem(**p) for p in problems]

    async def evaluate_leetcode(self, slug: str, title: str, description: str, solution: str, language: str) -> LeetCodeEvaluateResponse:
        data = await self._chat_json(
            LEETCODE_EVAL_SYSTEM_PROMPT,
            f"Problem: {title} ({slug})\nDescription:\n{description}\nLanguage: {language}\nSolution:\n{solution}",
        )
        return LeetCodeEvaluateResponse(**data)

    async def generate_pitch(self, candidate_json: dict, job_json: dict) -> list[PitchCard]:
        # json já está importado no topo do módulo — import local era desnecessário.
        data = await self._chat_json(
            PITCH_SYSTEM_PROMPT,
            f"Candidato:\n{json.dumps(candidate_json, ensure_ascii=False)}\n\nVaga:\n{json.dumps(job_json, ensure_ascii=False)}",
        )
        # Chave "cards" agora é explícita no prompt — contrato determinista.
        cards = data.get("cards", [])
        return [PitchCard(**c) for c in cards]

    async def generate_interview_questions(self, gaps: list[str], session_id: str) -> InterviewStartResponse:
        data = await self._chat_json(
            INTERVIEW_QUESTIONS_SYSTEM_PROMPT,
            f"Session: {session_id}\nGaps: {', '.join(gaps)}",
        )
        return InterviewStartResponse(**data)

    async def evaluate_interview(self, question: str, transcript: str, gaps: list[str], round: int) -> InterviewEvaluateResponse:
        data = await self._chat_json(
            INTERVIEW_EVAL_SYSTEM_PROMPT,
            f"Round: {round}\nGaps: {', '.join(gaps)}\nQuestion: {question}\nAnswer: {transcript}",
        )
        return InterviewEvaluateResponse(**data)
