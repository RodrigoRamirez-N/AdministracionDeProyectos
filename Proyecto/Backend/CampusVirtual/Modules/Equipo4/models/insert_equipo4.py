from models.database import engine, create_db_and_tables_equipo4

def main():
    # 1. Crear tablas (si no existen)
    create_db_and_tables_equipo4()

    # 2. Leer el archivo SQL con los INSERT
    with open("insert_equipo4.sql", "r", encoding="utf-8") as f:
        sql_script = f.read()

    # 3. Ejecutar el script SQL usando el engine de SQLModel (SQLAlchemy por debajo)
    with engine.connect() as conn:
        conn.exec_driver_sql(sql_script)
        conn.commit()

    print("Datos de cafeterías y menú insertados correctamente")


if __name__ == "__main__":
    main()
