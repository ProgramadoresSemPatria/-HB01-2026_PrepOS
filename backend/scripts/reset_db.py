"""Reset do schema para o novo contrato (uso pontual).

O startup já cria a tabela `analysis` automaticamente via create_all. Este
script serve apenas para REMOVER as tabelas legadas (`session`, `roadmap_tasks`)
que sobraram do modelo antigo. É destrutivo — rode só quando quiser limpar.

Uso:  python -m scripts.reset_db
"""

from sqlalchemy import text

import models.db_models  # noqa: F401 — registra a metadata da Analysis
from core.database import create_db_and_tables, engine

LEGACY_TABLES = ("roadmap_tasks", "session")


def main() -> None:
    with engine.begin() as conn:
        for table in LEGACY_TABLES:
            conn.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE'))
            print(f"  dropped (if existed): {table}")

    create_db_and_tables()
    print("Schema atualizado: tabela 'analysis' garantida.")


if __name__ == "__main__":
    main()
