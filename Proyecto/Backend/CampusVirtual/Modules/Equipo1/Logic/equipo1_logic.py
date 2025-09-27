from fastapi import HTTPException
from Modules.Equipo1.DataAcces import equipo1_dao
from Modules.Equipo1.Model.equipo1_models import ItemCreate

def get_items_logic():
    
    items = equipo1_dao.get_items_dao()
    if len(items) == 0:
        raise HTTPException(status_code=404, detail="No hay ítems disponibles")
    
    return items

def create_item_logic(item_data: ItemCreate):
    
    if item_data.precio <= 0:
        print("Advertencia: Precio inválido en la lógica.")
        
    return equipo1_dao.create_item_dao(item_data)