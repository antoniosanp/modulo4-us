# Gestión Académica Universidad - Semana 2

Este proyecto implementa una base de datos académica completa utilizando PostgreSQL, Express y Node.js.

## Requisitos Previos

1. **PostgreSQL** instalado y corriendo
2. **Node.js** (v18+)
3. Configurar el usuario de PostgreSQL

## Configuración de PostgreSQL

### Opción 1: Configurar usuario postgres (recomendado)

```bash
# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurar contraseña para postgres
sudo -u postgres psql
```

En psql, ejecutar:
```sql
ALTER USER postgres PASSWORD 'postgres';
\q
```

### Opción 2: Crear un nuevo usuario

```bash
sudo -u postgres createuser -s antonio
sudo -u postgres psql
```

```sql
ALTER USER antonio PASSWORD 'tu_contraseña';
\q
```

## Configuración del Proyecto

1. **Copiar el archivo de configuración:**

```bash
cp .env.example .env
```

2. **Editar el archivo `.env`** con tus credenciales:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=gestion_academica_universidad
DB_PASSWORD=postgres
DB_PORT=5432
PORT=3000
```

## Inicialización de la Base de Datos

### Opción 1: Usando SQL directamente

```bash
psql -U postgres -f src/scripts/database.sql
```

### Opción 2: Usando la API

1. Iniciar el servidor:
```bash
npm start
```

2. Ejecutar los endpoints en orden:
```bash
# Crear base de datos
curl -X POST http://localhost:3000/api/academic/create-database

# Crear tablas
curl -X POST http://localhost:3000/api/academic/create-tables

# Insertar datos
curl -X POST http://localhost:3000/api/academic/insert-data

# Crear vista
curl -X POST http://localhost:3000/api/academic/create-vista

# Configurar roles y permisos
curl -X POST http://localhost:3000/api/academic/setup-roles

# Probar transacciones
curl -X POST http://localhost:3000/api/academic/execute-transaction
```

## Endpoints Disponibles

### TASK 1: Base de datos y tablas
- `POST /api/academic/create-database` - Crear la base de datos
- `POST /api/academic/create-tables` - Crear todas las tablas

### TASK 2: Inserción de datos
- `POST /api/academic/insert-data` - Insertar datos de ejemplo

### TASK 3: Consultas básicas
- `GET /api/academic/estudiantes-inscripciones` - JOIN de estudiantes con cursos
- `GET /api/academic/cursos-docentes-experiencia` - Cursos de docentes con experiencia > 5 años
- `GET /api/academic/promedio-por-curso` - Promedio de calificaciones por curso
- `GET /api/academic/estudiantes-multiples-cursos` - Estudiantes con más de 1 curso
- `GET /api/academic/estudiantes-estado` - Ver estado académico de estudiantes
- `DELETE /api/academic/docente/:id` - Eliminar docente (probar ON DELETE)
- `GET /api/academic/cursos-mas-dos-estudiantes` - Cursos con más de 2 inscritos

### TASK 4: Subconsultas y funciones
- `GET /api/academic/estudiantes-sobre-promedio` - Estudiantes sobre promedio general
- `GET /api/academic/carreras-cursos-semestre` - Carreras con cursos semestre >= 2
- `GET /api/academic/indicadores-academicos` - Indicadores con AVG, MAX, MIN, COUNT

### TASK 5: Vista
- `POST /api/academic/create-vista` - Crear vista_historial_academico
- `GET /api/academic/vista-historial` - Consultar la vista

### TASK 6: Control de acceso y transacciones
- `POST /api/academic/setup-roles` - Crear rol y configurar permisos
- `POST /api/academic/execute-transaction` - Probar BEGIN/SAVEPOINT/ROLLBACK/COMMIT

### CRUD Básico
- `GET /api/academic/estudiantes` - Listar estudiantes
- `POST /api/academic/estudiantes` - Crear estudiante
- `GET /api/academic/docentes` - Listar docentes
- `POST /api/academic/docentes` - Crear docente
- `GET /api/academic/cursos` - Listar cursos
- `POST /api/academic/cursos` - Crear curso
- `GET /api/academic/inscripciones` - Listar inscripciones
- `POST /api/academic/inscripciones` - Crear inscripción

## Estructura del Proyecto

```
semana2/
├── server.js                 # Punto de entrada del servidor
├── package.json             # Dependencias del proyecto
├── .env.example             # Ejemplo de configuración
├── src/
│   ├── app.js               # Configuración de Express
│   ├── config/
│   │   └── db.js            # Conexión a PostgreSQL
│   ├── controller/
│   │   └── academicController.js  # Lógica de la API
│   ├── routes/
│   │   └── academicRoutes.js      # Rutas de la API
│   └── scripts/
│       ├── database.sql      # Script SQL completo
│       └── initDatabase.js   # Inicialización automática
```

## Verificación de la Implementación

Después de ejecutar todo, verifica que:

1. ✅ Base de datos `gestion_academica_universidad` existe
2. ✅ Tablas creadas con todas las restricciones (PK, FK, NOT NULL, UNIQUE, CHECK)
3. ✅ 5+ estudiantes, 3+ docentes, 4+ cursos, 8+ inscripciones
4. ✅ Consultas JOIN, GROUP BY, AVG, HAVING funcionan
5. ✅ ALTER TABLE agrega columna correctamente
6. ✅ ON DELETE SET NULL funciona al eliminar docente
7. ✅ Subconsultas devuelven resultados correctos
8. ✅ Vista `vista_historial_academico` creada y funcional
9. ✅ Rol `revisor_academico` tiene permisos de solo lectura
10. ✅ Transacciones con BEGIN/SAVEPOINT/ROLLBACK/COMMIT funcionan

## Notas

- La base de datos usa `ON DELETE CASCADE` en inscripciones y `ON DELETE SET NULL` en cursos
- Las transacciones de ejemplo demuestran rollback a savepoint
- El rol `revisor_academico` tiene contraseña `revisor123` (cambiar en producción)

