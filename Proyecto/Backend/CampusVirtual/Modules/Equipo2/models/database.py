from sqlmodel import SQLModel, create_engine, Session

# Base de datos SQLite para el módulo Equipo2
sqlite_file_name = "equipo2_campus_info.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# Debugger
engine = create_engine(sqlite_url, echo=True)

# Función para crear las tablas en la base de datos
def create_db_and_tables_equipo2():
    from . import models
    SQLModel.metadata.create_all(engine)

# Función para obtener una sesión de base de datos
def get_session_equipo2():
    with Session(engine) as session:
        yield session