// backend/src/server.ts
// Servidor Express principal

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database.js'
import layersRoutes from './routes/layers.js'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// Rutas
app.use('/api/layers', layersRoutes)

// Manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
  })
})

// Iniciar servidor
async function startServer() {
  try {
    // Conectar a MongoDB
    await connectDatabase()

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📡 API disponible en http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error)
    process.exit(1)
  }
}

startServer()

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...')
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...')
  process.exit(0)
})






