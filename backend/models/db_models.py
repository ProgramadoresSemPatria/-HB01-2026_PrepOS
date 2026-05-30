from datetime import datetime, timezone

from sqlmodel import Field, Index, SQLModel


class Session(SQLModel, table=True):
    id: str = Field(primary_key=True)
    candidate_text: str | None = None
    job_text: str | None = None
    match_score: int | None = None


class RoadmapTaskDB(SQLModel, table=True):
    __tablename__ = "roadmap_tasks"
    __table_args__ = (Index("ix_roadmap_tasks_session_day", "session_id", "day"),)

    id: str = Field(primary_key=True)
    session_id: str = Field(index=True)
    day: int
    gap_id: str
    task: str
    minutes: int
    category: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
