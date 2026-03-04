import Content from "../models/Content.js";
import User from "../models/User.js";
import Rating from "../models/Rating.js";

// ============================================
// TASK 3: Consultas con operadores ($gt, $lt, $eq, $in, $and, $or, $regex)
// ============================================

// Obtener películas con duración > 120 minutos (usando $gt)
export const getPeliculasLargas = async (req, res) => {
  try {
    const peliculas = await Content.find({
      tipo: "pelicula",
      duracion: { $gt: 120 }
    }).sort({ duracion: -1 });
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuarios que han visto más de 5 contenidos (usando $gt)
export const getUsuariosConMuchoHistorial = async (req, res) => {
  try {
    const usuarios = await User.find({
      "historial.5": { $exists: true } // Más de 5 elementos en el historial
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar contenidos por género usando $in
export const getContenidosPorGenero = async (req, res) => {
  try {
    const { generos } = req.query;
    const generoArray = generos ? generos.split(",") : ["Drama", "Acción"];
    const contenidos = await Content.find({
      genero: { $in: generoArray }
    });
    res.json(contenidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar contenidos usando $and y $or
export const getContenidosAvanzados = async (req, res) => {
  try {
    // $and: películas de acción con duración >= 120
    // $or: series de drama O contenidos con calificación > 4.5
    const contenidos = await Content.find({
      $or: [
        { tipo: "serie", genero: "Drama" },
        { calificacionPromedio: { $gt: 4.5 } }
      ]
    }).sort({ calificacionPromedio: -1 });
    res.json(contenidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Búsqueda por título usando $regex (búsqueda parcial, case-insensitive)
export const buscarContenidosPorTitulo = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Se requiere parámetro 'query'" });
    }
    const contenidos = await Content.find({
      titulo: { $regex: query, $options: "i" }
    });
    res.json(contenidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contenidos por año específico usando $eq
export const getContenidosPorAño = async (req, res) => {
  try {
    const { año } = req.params;
    const contenidos = await Content.find({
      añoLanzamiento: { $eq: parseInt(año) }
    });
    res.json(contenidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contenidos con duración menor a un valor usando $lt
export const getPeliculasCortas = async (req, res) => {
  try {
    const { maxDuracion } = req.query;
    const peliculas = await Content.find({
      tipo: "pelicula",
      duracion: { $lt: parseInt(maxDuracion) || 100 }
    }).sort({ duracion: 1 });
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Usuarios por plan específico usando $eq
export const getUsuariosPorPlan = async (req, res) => {
  try {
    const { plan } = req.params;
    const usuarios = await User.find({
      plan: { $eq: plan }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// TASK 4: Actualizaciones y Eliminaciones
// ============================================

// Actualizar un contenido con updateOne
export const updateContenido = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const contenidoActualizado = await Content.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!contenidoActualizado) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }
    res.json(contenidoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar múltiples contenidos con updateMany (cambiar disponibilidad)
export const updateMultipleContenidos = async (req, res) => {
  try {
    const { genero, disponible } = req.body;
    const resultado = await Content.updateMany(
      { genero: { $in: [genero] } },
      { $set: { disponible: disponible } }
    );
    res.json({
      mensaje: `${resultado.modifiedCount} contenidos actualizados`,
      matchedCount: resultado.matchedCount,
      modifiedCount: resultado.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar calificación de un contenido (promedio de ratings)
export const actualizarCalificacionPromedio = async (req, res) => {
  try {
    const { id } = req.params;
    const ratings = await Rating.find({ contenidoId: id });
    
    let promedio = 0;
    if (ratings.length > 0) {
      promedio = ratings.reduce((sum, r) => sum + r.calificacion, 0) / ratings.length;
    }
    
    const contenidoActualizado = await Content.findByIdAndUpdate(
      id,
      { $set: { calificacionPromedio: promedio } },
      { new: true }
    );
    
    res.json({
      mensaje: "Calificación promedio actualizada",
      contenido: contenidoActualizado,
      ratingsCount: ratings.length,
      promedio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un contenido con deleteOne
export const deleteContenido = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Content.findByIdAndDelete(id);
    if (!resultado) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }
    // También eliminar ratings asociados
    await Rating.deleteMany({ contenidoId: id });
    res.json({ mensaje: "Contenido eliminado correctamente", contenido: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar múltiples contenidos con deleteMany
export const deleteMultipleContenidos = async (req, res) => {
  try {
    const { tipo, añoMenorA } = req.body;
    let filtro = {};
    if (tipo) filtro.tipo = tipo;
    if (añoMenorA) filtro.añoLanzamiento = { $lt: añoMenorA };
    
    const resultado = await Content.deleteMany(filtro);
    res.json({
      mensaje: `${resultado.deletedCount} contenidos eliminados`,
      deletedCount: resultado.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// TASK 5: Índices
// ============================================

// Crear índices para mejorar rendimiento
export const createIndexes = async (req, res) => {
  try {
    const resultados = [];
    
    // Índice en título para búsquedas rápidas
    const idxTitulo = await Content.createIndex({ titulo: 1 });
    resultados.push({ indice: "titulo", resultado: idxTitulo });
    
    // Índice en género para filtrado por género
    const idxGenero = await Content.createIndex({ genero: 1 });
    resultados.push({ indice: "genero", resultado: idxGenero });
    
    // Índice compuesto en tipo y año
    const idxTipoAño = await Content.createIndex({ tipo: 1, añoLanzamiento: -1 });
    resultados.push({ indice: "tipo_año", resultado: idxTipoAño });
    
    // Índice en calificación promedio para ordenamiento
    const idxCalificacion = await Content.createIndex({ calificacionPromedio: -1 });
    resultados.push({ indice: "calificacionPromedio", resultado: idxCalificacion });
    
    // Índice en email de usuario
    const idxEmail = await User.createIndex({ email: 1 }, { unique: true });
    resultados.push({ indice: "email", resultado: idxEmail });
    
    // Índice en plan de usuario
    const idxPlan = await User.createIndex({ plan: 1 });
    resultados.push({ indice: "plan", resultado: idxPlan });
    
    // Índice compuesto en Rating
    const idxRating = await Rating.createIndex({ contenidoId: 1, usuarioId: 1 });
    resultados.push({ indice: "rating_contenido_usuario", resultado: idxRating });
    
    res.json({
      mensaje: "Índices creados exitosamente",
      indices: resultados
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener índices existentes con getIndexes
export const getIndexes = async (req, res) => {
  try {
    const { coleccion } = req.query;
    let indexes = [];
    
    if (!coleccion || coleccion === "content") {
      const contentIndexes = await Content.collection.getIndexes();
      indexes.push({ coleccion: "content", indices: contentIndexes });
    }
    
    if (!coleccion || coleccion === "user") {
      const userIndexes = await User.collection.getIndexes();
      indexes.push({ coleccion: "user", indices: userIndexes });
    }
    
    if (!coleccion || coleccion === "rating") {
      const ratingIndexes = await Rating.collection.getIndexes();
      indexes.push({ coleccion: "rating", indices: ratingIndexes });
    }
    
    res.json(indexes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// TASK: Agregaciones (≥2 pipelines)
// ============================================

// Aggregation Pipeline 1: Obtener estadísticas de contenidos por género
export const getEstadisticasPorGenero = async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$genero" },
      { $group: {
        _id: "$genero",
        cantidad: { $sum: 1 },
        duracionPromedio: { $avg: "$duracion" },
        calificacionPromedio: { $avg: "$calificacionPromedio" },
        añoMin: { $min: "$añoLanzamiento" },
        añoMax: { $max: "$añoLanzamiento" }
      }},
      { $sort: { cantidad: -1 } },
      { $project: {
        _id: 0,
        genero: "$_id",
        cantidad: 1,
        duracionPromedio: { $round: ["$duracionPromedio", 2] },
        calificacionPromedio: { $round: ["$calificacionPromedio", 2] },
        añoMin: 1,
        añoMax: 1
      }}
    ];
    
    const resultados = await Content.aggregate(pipeline);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aggregation Pipeline 2: Top contenidos mejor valorados con información de ratings
export const getTopContenidosValorados = async (req, res) => {
  try {
    const pipeline = [
      { $match: { tipo: "pelicula" } },
      { $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "contenidoId",
        as: "ratings"
      }},
      { $addFields: {
        cantidadRatings: { $size: "$ratings" }
      }},
      { $match: { cantidadRatings: { $gt: 0 } } },
      { $sort: { calificacionPromedio: -1, cantidadRatings: -1 } },
      { $limit: 10 },
      { $project: {
        titulo: 1,
        tipo: 1,
        genero: 1,
        añoLanzamiento: 1,
        calificacionPromedio: 1,
        cantidadRatings: 1,
        duracion: 1,
        descripcion: { $substr: ["$descripcion", 0, 50] }
      }}
    ];
    
    const resultados = await Content.aggregate(pipeline);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aggregation Pipeline 3: Usuarios con más actividad (historial)
export const getUsuariosMasActivos = async (req, res) => {
  try {
    const pipeline = [
      { $addFields: {
        historialCount: { $size: "$historial" }
      }},
      { $match: { historialCount: { $gt: 0 } } },
      { $sort: { historialCount: -1 } },
      { $project: {
        nombre: 1,
        email: 1,
        plan: 1,
        pais: 1,
        historialCount: 1,
        cantidadListas: { $size: "$listas" }
      }},
      { $limit: 10 }
    ];
    
    const resultados = await User.aggregate(pipeline);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aggregation Pipeline 4: Promedio de calificaciones por contenido (reporte de ratings)
export const getReporteRatings = async (req, res) => {
  try {
    const pipeline = [
      { $group: {
        _id: "$contenidoId",
        cantidadRatings: { $sum: 1 },
        promedioCalificacion: { $avg: "$calificacion" },
        maxCalificacion: { $max: "$calificacion" },
        minCalificacion: { $min: "$calificacion" }
      }},
      { $lookup: {
        from: "contents",
        localField: "_id",
        foreignField: "_id",
        as: "contenido"
      }},
      { $unwind: "$contenido" },
      { $sort: { cantidadRatings: -1 } },
      { $project: {
        _id: 0,
        contenidoId: "$_id",
        titulo: "$contenido.titulo",
        tipo: "$contenido.tipo",
        cantidadRatings: 1,
        promedioCalificacion: { $round: ["$promedioCalificacion", 2] },
        maxCalificacion: 1,
        minCalificacion: 1
      }}
    ];
    
    const resultados = await Rating.aggregate(pipeline);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aggregation Pipeline 5: Contenidos lanzados por década
export const getContenidosPorDecada = async (req, res) => {
  try {
    const pipeline = [
      { $addFields: {
        decada: {
          $subtract: [
            "$añoLanzamiento",
            { $mod: ["$añoLanzamiento", 10] }
          ]
        }
      }},
      { $group: {
        _id: "$decada",
        cantidad: { $sum: 1 },
        tipos: { $addToSet: "$tipo" },
        promedioCalificacion: { $avg: "$calificacionPromedio" }
      }},
      { $sort: { _id: 1 } },
      { $project: {
        _id: 0,
        decada: "$_id",
        cantidad: 1,
        tipos: 1,
        promedioCalificacion: { $round: ["$promedioCalificacion", 2] }
      }}
    ];
    
    const resultados = await Content.aggregate(pipeline);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

