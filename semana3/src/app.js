// ============================================
// APP.JS - Configuración de Express
// ============================================
// Este archivo configura el servidor Express.
//
// Conceptos clave:
// - Middlewares: Funciones que se ejecutan antes de las rutas
// - express.json(): Parsea el cuerpo de peticiones JSON
// - cors(): Permite solicitudes de diferentes orígenes
// - Router: Organiza las rutas en módulos
// ============================================

import express from "express"
import cors from "cors"
import contentRoutes from "./routes/contentRoutes.js"


// Crea la aplicación Express
const app = express()


// ============================================
// MIDDLEWARES
// ============================================

// cors(): Middleware de CORS (Cross-Origin Resource Sharing)
// Permite que el frontend (en diferente dominio/puerto) acceda a la API
// Sin esto, navegadores bloquean solicitudes cross-origin
app.use(cors())

// express.json(): Middleware para parsear JSON
// Convierte el cuerpo de peticiones POST/PUT de JSON a objeto JavaScript
// Sin esto, req.body sería undefined
app.use(express.json())

// ============================================
// RUTAS
// ============================================

// Todas las rutas de la API estarán bajo el prefijo "/api"
// Las rutas específicas están definidas en contentRoutes.js
app.use("/api", contentRoutes)

// Exporta la app para usar en server.js
export default app
