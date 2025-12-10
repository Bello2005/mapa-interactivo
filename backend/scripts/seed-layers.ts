// backend/scripts/seed-layers.ts
// Script para poblar MongoDB con metadata de capas

import dotenv from 'dotenv'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import { Layer } from '../src/models/Layer.js'
// Importar configuración de capas del frontend
// Nota: En producción, esto debería venir de una fuente compartida o API
const thematicLayers = [
  {
    id: 'paramos',
    name: 'Páramos',
    description: 'Ecosistemas de alta montaña únicos de los Andes',
    category: 'ecosistemas' as const,
    source: 'geojson' as const,
    storageType: 'filesystem' as const,
    geojsonPath: '/data/paramos.geojson',
    color: '#8B7355',
    opacity: 0.6,
    visible: false,
    order: 1,
    enabled: true,
    metadata: { source: 'MADS 2012', year: 2012, resolution: '100k' }
  },
  {
    id: 'ecosistemas',
    name: 'Ecosistemas',
    description: 'Clasificación de ecosistemas según IDEAM',
    category: 'ecosistemas' as const,
    source: 'geojson' as const,
    storageType: 'gridfs' as const,
    geojsonPath: '/data/ecosistemas.geojson',
    color: '#228B22',
    opacity: 0.5,
    visible: false,
    order: 2,
    enabled: true,
    metadata: { source: 'IDEAM 2024', year: 2024, resolution: '100k' }
  },
  {
    id: 'manglares',
    name: 'Manglares',
    description: 'Ecosistemas de manglar en la costa del Pacífico',
    category: 'ecosistemas' as const,
    source: 'geojson' as const,
    storageType: 'gridfs' as const,
    geojsonPath: '/data/manglares.geojson',
    color: '#2F4F2F',
    opacity: 0.6,
    visible: false,
    order: 3,
    enabled: true,
    metadata: { source: 'INVEMAR SIGMA V8', year: 2022, resolution: '25k' }
  },
  {
    id: 'humedales',
    name: 'Humedales',
    description: 'Áreas de humedales del Chocó biogeográfico',
    category: 'ecosistemas' as const,
    source: 'geojson' as const,
    storageType: 'gridfs' as const,
    geojsonPath: '/data/humedales.geojson',
    color: '#4682B4',
    opacity: 0.5,
    visible: false,
    order: 4,
    enabled: true,
    metadata: { source: 'IvAH 2015', year: 2015, resolution: '100k' }
  },
  {
    id: 'bosque-seco',
    name: 'Bosque Seco Tropical',
    description: 'Ecosistemas de bosque seco tropical',
    category: 'ecosistemas' as const,
    source: 'geojson' as const,
    storageType: 'filesystem' as const,
    geojsonPath: '/data/bosque_seco_tropical.geojson',
    color: '#CD853F',
    opacity: 0.6,
    visible: false,
    order: 5,
    enabled: true,
    metadata: { source: 'IvAH 2014', year: 2014, resolution: '100k' }
  },
  {
    id: 'cienagas',
    name: 'Ciénagas',
    description: 'Ciénagas del Chocó biogeográfico',
    category: 'ecosistemas' as const,
    source: 'geojson' as const,
    storageType: 'gridfs' as const,
    geojsonPath: '/data/cienagas.geojson',
    color: '#5F9EA0',
    opacity: 0.5,
    visible: false,
    order: 6,
    enabled: true,
    metadata: { source: 'CTM12 ChBio 2019', year: 2019, resolution: '100k' }
  },
  {
    id: 'comunidades-negras',
    name: 'Comunidades Negras',
    description: 'Territorios colectivos de comunidades afrocolombianas',
    category: 'social' as const,
    source: 'geojson' as const,
    storageType: 'gridfs' as const,
    geojsonPath: '/data/comunidades_negras.geojson',
    color: '#8B4513',
    opacity: 0.5,
    visible: false,
    order: 10,
    enabled: true,
    metadata: { source: 'ANT 2025', year: 2025, resolution: '100k' }
  },
  {
    id: 'resguardos-indigenas',
    name: 'Resguardos Indígenas',
    description: 'Territorios indígenas del Chocó biogeográfico',
    category: 'social' as const,
    source: 'geojson' as const,
    storageType: 'filesystem' as const,
    geojsonPath: '/data/resguardos_indigenas.geojson',
    color: '#A0522D',
    opacity: 0.5,
    visible: false,
    order: 11,
    enabled: true,
    metadata: { source: 'ANT 2025', year: 2025, resolution: '100k' }
  },
  {
    id: 'cuencas',
    name: 'Cuencas Hidrográficas',
    description: 'Cuencas hidrográficas del Chocó',
    category: 'hidrografia' as const,
    source: 'geoserver' as const,
    storageType: 'geoserver' as const,
    geoserverLayer: 'IIAP:Cuenca_Hidrograficas',
    color: '#4169E1',
    opacity: 0.4,
    visible: false,
    order: 20,
    enabled: true,
    metadata: { source: 'IIAP GeoServer', resolution: '100k' }
  },
  {
    id: 'drenaje',
    name: 'Drenaje',
    description: 'Sistema de drenaje doble',
    category: 'hidrografia' as const,
    source: 'geojson' as const,
    storageType: 'gridfs' as const,
    geojsonPath: '/data/drenaje_doble.geojson',
    color: '#1E90FF',
    opacity: 0.4,
    visible: false,
    order: 21,
    enabled: true,
    metadata: { source: 'CTM12 ChBio 2019', year: 2019, resolution: '100k' }
  },
  {
    id: 'runap',
    name: 'Parques Nacionales (RUNAP)',
    description: 'Áreas protegidas del Sistema de Parques Nacionales',
    category: 'conservacion' as const,
    source: 'geojson' as const,
    storageType: 'filesystem' as const,
    geojsonPath: '/data/runap.geojson',
    color: '#32CD32',
    opacity: 0.5,
    visible: false,
    order: 30,
    enabled: true,
    metadata: { source: 'SPNN Jul 2025', year: 2025, resolution: '100k' }
  },
  {
    id: 'bioregion',
    name: 'Chocó Biogeográfico',
    description: 'Límite del Chocó biogeográfico',
    category: 'fisico' as const,
    source: 'geojson' as const,
    storageType: 'filesystem' as const,
    geojsonPath: '/data/bioregion.geojson',
    color: '#228B22',
    opacity: 0.3,
    visible: false,
    order: 40,
    enabled: true,
    metadata: { source: 'WWF TEOW 2017', year: 2017, resolution: '100k' }
  },
  {
    id: 'admin-boundaries',
    name: 'Límites Administrativos',
    description: 'Límites municipales del Chocó',
    category: 'fisico' as const,
    source: 'geojson' as const,
    storageType: 'filesystem' as const,
    geojsonPath: '/data/boundaries_admin.geojson',
    color: '#696969',
    opacity: 0.6,
    visible: true,
    order: 41,
    enabled: true,
    metadata: { source: 'IGAC 2019', year: 2019, resolution: '100k' }
  }
]

