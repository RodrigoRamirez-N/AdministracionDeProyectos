import json
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlmodel import Session, select, or_
from sqlalchemy.orm import selectinload # For eager loading relationships

# Imports de los modelos y la función para obtener la sesión de la BD
from ..models import models
from ..models.database import get_session_equipo2, engine
from ..models.models import FacultyResponse 

# Router específico para el equipo 2
equipo2_router = APIRouter(
    prefix="/equipo2",
    tags=["Equipo 2 - Información del Campus"]
)

# --- Lógica para poblar la base de datos con datos iniciales ---

def populate_database_if_empty():
    with Session(engine) as session:
        # Revisar si la base de datos ya tiene datos
        if session.exec(select(models.Faculty)).first():
            print("La base de datos del Equipo 2 ya contiene datos. No se realizará la carga inicial.")
            return

        print("Base de datos del Equipo 2 vacía. Realizando carga inicial de datos...")

        # Cargar y procesar el Directorio desde JSON
        # La ruta es relativa a la carpeta raíz del backend (CampusVirtual)
        json_path = Path(__file__).parent.parent / "Directorio.json"
        with open(json_path, "r", encoding="utf-8") as f:
            directory_data = json.load(f)

        for faculty_data in directory_data:
            faculty = models.Faculty(name=faculty_data["faculty"])
            session.add(faculty)
            #'flush' para que faculty obtenga un ID y usarlo
            session.flush()

            for contact_data in faculty_data["contacts"]:
                contact = models.Contact(
                    name=contact_data["name"],
                    title=contact_data["title"],
                    email=contact_data["email"],
                    faculty_id=faculty.id
                )
                session.add(contact)
                session.flush()

                for phone_number in contact_data["phone"]:
                    phone = models.Phone(number=phone_number, contact_id=contact.id)
                    session.add(phone)
        
        # Cargar datos estáticos de Campos Deportivos
        sport_fields_data = [
            {"name": "Cancha de futbol multiproposito y pista de correr", "location": "Al lado del acceso Poniente del campus."},
            {"name": "Canchas de basquetbol", "location": "Frente a las facultades de: Ingenieria, Sistemas, Arquitectura y Artes."},
            {"name": "Cancha de beisbol", "location": "Frente al estacionamiento del lado oriente, frente a Artes."}
        ]
        for field_data in sport_fields_data:
            session.add(models.SportField(**field_data))

        # Cargar datos estáticos de la Biblioteca
        session.add(models.LibraryInfo()) # Usa los valores por defecto del modelo
        library_rooms_data = [
            {"name": "Sala de Videoconferencias", "capacity": "Hasta 170 personas tipo auditorio", "equipment": "Audio y video de Alta Resolución. 2 Cámaras de Alta Resolución. Capacidad de proyección, comunicación en tiempo real a puntos remotos múltiples, con equipos compatibles."},
            {"name": "Sala de Usos Múltiples", "capacity": "Hasta 70 personas", "equipment": "Excelente iluminación. Audio y Video de Alta Resolución. Capacidad de proyección y comunicación conexión punto a punto en tiempo real con equipos que cuenten con capacidades compatibles."},
            {"name": "Salas de Trabajo", "capacity": "20 personas", "equipment": "Mesa-bancos ergonómicos. Pantalla inteligente."},
            {"name": "Sala Audiovisual", "capacity": "40 personas", "equipment": "Excelente iluminación. Pantalla Inteligente."},
            {"name": "Aula Electrónica", "capacity": "15 personas", "equipment": "15 computadoras con conexión a internet."},
            {"name": "Vestíbulo", "capacity": "Hasta 200 personas", "equipment": "Se adapta para exposiciones, inauguraciones, registros o eventos culturales."},
            {"name": "Terraza | Jardín", "capacity": "N/A", "equipment": "Disponible para eventos al aire libre."}
        ]
        for room_data in library_rooms_data:
            session.add(models.LibraryRoom(**room_data))

        # Cargar Números Importantes
        session.add(models.ImportantNumber()) # Usa los valores por defecto del modelo

        # Guardar todos los cambios en la base de datos
        session.commit()
        print("Carga inicial de datos para el Equipo 2 completada.")


# --- Endpoints de la API ---

@equipo2_router.get("/directorio", response_model=List[FacultyResponse])
def get_directory(session: Session = Depends(get_session_equipo2), search: Optional[str] = None):
    eager_load_options = selectinload(models.Faculty.contacts).selectinload(models.Contact.phones)
    if search:
        # Búsqueda en facultades y contactos
        statement = (
            select(models.Faculty)
            .join(models.Contact)
            .where(
                or_(
                    models.Faculty.name.ilike(f"%{search}%"),
                    models.Contact.name.ilike(f"%{search}%"),
                    models.Contact.title.ilike(f"%{search}%")
                )
            )
            .options(eager_load_options)
            .distinct() # Para no repetir facultades si hay múltiples coincidencias
        )
        results = session.exec(statement).all()
        return results
    else:
        statement = select(models.Faculty).options(eager_load_options)
        # Si no hay búsqueda, devolvemos todo
        return session.exec(select(models.Faculty)).all()

@equipo2_router.get("/campos-deportivos", response_model=List[models.SportField])
def get_sport_fields(session: Session = Depends(get_session_equipo2)):
    """Obtiene la lista de campos deportivos."""
    return session.exec(select(models.SportField)).all()

@equipo2_router.get("/biblioteca")
def get_library_info(session: Session = Depends(get_session_equipo2)):
    """Obtiene toda la información de la Infoteca Central y sus salas."""
    info = session.exec(select(models.LibraryInfo)).one()
    rooms = session.exec(select(models.LibraryRoom)).all()
    return {"info_general": info, "salas_y_espacios": rooms}

@equipo2_router.get("/numeros-importantes", response_model=List[models.ImportantNumber])
def get_important_numbers(session: Session = Depends(get_session_equipo2)):
    """Obtiene la lista de números importantes."""
    return session.exec(select(models.ImportantNumber)).all()