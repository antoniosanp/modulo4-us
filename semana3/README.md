# StreamHub - Semana 3: Gestión de contenido y usuarios en MongoDB

## Descripción
API REST para la gestión de contenido audiovisual (películas y series) y usuarios de una plataforma de streaming, implementada con MongoDB.

## Estructura del Proyecto

```
semana3/
├── .env                    # Configuración de variables de entorno
├── docker-compose.yml      # Contenedor MongoDB
├── package.json            # Dependencias del proyecto
├── server.js               # Punto de entrada del servidor
└── src/
    ├── app.js              # Configuración de Express
    ├── config/
    │   └── db.js           # Conexión a MongoDB
    ├── models/
    │   ├── User.js         # Modelo de Usuario
    │   ├── Content.js      # Modelo de Contenido (películas/series)
    │   └── Rating.js       # Modelo de Valoraciones
    ├── controller/
    │   └── contentController.js  # Controladores con CRUD y aggregations
    ├── routes/
    │   └── contentRoutes.js     # Rutas de la API
    └── seed/
        └── seedData.js    # Datos de ejemplo
```

## Requisitos

- Node.js 18+
- Docker y Docker Compose
- MongoDB 7

## Instalación

1. Instalar dependencias:
```bash
cd semana3
npm install
```

2. Iniciar MongoDB con Docker:
```bash
docker-compose up -d
```

3. Poblar la base de datos con datos de ejemplo:
```bash
npm run seed
```

4. Iniciar el servidor:
```bash
npm start
```

El servidor estará disponible en: http://localhost:3000

---

## Endpoints de la API

### TASK 3: Consultas con Operadores

| Método | Endpoint | Descripción | Operador |
|--------|----------|-------------|----------|
| GET | `/api/consultas/peliculas-largas` | Películas con duración > 120 min | `$gt` |
| GET | `/api/consultas/usuarios-mucho-historial` | Usuarios con >5 contenidos vistos | `$gt` |
| GET | `/api/consultas/por-genero?generos=Drama,Acción` | Contenidos por género | `$in` |
| GET | `/api/consultas/avanzados` | Series drama o calif. > 4.5 | `$or` |
| GET | `/api/consultas/buscar?query=lord` | Búsqueda por título | `$regex` |
| GET | `/api/consultas/por-año/2019` | Contenidos por año | `$eq` |
| GET | `/api/consultas/peliculas-cortas?maxDuracion=100` | Películas cortas | `$lt` |
| GET | `/api/consultas/usuarios-por-plan/premium` | Usuarios por plan | `$eq` |

### TASK 4: Actualizaciones y Eliminaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PUT | `/api/contenidos/:id` | Actualizar contenido (updateOne) |
| PUT | `/api/contenidos/update-many` | Actualizar múltiples (updateMany) |
| PUT | `/api/contenidos/:id/actualizar-calificacion` | Actualizar calificación promedio |
| DELETE | `/api/contenidos/:id` | Eliminar contenido (deleteOne) |
| DELETE | `/api/contenidos/delete-many` | Eliminar múltiples (deleteMany) |

### TASK 5: Índices

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/indexes/create` | Crear índices |
| GET | `/api/indexes` | Ver índices existentes |
| GET | `/api/indexes?coleccion=content` | Ver índices de una colección |

### TASK: Agregaciones (≥2 pipelines)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/agregaciones/estadisticas-genero` | Estadísticas por género |
| GET | `/api/agregaciones/top-valorados` | Top contenidos valorados |
| GET | `/api/agregaciones/usuarios-activos` | Usuarios más activos |
| GET | `/api/agregaciones/reporte-ratings` | Reporte de calificaciones |
| GET | `/api/agregaciones/por-decada` | Contenidos por década |

---

## Colecciones MongoDB

### users (Usuarios)
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "edad": 28,
  "pais": "México",
  "plan": "premium",
  "historial": [
    { "contenidoId": "...", "fechaVisualizacion": "2024-01-15", "progreso": 100 }
  ],
  "listas": [
    { "nombre": "Mis Favoritas", "contenidos": ["..."] }
  ]
}
```

### contents (Películas y Series)
```json
{
  "titulo": "El Señor de los Anillos",
  "descripcion": "Una aventura épica...",
  "tipo": "pelicula",
  "genero": ["Fantasía", "Aventura"],
  "duracion": 178,
  "añoLanzamiento": 2001,
  "director": "Peter Jackson",
  "actores": ["Elijah Wood", "Ian McKellen"],
  "calificacionPromedio": 4.8,
  "disponible": true
}
```

### ratings (Valoraciones)
```json
{
  "usuarioId": "...",
  "contenidoId": "...",
  "calificacion": 5,
  "comentario": "¡Una obra maestra!",
  "fechaRating": "2024-01-15"
}
```

---

## Ejemplos de Uso

### Consultar películas largas:
```bash
curl http://localhost:3000/api/consultas/peliculas-largas
```

### Buscar por título:
```bash
curl "http://localhost:3000/api/consultas/buscar?query=lord"
```

### Ver estadísticas por género:
```bash
curl http://localhost:3000/api/agregaciones/estadisticas-genero
```

### Crear índices:
```bash
curl -X POST http://localhost:3000/api/indexes/create
```

---

## Criterios de Aceptación Cumplidos

- ✅ Colecciones y documentos definidos para el dominio (users, contents, ratings)
- ✅ Datos poblados con insertOne/insertMany
- ✅ Consultas find() usando operadores ($gt, $lt, $eq, $in, $and, $or, $regex)
- ✅ updateOne/updateMany y deleteOne/deleteMany implementados
- ✅ Índices creados con createIndex/getIndexes
- ✅ ≥2 pipelines de agregación con $match, $group, $sort, $project, $unwind

