// backend/scripts/import-geojson.ts
// Script para importar GeoJSON a MongoDB (documentos pequeños) o GridFS (archivos grandes)

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import { Layer } from '../src/models/Layer.js'
import { uploadToGridFS } from '../src/utils/gridfs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

// Ruta a los datos GeoJSON (desde el root del proyecto)
const DATA_DIR = path.resolve(path.join(__dirname, '../../public/data'))
const SIZE_THRESHOLD = 10 * 1024 * 1024 // 10MB

async function importGeoJSON() {
  try {
    console.log('🚀 Iniciando importación de GeoJSON...')

    await connectDatabase()

    // Obtener todas las capas que necesitan GeoJSON
    const layers = await Layer.find({
      source: 'geojson',
      $or: [
        { storageType: 'mongodb' },
        { storageType: 'gridfs' },
      ],
    })

    console.log(`📦 Encontradas ${layers.length} capas para importar`)

    for (const layer of layers) {
      if (!layer.geojsonPath) {
        console.log(`⚠️  Capa ${layer.id} no tiene geojsonPath, saltando...`)
        continue
      }

      const filePath = path.join(DATA_DIR, layer.geojsonPath.replace('/data/', ''))
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${filePath}, saltando...`)
        continue
      }

      const stats = fs.statSync(filePath)
      const fileSize = stats.size
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const geojson = JSON.parse(fileContent)
      const featureCount = geojson.features?.length || 0

      console.log(`\n📄 Procesando ${layer.name}:`)
      console.log(`   Tamaño: ${(fileSize / 1024 / 1024).toFixed(2)} MB`)
      console.log(`   Features: ${featureCount}`)

      if (fileSize < SIZE_THRESHOLD && layer.storageType === 'mongodb') {
        // Archivo pequeño: guardar en documento
        await Layer.updateOne(
          { id: layer.id },
          {
            $set: {
              geojsonData: geojson,
              fileSize,
              featureCount,
            },
            $unset: {
              gridfsFileId: '',
            },
          }
        )
        console.log(`   ✅ Guardado en MongoDB (documento)`)
      } else if (layer.storageType === 'gridfs') {
        // Archivo grande: guardar en GridFS
        const filename = `${layer.id}.geojson`
        const gridfsId = await uploadToGridFS(filePath, filename)

        await Layer.updateOne(
          { id: layer.id },
          {
            $set: {
              gridfsFileId: gridfsId,
              fileSize,
              featureCount,
            },
            $unset: {
              geojsonData: '',
            },
          }
        )
        console.log(`   ✅ Guardado en GridFS (ID: ${gridfsId})`)
      } else {
        console.log(`   ⚠️  Tipo de almacenamiento no soportado: ${layer.storageType}`)
      }
    }

    console.log(`\n✅ Importación completada`)

    await disconnectDatabase()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error en importación:', error)
    await disconnectDatabase()
    process.exit(1)
  }
}

importGeoJSON()

