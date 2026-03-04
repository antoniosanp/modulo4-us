// ============================================
// CONTENT.JS - Modelo de Contenidos (Películas y Series)
// ============================================
// Este esquema define la estructura de documentos para películas y series
// en la colección "contents" de MongoDB.
//
// Conceptos clave:
// - Mongoose Schema: Define la estructura de los documentos
// - Embebido: Los episodios están dentro del documento de la serie
// - Enum: Restringe valores posibles para ciertos campos
// - Timestamps: Automáticamente añade createdAt y updatedAt
// ============================================

import mongoose from "mongoose";

// Esquema para episodios (solo aplica a series)
// Se embebe directamente en el documento de la serie
// No tiene su propia colección porque no tiene sentido sin la serie
const episodiosSchema = new mongoose.Schema({
  numero: Number,           // Número del episodio
  titulo: String,          // Título del episodio
  duracion: Number,         // Duración en minutos
  temporada: Number          // Temporada a la que pertenece
});

// Esquema principal para contenidos
const contenidoSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true          // Campo obligatorio
  },
  descripcion: String,      // Sinopsis del contenido
  
  tipo: { 
    type: String, 
    enum: ["pelicula", "serie"],  // Solo acepta estos dos valores
    required: true 
  },
  
  genero: [String],        // Array de géneros (ej: ["Acción", "Drama"])
  
  duracion: Number,        // Duración en minutos (0 para series)
  
  episodios: [episodiosSchema],  // Array de episodios embebidos
                              // Solo se usa cuando tipo = "serie"
                              // Embebido porque no tiene sentido sin la serie
  
  añoLanzamiento: Number,   // Año de lanzamiento
  
  director: String,        // Director del contenido
  
  actores: [String],       // Array de nombres de actores
  
  calificacionPromedio: { 
    type: Number, 
    default: 0            // Se calcula desde la colección ratings
  },
  
  fechaEstreno: Date,      // Fecha de estreno
  
  imagenUrl: String,       // URL de la imagen/poster
  
  disponible: { 
    type: Boolean, 
    default: true         // Para controlar disponibilidad
  }
}, { 
  timestamps: true         // Automático: createdAt, updatedAt
});

// Exporta el modelo "Content" basado en el esquema
// Se creará una colección llamada "contents" en MongoDB
export default mongoose.model("Content", contenidoSchema);

