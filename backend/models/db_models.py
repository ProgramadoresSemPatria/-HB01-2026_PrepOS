from sqlmodel import Field, SQLModel


class Session(SQLModel, table=True):
    id: str = Field(primary_key=True)
    candidate_text: str | None = None
    job_text: str | None = None
    match_score: int | None = None
