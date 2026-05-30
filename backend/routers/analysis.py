import base64
from collections.abc import Awaitable, Callable
from typing import Any

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from sqlmodel import Session

from core.database import get_session
from models.db_models import Analysis
from models.schemas import (
    AnalysisCreateResponse,
    AnalysisDetailResponse,
    AnalyzeResponse,
    EvaluateInterviewAnswerRequest,
    EvaluateSolutionRequest,
    Gap,
    InterviewEvaluateResponse,
    InterviewRound,
    InterviewStartResponse,
    InterviewSummaryResponse,
    LeetCodeEvaluateResponse,
    LeetCodeProblem,
    PitchCard,
    RoadmapTask,
)
from services.llm_service import LLMService
from services.pdf_service import PDFService

router = APIRouter(tags=["analysis"])


# ── Helpers de cache ──────────────────────────────────────────────────────────

async def get_or_generate(
    db: Session,
    analysis_id: str,
    field_name: str,
    generate_fn: Callable[[Analysis], Awaitable[Any]],
) -> Any:
    """Retorna o campo `field_name` da Analysis; gera via LLM e persiste se nulo."""
    analysis = db.get(Analysis, analysis_id)
    if analysis is None:
        raise HTTPException(status_code=404, detail="Análise não encontrada.")

    cached = getattr(analysis, field_name)
    if cached is not None:
        return cached

    result = await generate_fn(analysis)
    setattr(analysis, field_name, result)
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return getattr(analysis, field_name)


async def _ensure_summary(db: Session, analysis: Analysis, llm: LLMService) -> dict:
    """Garante que o summary exista (artefato base do qual outros dependem)."""
    if analysis.summary is None:
        job_text = f"{analysis.job_title}\n\n{analysis.job_description}"
        result = await llm.analyze(analysis.resume_text, job_text)
        analysis.summary = result.model_dump()
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
    return analysis.summary


async def _ensure_gaps(db: Session, analysis: Analysis, llm: LLMService) -> list[Gap]:
    summary = await _ensure_summary(db, analysis, llm)
    return [Gap(**g) for g in summary["gaps"]]


# ── Ciclo de vida da análise ──────────────────────────────────────────────────

