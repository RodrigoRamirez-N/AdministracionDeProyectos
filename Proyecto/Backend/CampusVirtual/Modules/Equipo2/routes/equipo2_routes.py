import json
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlmodel import Session, select, or_
from sqlalchemy.orm import selectinload # For eager loading relationships

# Imports de los modelos y la función para obtener la sesión de la BD
from ..models import models
from ..models.database import get_session_equipo2, engine
from ..models.models import FacultyResponse, SportFieldResponse, LibraryInfoResponse, LibraryRoomResponse

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
        print("Cargando datos de Campos Deportivos...")
        cancha_basquet = models.SportField(name="Canchas de basquetbol", location="Frente a las facultades de Ingenieria, Sistemas, Arquitectura y Artes.")
        session.add(cancha_basquet)
        session.flush() # Para obtener el ID
        
        basquet_images = [
            models.SportFieldImage(url="assets/img/Canchas/CanchaArquitectura.png", alt_text="Cancha de Arquitectura", sport_field_id=cancha_basquet.id),
            models.SportFieldImage(url="assets/img/Canchas/CanchaArtes.png", alt_text="Cancha de Artes", sport_field_id=cancha_basquet.id),
            models.SportFieldImage(url="assets/img/Canchas/CanchaIngenieria.png", alt_text="Cancha de Ingeniería", sport_field_id=cancha_basquet.id),
            models.SportFieldImage(url="assets/img/Canchas/CanchaSistemas.png", alt_text="Cancha de Sistemas", sport_field_id=cancha_basquet.id),
        ]
        session.add_all(basquet_images)

        # Cancha de Futbol Americano (con una sola imagen)
        cancha_futbol = models.SportField(name="Cancha de futbol multiproposito y pista de correr", location="Al lado del acceso Poniente del campus.")
        session.add(cancha_futbol)
        session.flush()
        session.add(models.SportFieldImage(url="assets/img/Canchas/CanchaFutbolAmericano.jpg", alt_text="Cancha de Futbol Americano", sport_field_id=cancha_futbol.id))

        # Cancha de Beisbol (con dos imágenes)
        cancha_beisbol = models.SportField(name="Cancha de beisbol", location="Frente al estacionamiento del lado oriente, frente a Artes.")
        session.add(cancha_beisbol)
        session.flush()
        session.add(models.SportFieldImage(url="assets/img/Canchas/CanchaBeisbol.jpg", alt_text="Vista aérea del campo de beisbol", sport_field_id=cancha_beisbol.id))
        session.add(models.SportFieldImage(url="assets/img/Canchas/GradasBeisbol.png", alt_text="Gradas del campo de beisbol", sport_field_id=cancha_beisbol.id))

        # Cargar datos estáticos de la Biblioteca
        session.add(models.LibraryInfo()) # Usa los valores por defecto del modelo
        library_rooms_data = [
            {"name": "Sala de Videoconferencias", "capacity": "Hasta 170 personas tipo auditorio", "equipment": "Audio y video de Alta Resolución. 2 Cámaras de Alta Resolución. Capacidad de proyección, comunicación en tiempo real a puntos remotos múltiples, con equipos compatibles.", "image_url": "assets/img/Infoteca/SalaDeVideoconferencias.png"},
            {"name": "Sala de Usos Múltiples", "capacity": "Hasta 70 personas", "equipment": "Excelente iluminación. Audio y Video de Alta Resolución. Capacidad de proyección y comunicación conexión punto a punto en tiempo real con equipos que cuenten con capacidades compatibles.", "image_url": "assets/img/Infoteca/SalaDeUsosMultiples.png"},
            {"name": "Salas de Trabajo", "capacity": "20 personas", "equipment": "Mesa-bancos ergonómicos. Pantalla inteligente.", "image_url": "assets/img/Infoteca/SalaDeTrabajo.png"},
            {"name": "Sala Audiovisual", "capacity": "40 personas", "equipment": "Excelente iluminación. Pantalla Inteligente.", "image_url": "assets/img/Infoteca/SalaAudiovisual.png"},
            {"name": "Aula Electrónica", "capacity": "15 personas", "equipment": "15 computadoras con conexión a internet.", "image_url": "assets/img/Infoteca/AulaElectronica.png"},
            {"name": "Vestíbulo", "capacity": "Hasta 200 personas", "equipment": "Se adapta para exposiciones, inauguraciones, registros o eventos culturales.", "image_url": "assets/img/Infoteca/Vestibulo.png"},
            {"name": "Terraza | Jardín", "capacity": "N/A", "equipment": "Disponible para eventos al aire libre.", "image_url": "assets/img/Infoteca/Terraza.png"}
        ]
        for room_data in library_rooms_data:
            session.add(models.LibraryRoom(**room_data))

        # Cargar Números Importantes
        print("Cargando datos de Números Importantes...")
        session.add(models.ImportantNumber()) 
        directors_data = [
            {'email': 'j_padilla@uadec.edu.mx', 'name': 'Director de Facultad de Arquitectura', 'person_name': 'MTRO.ARQ. JESÚS ALBERTO PADILLA GARZA', 'phone': '(844) 6891001'},
            {'email': 'irenespigno@uadec.edu.mx', 'name': 'Directora de Academia Interamericana de Derechos Humanos', 'person_name': 'DRA.  IRENE SPIGNO', 'phone': '(844) 4111429'},
            {'email': 'rodrigo.muniz@uadec.edu.mx', 'name': 'Director de Facultad de Ingeniería', 'person_name': 'DR.  CARLOS RODRIGO MUÑÍZ VALDEZ', 'phone': '(844) 6891100 / (844) 4101094'},
            {'email': 'mcoronadorivera@uadec.edu.mx', 'name': 'Directora de Facultad de Sistemas', 'person_name': 'DRA. MARÍA DEL CARMEN CORONADO RIVERA', 'phone': '(844) 6891030'},
            {'email': 'raquel.torres@uadec.edu.mx', 'name': 'Directora de Facultad de Artes Plásticas Prof. Rubén Herrera', 'person_name': 'M.C.H.D.G. RAQUEL TORRES GUTIÉRREZ', 'phone': '(844) 6891067'},
            {'email': 'j.espericueta@uadec.edu.mx', 'name': 'Director de Escuela Superior de Música', 'person_name': 'LIC. JUAN ANTONIO ESPERICUETA GARCÍA', 'phone': '(844) 6891093'}
        ]

        for director_data in directors_data:
            session.add(models.ImportantNumber(**director_data))

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

@equipo2_router.get("/campos-deportivos", response_model=List[SportFieldResponse])
def get_sport_fields(session: Session = Depends(get_session_equipo2)):
    statement = select(models.SportField).options(selectinload(models.SportField.images))
    return session.exec(statement).all()

@equipo2_router.get("/biblioteca", response_model=LibraryInfoResponse)
def get_library_info(session: Session = Depends(get_session_equipo2)):
    info = session.exec(select(models.LibraryInfo)).one()
    rooms = session.exec(select(models.LibraryRoom)).all()
    return {"info_general": info, "salas_y_espacios": rooms}

@equipo2_router.get("/numeros-importantes", response_model=List[models.ImportantNumber])
def get_important_numbers(session: Session = Depends(get_session_equipo2)):
    """Obtiene la lista de números importantes."""
    return session.exec(select(models.ImportantNumber)).all()