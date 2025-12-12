// backend/src/config/database.ts
// Configuración de conexión a MongoDB

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/choco-biogeografico'

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Conectado a MongoDB:', MONGODB_URI.replace(/\/\/.*@/, '//***@'))
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    throw error
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect()
    console.log('✅ Desconectado de MongoDB')
  } catch (error) {
    console.error('❌ Error desconectando de MongoDB:', error)
    throw error
  }
}






