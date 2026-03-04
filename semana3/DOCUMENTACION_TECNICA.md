# Documentación Técnica - StreamHub

## 1. Visión General del Proyecto

**StreamHub** es una plataforma de streaming de contenido audiovisual (películas y series) que implementa un sistema completo de gestión de usuarios, contenidos y valoraciones utilizando **MongoDB** como base de datos NoSQL.

### Tecnologías Utilizadas
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web para APIs REST
- **MongoDB** - Base de datos NoSQL orientada a documentos
- **Mongoose** - ODM (Object Data Modeling) para MongoDB
- **Docker** - Contenedor para MongoDB

---

## 2. Arquitectura de la Base de Datos

### 2.1 Modelo de Datos NoSQL

En MongoDB, los datos se almacenan en **documentos BSON** (Binary JSON), lo que permite una estructura flexible y semiestructurada. A diferencia de las bases de datos relacionales, NoSQL es ideal para:

- Datos con estructura variable
- Escalabilidad horizontal
- Alto rendimiento en lecturas/escrituras

### 2.2 Colecciones Definidas

#### Colección: `users` (Usuarios)
```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String (único),
  edad: Number,
  pais: String,
  plan: String ("free" | "premium"),
  historial: Array[Object],    // Documentos anidados
  listas: Array[Object],        // Listas personalizadas
  createdAt: Date,
  updatedAt: Date
}
```

**Decisión de diseño:** El historial y las listas se almacenan como arrays de documentos embebidos (embedded documents) para evitar consultas adicionales y mejorar el rendimiento.

