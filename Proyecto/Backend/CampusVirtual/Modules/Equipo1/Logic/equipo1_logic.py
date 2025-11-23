from typing import List, Optional, Literal
from fastapi import HTTPException

from CampusVirtual.Modules.Equipo1.DataAcces import equipo1_dao
from CampusVirtual.Modules.Equipo1.Model.equipo1_models import Item, ItemCreate, Ruta




def get_items_logic() -> List[Item]:
    items = equipo1_dao.get_items_dao()
    if not items:
        raise HTTPException(status_code=404, detail="No hay items registrados")
    return items


def create_item_logic(item_data: ItemCreate) -> Item:
    if item_data.precio <= 0:
        raise HTTPException(status_code=422, detail="Precio inválido (debe ser mayor a 0)")
    return equipo1_dao.create_item_dao(item_data)




def get_rutas_logic(
    tipo: Optional[Literal["urbana", "escolar"]] = None,
    q: Optional[str] = None
) -> List[Ruta]:
    rutas = equipo1_dao.get_rutas_dao(tipo=tipo, q=q)
    if not rutas:
        raise HTTPException(status_code=404, detail="No se encontraron rutas")
    return rutas


def get_ruta_logic(ruta_id: str) -> Ruta:
    ruta = equipo1_dao.get_ruta_by_id_dao(ruta_id)
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return ruta
