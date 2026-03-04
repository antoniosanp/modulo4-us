// ============================================
// DB.JS - Módulo de conexión a MongoDB
// ============================================
// Este archivo:
// 1. Importa mongoose, el ODM para MongoDB
// 2. Define una función asíncrona de conexión
// 3. Maneja errores de conexión (críticos)
// 4. Usa variables de entorno para la URL de MongoDB
// 
// Por qué es importante:
// - Si no hay conexión a la DB, la app no puede funcionar
// - process.exit(1) asegura que la app no inicie sin DB
// - El try-catch captura errores de red o credenciales
// ============================================

import mongoose from "mongoose";

// Función de conexión asíncrona a MongoDB
// Se usa await en server.js antes de iniciar el servidor
export const connectDB = async () => {
  try {
    // mongoose.connect() establece la conexión
    // process.env.MONGO_URL viene del archivo .env
    // Formato: mongodb://usuario:password@host:puerto/database
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log("MongoDB conectado"); // Éxito
  } catch (error) {
    // Si hay error de conexión:
    // - Mostrar el error en consola
    // - Terminar el proceso con código de error 1
    // Esto evita que la app funcione sin base de datos
    console.error("Error conectando Mongo:", error);
    process.exit(1);
  }
};
