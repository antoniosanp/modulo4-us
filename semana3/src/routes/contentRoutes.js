// ============================================
// CONTENTROUTES.JS - Definición de rutas de la API
// ============================================
// Este archivo define todas las rutas/endpoints de la API.
//
// Conceptos clave:
// - Router de Express: Organiza rutas en módulos
// - Patrón REST: GET=leer, POST=crear, PUT=actualizar, DELETE=eliminar
// - Parámetros: :id = parámetro dinámico en la URL
// - Query strings: ?parametro=valor = parámetros opcionales
// ============================================

import express from "express";
import {
  // TASK 3: Consultas con operadores
  getPeliculasLargas,
  getUsuariosConMuchoHistorial,
  getContenidosPorGenero,
  getContenidosAvanzados,
  buscarContenidosPorTitulo,
  getContenidosPorAño,
  getPeliculasCortas,
  getUsuariosPorPlan,
  
  // TASK 4: Actualizaciones y eliminaciones
  updateContenido,
  updateMultipleContenidos,
  actualizarCalificacionPromedio,
  deleteContenido,
  deleteMultipleContenidos,
  
  // TASK 5: Índices
  createIndexes,
  getIndexes,
  
  // Agregaciones
  getEstadisticasPorGenero,
  getTopContenidosValorados,
  getUsuariosMasActivos,
  getReporteRatings,
  getContenidosPorDecada
} from "../controller/contentController.js";

// Crea el router
const router = express.Router();

// ============================================
// TASK 3: RUTAS DE CONSULTAS CON OPERADORES
// ============================================

// GET /api/consultas/peliculas-largas
// Operador $gt: Películas con duración > 120 minutos
router.get("/consultas/peliculas-largas", getPeliculasLargas);

// GET /api/consultas/usuarios-mucho-historial
// Operador $gt + $exists: Usuarios con más de 5 contenidos en historial
router.get("/consultas/usuarios-mucho-historial", getUsuariosConMuchoHistorial);

// GET /api/consultas/por-genero?generos=Drama,Acción
// Operador $in: Contenidos que tengan alguno de los géneros especificados
router.get("/consultas/por-genero", getContenidosPorGenero);

// GET /api/consultas/avanzados
// Operador $or: Series de drama O contenidos con calificación > 4.5
router.get("/consultas/avanzados", getContenidosAvanzados);

// GET /api/consultas/buscar?query=lord
// Operador $regex: Búsqueda parcial por título (case-insensitive)
router.get("/consultas/buscar", buscarContenidosPorTitulo);

// GET /api/consultas/por-año/2019
// Operador $eq: Contenidos lanzados en un año específico
router.get("/consultas/por-año/:año", getContenidosPorAño);

// GET /api/consultas/peliculas-cortas?maxDuracion=100
// Operador $lt: Películas con duración menor a X minutos
router.get("/consultas/peliculas-cortas", getPeliculasCortas);

// GET /api/consultas/usuarios-por-plan/premium
// Operador $eq: Usuarios con un plan específico
router.get("/consultas/usuarios-por-plan/:plan", getUsuariosPorPlan);

// ============================================
// TASK 4: RUTAS DE ACTUALIZACIONES Y ELIMINACIONES
// ============================================

// PUT /api/contenidos/:id
// updateOne: Actualiza un contenido específico por su ID
router.put("/contenidos/:id", updateContenido);

// PUT /api/contenidos/update-many
// updateMany: Actualiza múltiples contenidos según filtro
router.put("/contenidos/update-many", updateMultipleContenidos);

// PUT /api/contenidos/:id/actualizar-calificacion
// Actualiza la calificación promedio de un contenido basándose en sus ratings
router.put("/contenidos/:id/actualizar-calificacion", actualizarCalificacionPromedio);

// DELETE /api/contenidos/:id
// deleteOne: Elimina un contenido específico por su ID
router.delete("/contenidos/:id", deleteContenido);

// DELETE /api/contenidos/delete-many
// deleteMany: Elimina múltiples contenidos según filtro
router.delete("/contenidos/delete-many", deleteMultipleContenidos);

// ============================================
// TASK 5: RUTAS DE ÍNDICES
// ============================================

// POST /api/indexes/create
// Crea índices para mejorar rendimiento de consultas
router.post("/indexes/create", createIndexes);

// GET /api/indexes
// getIndexes: Verifica los índices existentes en las colecciones
// Query opcional: ?coleccion=content|user|rating
router.get("/indexes", getIndexes);

// ============================================
// AGREGACIONES (PIPELINES)
// ============================================

// GET /api/agregaciones/estadisticas-genero
// Pipeline 1: Estadísticas (cantidad, promedio) por género
router.get("/agregaciones/estadisticas-genero", getEstadisticasPorGenero);

// GET /api/agregaciones/top-valorados
// Pipeline 2: Top 10 contenidos mejor valorados con ratings
router.get("/agregaciones/top-valorados", getTopContenidosValorados);

// GET /api/agregaciones/usuarios-activos
// Pipeline 3: Usuarios más activos (ordenados por historial)
router.get("/agregaciones/usuarios-activos", getUsuariosMasActivos);

// GET /api/agregaciones/reporte-ratings
// Pipeline 4: Reporte de calificaciones por contenido
router.get("/agregaciones/reporte-ratings", getReporteRatings);

// GET /api/agregaciones/por-decada
// Pipeline 5: Contenidosagrupados por década de lanzamiento
router.get("/agregaciones/por-decada", getContenidosPorDecada);

// Exporta el router para usar en app.js
export default router;

