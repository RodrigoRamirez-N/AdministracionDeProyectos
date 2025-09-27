from Modules.Equipo1.Model.equipo1_models import ItemCreate

# Simulación de la "base de datos"
_db = {}
_next_id = 1

def get_items_dao():
    """Retorna todos los ítems de la base de datos."""
    return list(_db.values())

def create_item_dao(item_data: ItemCreate):
    """Guarda un nuevo ítem en la base de datos simulada."""
    global _next_id
    item_id = _next_id
    
    # Prepara el objeto para ser "guardado"
    new_item = item_data.dict()
    new_item["id"] = item_id
    
    _db[item_id] = new_item
    _next_id += 1
    
    return new_item