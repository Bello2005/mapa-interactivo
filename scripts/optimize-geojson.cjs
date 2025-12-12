#!/usr/bin/env node
// scripts/optimize-geojson.js
// Script para optimizar GeoJSON grandes (simplificar geometrías, comprimir, validar)

const fs = require('fs')
const path = require('path')

// Usar turf.js si está disponible, sino usar simplificación básica
let turf = null
try {
  turf = require('@turf/turf')
} catch (e) {
  console.warn('⚠️  @turf/turf no disponible, usando simplificación básica')
}

const DATA_DIR = path.join(__dirname, '../public/data')
const SIZE_THRESHOLD = 50 * 1024 * 1024 // 50MB

/**
 * Simplificar geometría usando turf.js
 */
function simplifyGeometry(feature, tolerance = 0.0001) {
  if (!turf) {
    return feature // Sin turf, retornar sin cambios
  }

  try {
    const geometry = feature.geometry
    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      const simplified = turf.simplify(turf.feature(geometry), {
        tolerance,
        highQuality: false,
      })
      return {
        ...feature,
        geometry: simplified.geometry,
      }
    }
  } catch (error) {
    console.warn(`⚠️  Error simplificando feature ${feature.id || 'unknown'}:`, error.message)
  }

  return feature
}

/**
 * Optimizar GeoJSON
 */
function optimizeGeoJSON(inputPath, outputPath, options = {}) {
  const { tolerance = 0.0001, minArea = 0 } = options

  console.log(`\n📄 Procesando: ${path.basename(inputPath)}`)

  // Leer archivo
  const content = fs.readFileSync(inputPath, 'utf-8')
  const geojson = JSON.parse(content)
  const originalSize = Buffer.byteLength(content, 'utf-8')

  console.log(`   Tamaño original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`   Features: ${geojson.features?.length || 0}`)

  // Optimizar solo si es grande
  if (originalSize < SIZE_THRESHOLD) {
    console.log(`   ✅ Archivo pequeño, no requiere optimización`)
    if (outputPath !== inputPath) {
      fs.writeFileSync(outputPath, content)
    }
    return { originalSize, optimizedSize: originalSize, features: geojson.features?.length || 0 }
  }

  // Simplificar features
  let optimizedFeatures = geojson.features || []
  let removedCount = 0

  if (tolerance > 0) {
    console.log(`   🔧 Simplificando geometrías (tolerancia: ${tolerance})...`)
    optimizedFeatures = optimizedFeatures
      .map((feature) => {
        // Filtrar features muy pequeños si se especifica
        if (minArea > 0 && feature.properties) {
          const area = feature.properties.area_km2 || feature.properties.AREA || 0
          if (area < minArea) {
            removedCount++
            return null
          }
        }
        return simplifyGeometry(feature, tolerance)
      })
      .filter(Boolean)
  }

  // Crear GeoJSON optimizado
  const optimized = {
    ...geojson,
    features: optimizedFeatures,
  }

  // Escribir archivo optimizado
  const optimizedContent = JSON.stringify(optimized)
  const optimizedSize = Buffer.byteLength(optimizedContent, 'utf-8')

  fs.writeFileSync(outputPath, optimizedContent)

  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1)

  console.log(`   ✅ Optimización completada:`)
  console.log(`      Tamaño optimizado: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`      Reducción: ${reduction}%`)
  console.log(`      Features: ${optimizedFeatures.length} (${removedCount} removidos)`)

  return {
    originalSize,
    optimizedSize,
    features: optimizedFeatures.length,
    removedCount,
    reduction: parseFloat(reduction),
  }
}

/**
 * Validar GeoJSON
 */
function validateGeoJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const geojson = JSON.parse(content)

    if (geojson.type !== 'FeatureCollection') {
      throw new Error('Tipo inválido: debe ser FeatureCollection')
    }

    if (!Array.isArray(geojson.features)) {
      throw new Error('Features debe ser un array')
    }

    console.log(`   ✅ GeoJSON válido`)
    return true
  } catch (error) {
    console.error(`   ❌ GeoJSON inválido:`, error.message)
    return false
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2)
  const inputFile = args[0]
  const outputFile = args[1] || inputFile
  const tolerance = parseFloat(args[2]) || 0.0001

  if (!inputFile) {
    console.log('Uso: node optimize-geojson.js <input.geojson> [output.geojson] [tolerance]')
    console.log('Ejemplo: node optimize-geojson.js ecosistemas.geojson ecosistemas_optimized.geojson 0.001')
    process.exit(1)
  }

  const inputPath = path.isAbsolute(inputFile)
    ? inputFile
    : path.join(DATA_DIR, inputFile)

  const outputPath = path.isAbsolute(outputFile)
    ? outputFile
    : path.join(DATA_DIR, outputFile)

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Archivo no encontrado: ${inputPath}`)
    process.exit(1)
  }

  console.log('🚀 Iniciando optimización de GeoJSON...\n')

  // Validar antes
  if (!validateGeoJSON(inputPath)) {
    process.exit(1)
  }

  // Optimizar
  const result = optimizeGeoJSON(inputPath, outputPath, { tolerance })

  // Validar después
  if (outputPath !== inputPath) {
    validateGeoJSON(outputPath)
  }

  console.log(`\n✅ Proceso completado`)
}

module.exports = { optimizeGeoJSON, validateGeoJSON }





