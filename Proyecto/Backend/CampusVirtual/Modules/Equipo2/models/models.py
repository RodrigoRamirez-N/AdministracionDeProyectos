from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

# --- Modelos para el Directorio ---

class Faculty(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    # La relación para acceder a los contactos desde una facultad
    contacts: List["Contact"] = Relationship(back_populates="faculty")

class Contact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    title: str
    email: Optional[str]
    # El campo que relaciona un contacto con su facultad
    faculty_id: Optional[int] = Field(default=None, foreign_key="faculty.id")
    faculty: Optional[Faculty] = Relationship(back_populates="contacts")
    # Relación para los números de teléfono
    phones: List["Phone"] = Relationship(back_populates="contact")

class Phone(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    number: str
    contact_id: Optional[int] = Field(default=None, foreign_key="contact.id")
    contact: Optional[Contact] = Relationship(back_populates="phones")

# --- Modelo para Campos Deportivos ---

class SportField(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    location: str

# --- Modelo para la Biblioteca y sus Salas ---

class LibraryInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = "Infoteca Central Campus Arteaga"
    schedule: str = "Lunes a Viernes de 8:00 a.m. a 9:00 p.m."
    location: str = "Carretera 57 km. 13. Ciudad Universitaria. Arteaga, Coahuila."
    contact_phone: str = "01 (844) 411-1407 | 411-1416"
    contact_email: str = "maria_bosque@uadec.edu.mx"
    website_url: str = "https://www.uadec.mx/infoteca-cu"

class LibraryRoom(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str # Ej: "Sala de Videoconferencias"
    capacity: str
    equipment: str

# --- Modelo para Números Importantes ---

class ImportantNumber(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = "SUBCOORDINADORA"
    person_name: str = "Lic. Patricia Gabriela González Sánchez"
    phone: str = "844 411 1419"
    email: str = "pgonzale@uadec.edu.mx"

from sqlmodel import SQLModel
from typing import List, Optional

class PhoneResponse(SQLModel):
    id: int
    number: str

class ContactResponse(SQLModel):
    id: int
    name: str
    title: str
    email: Optional[str]
    phones: List[PhoneResponse] = []

class FacultyResponse(SQLModel):
    id: int
    name: str
    contacts: List[ContactResponse] = []