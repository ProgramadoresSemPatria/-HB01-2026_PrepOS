from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import JSON, Column, LargeBinary
from sqlmodel import Field, SQLModel


class Analysis(SQLModel, table=True):
    """Entidade única que concentra o ciclo de vida de uma análise.

    O PDF e o texto extraído do currículo são gravados no POST /analysis.
    Os campos de artefato (summary, roadmap, ...) começam nulos e são
    preenchidos sob demanda via cache-or-generate (ver get_or_generate).
    """

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    job_title: str
    job_description: str
    resume: bytes = Field(sa_column=Column(LargeBinary, nullable=False))
    resume_text: str

    summary: dict | None = Field(default=None, sa_column=Column(JSON))
    roadmap: list | None = Field(default=None, sa_column=Column(JSON))
    code_challenges: list | None = Field(default=None, sa_column=Column(JSON))
    pitch: list | None = Field(default=None, sa_column=Column(JSON))
    interview_questions: dict | None = Field(default=None, sa_column=Column(JSON))
    # Histórico das rodadas da entrevista (até 3), alimentado a cada avaliação e
    # consumido pelo resumo final. Cada item segue o schema InterviewRound.
    interview_rounds: list | None = Field(default=None, sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
