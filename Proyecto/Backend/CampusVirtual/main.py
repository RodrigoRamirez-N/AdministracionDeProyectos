from fastapi import FastAPI
from Modules.Equipo1.Routes.equipo1_router import router as equipo1_router
from Modules.Equipo4.models.database import create_db_and_tables_equipo4, seed_initial_data_equipo4
from Modules.Equipo4.Routes.equipo4_router import router as equipo4_router

app = FastAPI()


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables_equipo4()
    seed_initial_data_equipo4()


app.include_router(
    equipo1_router,
    prefix="/api/equipo1",
    tags=["Equipo 1 - Items"],
)

app.include_router(
    equipo4_router,
    prefix="/api/equipo4",
    tags=["Equipo 4"],
)