dotenv.config()

async function seedLayers() {
  try {
    console.log('🚀 Iniciando seed de capas...')

    await connectDatabase()

    // Limpiar capas existentes (opcional)
    const shouldClear = process.argv.includes('--force')
    if (shouldClear) {
      console.log('🗑️  Limpiando capas existentes...')
      await Layer.deleteMany({})
    }

    // Insertar capas desde configuración
    let inserted = 0
    let updated = 0

    for (const layerConfig of thematicLayers) {
      const existing = await Layer.findOne({ id: layerConfig.id })

      if (existing) {
        // Actualizar capa existente
        await Layer.updateOne(
          { id: layerConfig.id },
          {
            $set: {
              name: layerConfig.name,
              description: layerConfig.description,
              category: layerConfig.category,
              source: layerConfig.source,
              storageType: layerConfig.storageType || 'filesystem',
              geojsonPath: layerConfig.geojsonPath,
              geoserverLayer: layerConfig.geoserverLayer,
              color: layerConfig.color,
              opacity: layerConfig.opacity,
              order: layerConfig.order,
              enabled: layerConfig.enabled !== false,
              metadata: layerConfig.metadata,
            },
          }
        )
        updated++
      } else {
        // Crear nueva capa
        await Layer.create({
          id: layerConfig.id,
          name: layerConfig.name,
          description: layerConfig.description,
          category: layerConfig.category,
          source: layerConfig.source,
          storageType: layerConfig.storageType || 'filesystem',
          geojsonPath: layerConfig.geojsonPath,
          geoserverLayer: layerConfig.geoserverLayer,
          color: layerConfig.color,
          opacity: layerConfig.opacity,
          order: layerConfig.order,
          enabled: layerConfig.enabled !== false,
          metadata: layerConfig.metadata,
        })
        inserted++
      }
    }

    console.log(`✅ Seed completado:`)
    console.log(`   📦 ${inserted} capas insertadas`)
    console.log(`   🔄 ${updated} capas actualizadas`)
    console.log(`   📊 Total: ${inserted + updated} capas`)

    await disconnectDatabase()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error en seed:', error)
    await disconnectDatabase()
    process.exit(1)
  }
}

seedLayers()

