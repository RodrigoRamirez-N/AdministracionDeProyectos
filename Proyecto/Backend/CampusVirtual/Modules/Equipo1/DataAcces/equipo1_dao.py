from typing import List, Optional, Literal
from CampusVirtual.Modules.Equipo1.Model.equipo1_models import (
    ItemCreate, Ruta, Horarios, Mapa
)


_db: dict[int, dict] = {}
_next_id: int = 1


def get_items_dao() -> List[dict]:
    """Retorna todos los ítems de la base de datos simulada."""
    return list(_db.values())



def create_item_dao(item_data: ItemCreate) -> dict:
    """Guarda un nuevo ítem en la base de datos simulada."""
    global _next_id
    item_id = _next_id


    new_item = item_data.dict()
    new_item["id"] = item_id

    _db[item_id] = new_item
    _next_id += 1
    return new_item



_RUTAS_DB: List[Ruta] = [
    Ruta(
        id="arteaga",
        nombre="Ruta Arteaga",
        tipo="urbana",
        frecuencia_min=33,   # <- antes 10
        horarios=Horarios(dias_habiles="06:00-22:00", sabado="07:00-21:00", domingo="07:00-20:00"),
        paradas_principales=[
            "Centro de Arteaga",
            "Blvd. Fundadores",
            "Entronque UAdeC",
            "Facultad de Sistemas"
        ],
        mapa=Mapa(iframe_src=None)
    ),
    Ruta(
        id="lobus",
        nombre="Lobus UAdeC",
        tipo="escolar",
        frecuencia_min=25,   # <- antes 15
        horarios=Horarios(dias_habiles="06:30-21:30"),
        paradas_principales=[
            "Parque UAdeC",
            "Rectoría",
            "Facultad de Sistemas",
            "Facultad de Ingeniería"
        ],
        mapa=Mapa(iframe_src=None)
    ),
]


def get_rutas_dao(
    tipo: Optional[Literal["urbana", "escolar"]] = None,
    q: Optional[str] = None
) -> List[Ruta]:
    """Devuelve la lista de rutas filtradas opcionalmente por tipo o búsqueda."""
    data = _RUTAS_DB
    if tipo:
        data = [r for r in data if r.tipo == tipo]
    if q:
        ql = q.lower()
        data = [
            r for r in data
            if ql in r.nombre.lower() or any(ql in p.lower() for p in r.paradas_principales)
        ]
    return data


def get_ruta_by_id_dao(ruta_id: str) -> Optional[Ruta]:
    """Busca una ruta por su ID."""
    return next((r for r in _RUTAS_DB if r.id == ruta_id), None)
