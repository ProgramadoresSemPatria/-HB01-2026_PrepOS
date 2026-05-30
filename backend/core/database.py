from collections.abc import Generator

from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, create_engine

from core.config import settings

# SQLite exige check_same_thread=False para uso com o pool de threads do FastAPI;
# para Postgres e demais dialetos o connect_args fica vazio (sem efeito).
connect_args = (
    {"check_same_thread": False}
    if settings.database_url.startswith("sqlite")
    else {}
)
engine = create_engine(
    settings.database_url,
    echo=settings.environment == "development",
    connect_args=connect_args,
)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
    _ensure_columns()


def _ensure_columns() -> None:
    """Migração leve e idempotente para colunas novas.

    create_all() cria tabelas que faltam, mas NÃO altera tabelas já existentes.
    Como o projeto não usa Alembic, garantimos aqui as colunas adicionadas
    depois que a tabela `analysis` já existia em produção (ex.: interview_rounds),
    sem destruir dados. Tipo JSON funciona em SQLite e Postgres.
    """
    inspector = inspect(engine)
    if "analysis" not in inspector.get_table_names():
        return  # create_all acabou de criá-la com o schema completo.

    existing = {col["name"] for col in inspector.get_columns("analysis")}
    if "interview_rounds" not in existing:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE analysis ADD COLUMN interview_rounds JSON"))


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
