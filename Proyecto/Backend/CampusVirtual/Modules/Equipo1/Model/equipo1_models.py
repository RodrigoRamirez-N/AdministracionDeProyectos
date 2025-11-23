from pydantic import BaseModel
from typing import Optional, List, Literal
from pydantic import BaseModel

class ItemCreate(BaseModel):
    nombre: str
    descripcion: str | None = None
    precio: float

class Item(ItemCreate):
    id: int
    
class Horarios(BaseModel):
    dias_habiles: Optional[str] = None
    sabado: Optional[str] = None
    domingo: Optional[str] = None

class Mapa(BaseModel):
    iframe_src: Optional[str] = None

class Ruta(BaseModel):
    id: str
    nombre: str
    tipo: Literal["urbana", "escolar"]
    frecuencia_min: int
    horarios: Horarios
    paradas_principales: List[str]
    mapa: Mapa