#### Colección: `contents` (Contenidos)
```javascript
{
  _id: ObjectId,
  titulo: String,
  descripcion: String,
  tipo: String ("pelicula" | "serie"),
  genero: Array[String],
  duracion: Number,             // minutos (0 para series)
  episodios: Array[Object],     // solo para series
  añoLanzamiento: Number,
  director: String,
  actores: Array[String],
  calificacionPromedio: Number,
  fechaEstreno: Date,
  imagenUrl: String,
  disponible: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Decisión de diseño:** Las series tienen episodios embebidos porque son datos relacionados que no tienen sentido fuera de su serie padre.

#### Colección: `ratings` (Valoraciones)
```javascript
{
  _id: ObjectId,
  usuarioId: ObjectId (ref: User),
  contenidoId: ObjectId (ref: Content),
  calificacion: Number (1-5),
  comentario: String,
  fechaRating: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Decisión de diseño:** Los ratings son una colección separada (no embebida) porque:
- Un contenido puede tener miles de ratings
- Se necesitan agregaciones frecuentes sobre ratings
- Un usuario puede actualizar su rating

---

## 3. Explicación Técnica de los Archivos

### 3.1 server.js
```javascript
// Punto de entrada de la aplicación
// 1. Importa la configuración de Express desde app.js
// 2. Importa la función de conexión a MongoDB
// 3. Configura dotenv para variables de entorno
// 4. Conecta a MongoDB de forma asíncrona
// 5. Inicia el servidor en el puerto 3000
```

### 3.2 src/config/db.js
```javascript
// Módulo de conexión a MongoDB
// - Usa mongoose para la conexión
// - Implementa manejo de errores con try-catch
// - process.exit(1) termina la app si no hay conexión
// Esto es CRÍTICO: no tiene sentido iniciar sin DB
```

### 3.3 src/app.js
```javascript
// Configuración principal de Express
// Middlewares:
// - cors(): Permite solicitudes Cross-Origin (para frontend)
// - express.json(): Parsea JSON en cuerpos de petición
// Routes:
// - /api: Prefijo para todas las rutas de la API
```

### 3.4 Modelos Mongoose (src/models/)

#### Content.js - Modelo de Contenidos
```javascript
// Esquema para películas y series
// Campos principales:
// - titulo: Required (obligatorio)
// - tipo: Enum ["pelicula", "serie"] (validación)
// - genero: Array de strings (multigénero)
// - episodios: Schema embebido para series
// - calificacionPromedio: Default 0 (calculado desde ratings)
// - disponible: Default true (para controla disponibilidad)

// Virtuals: podrían calcularse campos como 'esSerie' usando el campo tipo
// Middlewares: could('save') para actualizar calificación promedio automáticamente
```

#### Rating.js - Modelo de Valoraciones
```javascript
// Esquema para calificaciones de usuarios
// Campos:
// - usuarioId y contenidoId: ObjectIds con referencias
// - calificacion: Number con min:1, max:5 (validación)
// - comentario: String opcional
// - fechaRating: Default Date.now()

// Índice compuesto único: {usuarioId: 1, contenidoId: 1}
// Esto IMPIDE que un usuario califique el mismo contenido dos veces
// Es una restricción de negocio CRÍTICA
```

#### User.js - Modelo de Usuarios
```javascript
// Esquema para usuarios
// Sub-documentos embebidos:
// - historial: { contenidoId, fechaVisualizacion, progreso }
// - listas: { nombre, contenidos[] }

// Embebido vs Referencia:
// - Embebido: datos que pertenecen exclusivamente a este documento
// - Referencia: datos que se comparten entre documentos

// Ventajas del embebido:
// - Una sola consulta para obtener usuario + historial
// - Sin necesidad de joins (lookups)
// - Transacciones atómicas
```

### 3.5 Controlador (src/controller/contentController.js)

El controlador implementa toda la lógica de negocio. Se explica por secciones:

#### TASK 3: Consultas con Operadores de MongoDB

| Función | Operador | Explicación |
|---------|----------|-------------|
| `getPeliculasLargas` | `$gt` | Greater Than: duración > 120 min |
| `getPeliculasCortas` | `$lt` | Less Than: duración < X min |
| `getContenidosPorAño` | `$eq` | Equal: año específico |
| `getContenidosPorGenero` | `$in` | IN: cualquier género de la lista |
| `getContenidosAvanzados` | `$and/$or` | Combinaciones lógicas |
| `buscarContenidosPorTitulo` | `$regex` | Búsqueda con expresiones regulares |
| `getUsuariosConMuchoHistorial` | `$gt` + `$exists` | Más de 5 elementos |

**Importante:** Los operadores de comparación en MongoDB:
- `$eq`: Equal (igual)
- `$ne`: Not Equal (no igual)
- `$gt`: Greater Than (mayor que)
- `$gte`: Greater Than or Equal (mayor o igual)
- `$lt`: Less Than (menor que)
- `$lte`: Less Than or Equal (menor o igual)
- `$in`: En array (cualquiera de los valores)
- `$nin`: Not In (ninguno de los valores)

**Operadores lógicos:**
- `$and`: AND (todas las condiciones)
- `$or`: OR (al menos una condición)
- `$not`: NOT (invierte la condición)
- `$nor`: NOR (ninguna de las condiciones)

#### TASK 4: Actualizaciones y Eliminaciones

| Función | Método | Descripción |
|---------|--------|-------------|
| `updateContenido` | `findByIdAndUpdate` | updateOne - Actualiza 1 documento |
| `updateMultipleContenidos` | `updateMany` | Actualiza varios según filtro |
| `deleteContenido` | `findByIdAndDelete` | deleteOne - Elimina 1 documento |
| `deleteMultipleContenidos` | `deleteMany` | Elimina varios según filtro |

**Diferencia importante:**
- `updateOne()` / `deleteOne()`: Solo actualiza/elimina el **primer** documento que coincida
- `updateMany()` / `deleteMany()`: Actualiza/elimina **todos** los documentos que coincidan

**Patrón usado:**
```javascript
// updateOne equivalente a updateMany con límite 1
await Content.updateMany(
  { filtro },
  { $set: { campo: valor } },
  { limit: 1 }
);
```

#### TASK 5: Índices

Los índices son estructuras de datos especiales que mejoran la velocidad de búsqueda.

```javascript
// Índices creados:
{ titulo: 1 }                    // Búsqueda por título
{ genero: 1 }                   // Filtrado por género
{ tipo: 1, añoLanzamiento: -1 } // Índice compuesto (tipo + año descendente)
{ calificacionPromedio: -1 }    // Ordenamiento por calificación
{ email: 1 }                    // Búsqueda de usuario por email (único)
{ plan: 1 }                     // Filtrado por plan
{ contenidoId: 1, usuarioId: 1 } // Índice compuesto único para ratings
```

**Explicación de opciones:**
- `1` = Ascendente
- `-1` = Descendente
- `{ unique: true }` = No permite duplicados

**Comando nativo MongoDB equivalente:**
```javascript
db.contents.createIndex({ titulo: 1 })
// Equivalente a:
db.contents.getIndexes() // Ver índices
```

#### Agregaciones (Pipelines)

Las agregaciones procesan documentos a través de múltiples etapas.

**Pipeline 1: Estadísticas por Género**
```javascript
[
  $unwind: "$genero",     // Descompone array género en documentos
  $group: {               // Agrupa por género
    _id: "$genero",
    cantidad: { $sum: 1 },     // Cuenta documentos
    duracionPromedio: { $avg: "$duracion" },  // Promedio
    calificacionPromedio: { $avg: "$calificacionPromedio" }
  },
  $sort: { cantidad: -1 },     // Ordena por cantidad descendente
  $project: {                  // Da formato a la salida
    _id: 0,
    genero: "$_id",
    cantidad: 1,
    ...
  }
]
```

**Pipeline 2: Top Contenidos Valorados**
```javascript
[
  $match: { tipo: "pelicula" },  // Filtra solo películas
  $lookup: {                     // JOIN con colección ratings
    from: "ratings",
    localField: "_id",
    foreignField: "contenidoId",
    as: "ratings"
  },
  $addFields: {                 // Calcula nuevo campo
    cantidadRatings: { $size: "$ratings" }
  },
  $sort: { calificacionPromedio: -1 },
  $limit: 10
]
```

**Pipeline 3: Usuarios Más Activos**
```javascript
// Usa $addFields + $size para contar elementos del array historial
// Ordena por cantidad de historial descendente
```

**Pipeline 4: Reporte de Ratings**
```javascript
// Agrupa ratings por contenido
// Calcula promedio, máximo, mínimo de calificaciones
// Usa $lookup para obtener info del contenido
```

**Pipeline 5: Contenidos por Década**
```javascript
// Usa $addFields + $mod para calcular década
// $addToSet para obtener tipos únicos por década
```

### 3.6 Rutas (src/routes/contentRoutes.js)

Patrón MVC (Model-View-Controller):
- **Model**: Los archivos en `models/` (datos)
- **View**: No hay (API REST, el cliente es la vista)
- **Controller**: `contentController.js` (lógica)

```javascript
// Estructura de rutas:
// GET    /api/consultas/peliculas-largas    → Obtener datos
// POST   /api/indexes/create               → Crear recursos
// PUT    /api/contenidos/:id               → Actualizar
// DELETE /api/contenidos/:id                → Eliminar
```

### 3.7 Seed (src/seed/seedData.js)

El archivo de seed pobliona la base de datos con datos de prueba.

```javascript
// Pasos:
// 1. Conexión a MongoDB
// 2. Limpiar colecciones existentes (deleteMany)
// 3. Insertar usuarios (insertMany)
// 4. Insertar contenidos (insertMany) 
// 5. Actualizar referencias en historiales
// 6. Insertar ratings (insertMany)
// 7. Recalcular calificaciones promedio

// Importante: Las referencias (ObjectIds) se obtienen
// después de insertar porque MongoDB genera los _id
```

---

## 4. Conceptos Clave de MongoDB

### 4.1 CRUD vs Mongoose

| Operación MongoDB | Método Mongoose | Descripción |
|-------------------|-----------------|-------------|
| insertOne/insertMany | .create() / .insertMany() | Crear documentos |
| find() | .find() | Leer documentos |
| updateOne/updateMany | .updateOne() / .updateMany() | Actualizar |
| deleteOne/deleteMany | .deleteOne() / .deleteMany() | Eliminar |

### 4.2 Embebido vs Referencia

**Cuando usar Embebido:**
- Datos que siempre se consultan juntos
- Relación 1:1 o 1:pocos
- Datos que no cambian frecuentemente
- Datos pequeños

**Cuando usar Referencia:**
- Relación muchos:muchos
- Datos que se consultan independientemente
- Datos que cambian frecuentemente
- Datos grandes

### 4.3 Índices

Los índices en MongoDB funcionan similar a los índices de un libro:

```javascript
// Sin índice: Escanea TODOS los documentos (COLLSCAN)
// Con índice: Va DIRECTO al documento (IXSCAN)

// El índice _id se crea automáticamente

// Índices compuestos:
// { campo1: 1, campo2: -1 }
// Primer campo = ordenación principal
// Segundo campo = desempate
```

### 4.4 Aggregation Pipeline

Es como un pipeline de fabricación:
- Cada etapa transforma los datos
- Los datos fluyen de una etapa a otra
- Puede haber múltiples documentos de salida

---

## 5. Decisiones de Diseño Explicadas

### 5.1 ¿Por qué Mongoose si MongoDB es sin esquema?

Mongoose proporciona:
- **Validación de datos** (schemas con tipos, required, enum)
- **Middlewares** (hooks antes/después de operaciones)
- **Métodos de instancia** (funciones en documentos)
- **Métodos estáticos** (funciones en modelos)
- **Virtuals** (campos calculados)

### 5.2 ¿Por qué no guardar calificaciones directamente en Content?

Porque violaría la **normalización**:
- Un contenido puede tener miles de ratings
- El promedio cambia cada vez que alguien califica
- Necesitamos guardar quién calificó qué (referencia)

### 5.3 ¿Por qué $unwind en agregaciones?

Porque MongoDB no puede agrupar directamente arrays:
```javascript
// Input: { genero: ["Acción", "Drama"] }
// $unwind: 
// { genero: "Acción" }
// { genero: "Drama" }
```

---

## 6. Optimizaciones de Rendimiento

### 6.1 Índices Creados
- Búsqueda por título: `createIndex({ titulo: 1 })`
- Filtrado por género: `createIndex({ genero: 1 })`
- Ordenamiento por rating: `createIndex({ calificacionPromedio: -1 })`

### 6.2 Proyecciones
En las consultas usamos `$project` para limitar campos devueltos:
```javascript
{ $project: { titulo: 1, calificacionPromedio: 1, _id: 0 } }
```

### 6.3 Índices Compuestos
Evitan crear índices separados para consultas que usan múltiples campos.

---

## 7. Errores Comunes y Soluciones

### Error: "Index with name already exists"
```javascript
// Solución: Eliminar índice primero o usar createIndex con opción
db.collection.dropIndex("nombreIndice")
```

### Error: "Cannot read property of undefined"
```javascript
// Verificar que la conexión a MongoDB está establecida
// Verificar que el modelo está importado correctamente
```

### Error: "MongoServerSelectionTimeoutError"
```javascript
// Verificar que MongoDB está corriendo
// docker-compose up -d
// Verificar credentials en .env
```

---

## 8. Referencias y Recursos

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)
- [MongoDB Indexes](https://docs.mongodb.com/manual/indexes/)

---

*Documento generado para el proyecto StreamHub - Semana 3*

