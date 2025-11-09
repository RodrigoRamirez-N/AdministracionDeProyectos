# models/database_equipo4.py
from sqlmodel import SQLModel, create_engine, Session

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
