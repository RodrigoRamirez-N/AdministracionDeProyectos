from pydantic import BaseModel

class ItemCreate(BaseModel):
    nombre: str
    descripcion: str | None = None
    precio: float

class Item(ItemCreate):
    id: int
    