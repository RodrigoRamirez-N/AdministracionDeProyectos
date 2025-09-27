from fastapi import FastAPI
from Modules.Equipo1.Routes.equipo1_router import router as equipo1_router


app = FastAPI()

app.include_router(
    equipo1_router,
    prefix="/api/equipo1", 
    tags=["Equipo 1 - Items"], 
)

