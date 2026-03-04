// ============================================
// RATING.JS - Modelo de Valoraciones/Reseñas
// ============================================
// Este esquema define las calificaciones que los usuarios dan a los contenidos.
//
// Conceptos clave:
// - Referencias: usuarioId y contenidoId referencian otras colecciones
// - Índice único compuesto: Evita que un usuario califique 2 veces el mismo contenido
// - Validación: min/max para la calificación
// - Embedding vs Referencia: Usamos referencia porque un contenido puede tener miles de ratings
// ============================================

import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  // Referencia al usuario que hace la calificación
  // ObjectId que referencia al modelo "User"
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Referencia al contenido que se está calificando
  // ObjectId que referencia al modelo "Content"
  contenidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true
  },
  
  // Calificación de 1 a 5 estrellas
  // Validación: mínimo 1, máximo 5
  calificacion: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  
  // Comentario opcional de la reseña
  comentario: String,
  
  // Fecha de la calificación
  // Default: fecha actual al momento de creación
  fechaRating: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// ============================================
// ÍNDICE ÚNICO COMPUESTO
// ============================================
// Esta línea es CRÍTICA: evita que un usuario califique el mismo contenido dos veces
// MongoDB no permitirá insertar si ya existe un documento con el mismo usuarioId Y contenidoId
ratingSchema.index({ usuarioId: 1, contenidoId: 1 }, { unique: true });

// Exporta el modelo "Rating"
export default mongoose.model("Rating", ratingSchema);

