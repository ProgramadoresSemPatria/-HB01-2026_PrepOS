from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from core.database import get_session
from models.db_models import RoadmapTaskDB
from models.schemas import ContextResponse, RoadmapRequest, RoadmapTask
from services.llm_service import LLMService

router = APIRouter(tags=["roadmap"])


@router.post("/roadmap", response_model=list[RoadmapTask])
async def generate_roadmap(
    req: RoadmapRequest,
    llm_svc: LLMService = Depends(),
    db: Session = Depends(get_session),
) -> list[RoadmapTask]:
    tasks = await llm_svc.generate_roadmap(req.gaps, req.job_title)

    existing = db.exec(
        select(RoadmapTaskDB).where(RoadmapTaskDB.session_id == req.session_id)
    ).all()
    for row in existing:
        db.delete(row)

    for task in tasks:
        db.add(RoadmapTaskDB(
            id=str(uuid4()),
            session_id=req.session_id,
            day=task.day,
            gap_id=task.gap_id,
            task=task.task,
            minutes=task.minutes,
            category=task.category,
        ))

    db.commit()
    return tasks


@router.get("/roadmap/{session_id}", response_model=list[RoadmapTask])
def get_roadmap(
    session_id: str,
    db: Session = Depends(get_session),
) -> list[RoadmapTask]:
    rows = db.exec(
        select(RoadmapTaskDB)
        .where(RoadmapTaskDB.session_id == session_id)
        .order_by(RoadmapTaskDB.day, RoadmapTaskDB.created_at)
    ).all()

    if not rows:
        raise HTTPException(status_code=404, detail="Roadmap não encontrado para esta sessão.")

    return [
        RoadmapTask(
            day=r.day,
            gap_id=r.gap_id,
            task=r.task,
            minutes=r.minutes,
            category=r.category,
        )
        for r in rows
    ]


@router.get("/context/{gap_id}", response_model=ContextResponse)
async def get_context(
    gap_id: str,
    llm_svc: LLMService = Depends(),
) -> ContextResponse:
    if not gap_id.strip():
        raise HTTPException(status_code=404, detail=f"Gap '{gap_id}' não encontrado.")
    return await llm_svc.get_context(gap_id)
