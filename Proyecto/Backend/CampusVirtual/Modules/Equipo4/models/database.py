# models/database_equipo4.py
from sqlmodel import SQLModel, create_engine, Session, text
from pathlib import Path

BASE_DIR = Path(__file__).parent

sqlite_file_name = "equipo4_database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# echo=True para ver las queries en la terminal
engine = create_engine(sqlite_url, echo=True)


def create_db_and_tables_equipo4() -> None:
    from . import models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session_equipo4():
    with Session(engine) as session:
        yield session


def seed_initial_data_equipo4() -> None:
    """Inserta datos iniciales si la tabla está vacía (idempotente)."""
    # Verificar si ya hay datos
    with engine.connect() as conn:
        result = conn.exec_driver_sql("SELECT COUNT(*) FROM food_stands")
        count = result.scalar() or 0
        if count > 0:
            return  # Ya hay datos, no insertar de nuevo

        sql_path = BASE_DIR / "insert_equipo4.sql"
        if not sql_path.exists():
            print(f"Archivo SQL no encontrado: {sql_path}")
            return

        sql_script = sql_path.read_text(encoding="utf-8")

        # Ejecutar script multi-sentencia seguro para SQLite
        raw_conn = conn.connection  # DBAPI connection
        try:
            raw_conn.executescript(sql_script)
            conn.commit()
            print("Seed Equipo4 insertado correctamente")
        except Exception as e:
            print(f"Error al ejecutar seed Equipo4: {e}")
