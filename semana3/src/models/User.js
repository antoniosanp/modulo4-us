// ============================================
// USER.JS - Modelo de Usuarios
// ============================================
// Este esquema define la estructura de los usuarios de la plataforma.
//
// Conceptos clave:
// - Sub-documentos embebidos: historial y listas
// - Embebido vs Referencia:
//   - Embebemos porque estos datos pertenecen exclusivamente al usuario
//   - Se consultan juntos (usuario + historial + listas)
//   - No tienen sentido independiente del usuario
// - Arrays de objetos: Permiten estructura flexible
// ============================================

import mongoose from "mongoose";

// ============================================
// HISTORIAL SCHEMA - Sub-documento embebido
// ============================================
// Representa lo que el usuario ha visto
// Se embebe porque es información privada del usuario
const historialSchema = new mongoose.Schema({
  // Referencia al contenido visto
  contenidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content"
  },
  // Fecha cuando el usuario vio el contenido
  fechaVisualizacion: Date,
  // Progreso de visualización (0-100%)
  progreso: Number
});

// ============================================
// LISTA SCHEMA - Sub-documento embebido
// ============================================
// Listas personalizadas del usuario (Favoritos, Ver después, etc.)
// Se embebe porque las listas son propiedad del usuario
const listaSchema = new mongoose.Schema({
  nombre: String,                    // Nombre de la lista
  contenidos: [{                     // Array de referencias a contenidos
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content"
  }]
});

// ============================================
// USER SCHEMA - Esquema principal
// ============================================
const userSchema = new mongoose.Schema({
  nombre: String,                    // Nombre del usuario
  email: { 
    type: String, 
    unique: true                    // No puede haber dos usuarios con el mismo email
  },
  edad: Number,                      // Edad del usuario
  pais: String,                      // País de residencia
  
  // Plan del usuario (free o premium)
  plan: { 
    type: String, 
    enum: ["free", "premium"]        // Solo estos dos valores válidos
  },
  
  // Array de documentos embebidos de historial
  // Un usuario puede tener muchos elementos en su historial
  historial: [historialSchema],
  
  // Array de documentos embebidos de listas
  // El usuario puede tener múltiples listas personalizadas
  listas: [listaSchema]
}, { 
  timestamps: true                    // createdAt, updatedAt automáticos
});

// Exporta el modelo "User"
export default mongoose.model("User", userSchema);