@router.post("/analysis", response_model=AnalysisCreateResponse, status_code=201)
async def create_analysis(
    resume: UploadFile,
    job_title: str = Form(...),
    job_description: str = Form(...),
    pdf_svc: PDFService = Depends(),
    db: Session = Depends(get_session),
) -> AnalysisCreateResponse:
    if resume.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=422, detail="Arquivo deve ser um PDF válido.")

    contents = await resume.read()
    resume_text = pdf_svc.extract_from_bytes(contents)

    analysis = Analysis(
        job_title=job_title,
        job_description=job_description,
        resume=contents,
        resume_text=resume_text,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return AnalysisCreateResponse(analysis_id=analysis.id)


@router.get("/analysis/{analysis_id}", response_model=AnalysisDetailResponse)
def get_analysis(
    analysis_id: str,
    db: Session = Depends(get_session),
) -> AnalysisDetailResponse:
    analysis = db.get(Analysis, analysis_id)
    if analysis is None:
        raise HTTPException(status_code=404, detail="Análise não encontrada.")

    return AnalysisDetailResponse(
        job_title=analysis.job_title,
        job_description=analysis.job_description,
        resume=base64.b64encode(analysis.resume).decode("ascii"),
    )


# ── Artefatos com cache (gerados sob demanda) ─────────────────────────────────

@router.get("/analysis/{analysis_id}/summary", response_model=AnalyzeResponse)
async def get_summary(
    analysis_id: str,
    llm: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> Any:
    async def generate(analysis: Analysis) -> dict:
        job_text = f"{analysis.job_title}\n\n{analysis.job_description}"
        result = await llm.analyze(analysis.resume_text, job_text)
        return result.model_dump()

    return await get_or_generate(db, analysis_id, "summary", generate)


@router.get("/analysis/{analysis_id}/roadmap", response_model=list[RoadmapTask])
async def get_roadmap(
    analysis_id: str,
    llm: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> Any:
    async def generate(analysis: Analysis) -> list[dict]:
        gaps = await _ensure_gaps(db, analysis, llm)
        tasks = await llm.generate_roadmap(gaps, analysis.job_title)
        return [t.model_dump() for t in tasks]

    return await get_or_generate(db, analysis_id, "roadmap", generate)


@router.get("/analysis/{analysis_id}/code-challenges", response_model=list[LeetCodeProblem])
async def get_code_challenges(
    analysis_id: str,
    llm: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> Any:
    async def generate(analysis: Analysis) -> list[dict]:
        gaps = await _ensure_gaps(db, analysis, llm)
        # Inputs derivados da própria análise: a stack vem do título da vaga e
        # os gaps das skills identificadas no summary. Seniority não é capturada
        # hoje, então é deixada em branco (o prompt já lida com contexto parcial).
        gaps_str = ", ".join(g.skill for g in gaps)
        problems = await llm.get_leetcode_problems(
            stack=analysis.job_title, seniority="", gaps=gaps_str
        )
        return [p.model_dump() for p in problems]

    return await get_or_generate(db, analysis_id, "code_challenges", generate)


@router.get("/analysis/{analysis_id}/pitch", response_model=list[PitchCard])
async def get_pitch(
    analysis_id: str,
    llm: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> Any:
    async def generate(analysis: Analysis) -> list[dict]:
        candidate_json = {"resume": analysis.resume_text}
        job_json = {"title": analysis.job_title, "description": analysis.job_description}
        cards = await llm.generate_pitch(candidate_json, job_json)
        return [c.model_dump() for c in cards]

    return await get_or_generate(db, analysis_id, "pitch", generate)


@router.get("/analysis/{analysis_id}/interview-questions", response_model=InterviewStartResponse)
async def get_interview_questions(
    analysis_id: str,
    llm: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> Any:
    async def generate(analysis: Analysis) -> dict:
        gaps = await _ensure_gaps(db, analysis, llm)
        result = await llm.generate_interview_questions(
            [g.skill for g in gaps], analysis.id
        )
        return result.model_dump()

    return await get_or_generate(db, analysis_id, "interview_questions", generate)


# ── Avaliações (stateless, sem cache) ─────────────────────────────────────────

@router.post("/evaluate-solution", response_model=LeetCodeEvaluateResponse)
async def evaluate_solution(
    req: EvaluateSolutionRequest,
    llm: LLMService = Depends(),
) -> LeetCodeEvaluateResponse:
    return await llm.evaluate_leetcode(
        req.slug, req.title, req.description, req.solution, req.language
    )


@router.post(
    "/analysis/{analysis_id}/evaluate-interview-answer",
    response_model=InterviewEvaluateResponse,
)
async def evaluate_interview_answer(
    analysis_id: str,
    req: EvaluateInterviewAnswerRequest,
    llm: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> InterviewEvaluateResponse:
    analysis = db.get(Analysis, analysis_id)
    if analysis is None:
        raise HTTPException(status_code=404, detail="Análise não encontrada.")

    evaluation = await llm.evaluate_interview(
        req.question, req.transcript, req.gaps, round=req.round
    )

    # Upsert por round no histórico: refazer uma rodada substitui o item antigo
    # em vez de duplicar, mantendo no máximo 3 rodadas ordenadas.
    record = InterviewRound(
        round=req.round,
        question=req.question,
        transcript=req.transcript,
        evaluation=evaluation,
    ).model_dump()
    rounds = [r for r in (analysis.interview_rounds or []) if r["round"] != req.round]
    rounds.append(record)
    analysis.interview_rounds = sorted(rounds, key=lambda r: r["round"])
    db.add(analysis)
    db.commit()

    return evaluation


@router.get(
    "/analysis/{analysis_id}/interview-summary",
    response_model=InterviewSummaryResponse,
)
async def get_interview_summary(
    analysis_id: str,
    llm: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> InterviewSummaryResponse:
    analysis = db.get(Analysis, analysis_id)
    if analysis is None:
        raise HTTPException(status_code=404, detail="Análise não encontrada.")

    rounds = analysis.interview_rounds or []
    if not rounds:
        raise HTTPException(
            status_code=409,
            detail="Nenhuma rodada avaliada ainda — responda ao menos uma pergunta.",
        )

    # Gerado sob demanda (sem cache): refazer uma rodada deve refletir no resumo.
    return await llm.summarize_interview([InterviewRound(**r) for r in rounds])
