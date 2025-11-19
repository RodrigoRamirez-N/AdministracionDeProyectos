from typing import List, Optional, Literal
from fastapi import APIRouter, Query

from CampusVirtual.Modules.Equipo1.Model.equipo1_models import (
    Item, ItemCreate, Ruta
)
from CampusVirtual.Modules.Equipo1.Logic import equipo1_logic

router = APIRouter()



@router.get("/", response_model=List[Item], summary="Listar items")
def read_items_endpoint():
    """Devuelve la lista de items."""
    return equipo1_logic.get_items_logic()

@router.post("/", response_model=Item, status_code=201, summary="Crear item")
def create_item_endpoint(item: ItemCreate):
    """Crea un nuevo item."""
    return equipo1_logic.create_item_logic(item)


@router.get("/rutas", response_model=List[Ruta], summary="Listar rutas urbanas")
def listar_rutas_endpoint(
    tipo: Optional[Literal["urbana", "escolar"]] = Query(default=None),
    q: Optional[str] = Query(default=None, description="Buscar por nombre/parada"),
):
    """Lista rutas filtrando por tipo y/o búsqueda."""
    return equipo1_logic.get_rutas_logic(tipo=tipo, q=q)

@router.get("/rutas/{ruta_id}", response_model=Ruta, summary="Detalle de ruta")
def detalle_ruta_endpoint(ruta_id: str):
    """Detalle de una ruta por id."""
    return equipo1_logic.get_ruta_logic(ruta_id)
