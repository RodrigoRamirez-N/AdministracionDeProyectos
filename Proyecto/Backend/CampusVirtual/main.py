from fastapi import FastAPI
from Modules.Equipo1.Routes.equipo1_router import router as equipo1_router
from Modules.Equipo4.models.database import create_db_and_tables_equipo4

app = FastAPI()


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables_equipo4()


app.include_router(
    equipo1_router,
    prefix="/api/equipo1",
    tags=["Equipo 1 - Items"],
)
