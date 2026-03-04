// ============================================
// SERVER.JS - Punto de entrada de la aplicación
// ============================================
// Este archivo:
// 1. Importa la configuración de Express desde app.js
// 2. Importa la función de conexión a MongoDB desde db.js
// 3. Configura dotenv para leer variables de entorno del archivo .env
// 4. Conecta a MongoDB de forma asíncrona antes de iniciar el servidor
// 5. Inicia el servidor Express en el puerto 3000
// ============================================

import app from "./src/app.js"
import { connectDB } from "./src/config/db.js"
import { config } from "dotenv"

// Carga las variables de entorno desde .env
config()

// Conecta a MongoDB antes de iniciar el servidor
// Si la conexión falla, el servidor no arrancará
connectDB()

// Inicia el servidor en el puerto 3000
// Y muestra un mensaje en consola cuando esté listo
app.listen(3000, ()=>{console.log("conectado en puerto 3000")})
