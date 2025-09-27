from fastapi import APIRouter
from Modules.Equipo1.Model.equipo1_models import Item, ItemCreate
from Modules.Equipo1.Logic import equipo1_logic

# Crea el Router que se importará en main.py
router = APIRouter()

@router.get("/", response_model=list[Item])
def read_items_endpoint():
    """
    Endpoint para obtener una lista de todos los ítems.
    Delega directamente a la lógica.
    """
    return equipo1_logic.get_items_logic()

@router.post("/", response_model=Item, status_code=201)
def create_item_endpoint(item: ItemCreate):
    """
    Endpoint para crear un nuevo ítem.
    FastAPI usa Pydantic (ItemCreate) para validar automáticamente el cuerpo (body) del request.
    """
    new_item = equipo1_logic.create_item_logic(item)
    return new_item