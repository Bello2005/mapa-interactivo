#!/usr/bin/env node
// Recorta la precisión de las coordenadas de los GeoJSON de public/data.
//
// Las fuentes oficiales traen 14-16 decimales (precisión de nanómetro) en un
// mapa donde un píxel son ~100 m. 6 decimales son ~11 cm, de sobra para uso
// web, y recortan ~70% de lo que viaja por la red una vez comprimido.
//
// Solo toca geometry.coordinates: las properties se dejan intactas para no
// alterar áreas, códigos ni cifras oficiales.
//
//   node scripts/trim-geojson-precision.mjs [--check] [--decimals=6]
//
//   --check   no escribe nada, solo informa de lo que cambiaría
//
// Requiere heap grande para los archivos de ~100 MB:
//   node --max-old-space-size=6144 scripts/trim-geojson-precision.mjs

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DATA_DIR = 'public/data'

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const DECIMALS = Number(args.find((a) => a.startsWith('--decimals='))?.split('=')[1] ?? 6)

if (!Number.isInteger(DECIMALS) || DECIMALS < 0 || DECIMALS > 15) {
  console.error(`--decimals debe ser un entero entre 0 y 15 (recibido: ${DECIMALS})`)
  process.exit(1)
}

const mb = (n) => (n / 1048576).toFixed(1).padStart(7) + ' MB'

/**
 * Redondea in situ los arrays de coordenadas. Las coordenadas de GeoJSON son
 * arrays anidados a profundidad variable (Point, LineString, Polygon,
 * MultiPolygon...), así que se recorre en profundidad hasta topar con números.
 * Devuelve cuántos números se han tocado.
 */
function roundCoords(node) {
  if (!Array.isArray(node)) return 0
  let touched = 0
  for (let i = 0; i < node.length; i++) {
    const v = node[i]
    if (typeof v === 'number') {
      const r = Number(v.toFixed(DECIMALS))
      if (r !== v) touched++
      node[i] = r
    } else {
      touched += roundCoords(v)
    }
  }
  return touched
}

/** Recorre cualquier objeto GeoJSON y aplica roundCoords a cada geometría. */
function processGeoJSON(node) {
  let touched = 0
  if (Array.isArray(node)) {
    for (const item of node) touched += processGeoJSON(item)
    return touched
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      // GeometryCollection anida geometries; Feature anida geometry.
      if (key === 'coordinates') touched += roundCoords(value)
      else if (key !== 'properties') touched += processGeoJSON(value)
    }
  }
  return touched
}

/** Cuenta features para poder verificar que no se pierde nada. */
function countFeatures(node) {
  if (node?.type === 'FeatureCollection') return node.features?.length ?? 0
  if (node?.type === 'Feature') return 1
  return 0
}

const files = readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.geojson'))
  .sort()

let totalBefore = 0
let totalAfter = 0
let failures = 0

console.log(`${CHECK_ONLY ? 'COMPROBANDO' : 'RECORTANDO'} a ${DECIMALS} decimales\n`)
console.log(
  'archivo'.padEnd(40) + 'antes'.padStart(10) + 'después'.padStart(11) + '  features'
)
console.log('-'.repeat(75))

for (const file of files) {
  const path = join(DATA_DIR, file)
  const sizeBefore = statSync(path).size

  if (sizeBefore === 0) {
    console.log(file.padEnd(40) + mb(0).padStart(10) + '  (vacío, se omite)')
    continue
  }

  const raw = readFileSync(path, 'utf8')

  let data
  try {
    data = JSON.parse(raw)
  } catch (err) {
    console.log(`${file.padEnd(40)}  ERROR: JSON inválido (${err.message})`)
    failures++
    continue
  }

  const featuresBefore = countFeatures(data)
  processGeoJSON(data)

  const out = JSON.stringify(data)

  // Verificación: el resultado debe seguir siendo válido y conservar features.
  let featuresAfter
  try {
    featuresAfter = countFeatures(JSON.parse(out))
  } catch (err) {
    console.log(`${file.padEnd(40)}  ERROR: la salida no es JSON válido`)
    failures++
    continue
  }

  if (featuresAfter !== featuresBefore) {
    console.log(
      `${file.padEnd(40)}  ERROR: features ${featuresBefore} -> ${featuresAfter}`
    )
    failures++
    continue
  }

  if (!CHECK_ONLY) writeFileSync(path, out)

  const sizeAfter = Buffer.byteLength(out)
  totalBefore += sizeBefore
  totalAfter += sizeAfter

  console.log(
    file.padEnd(40) +
      mb(sizeBefore).padStart(10) +
      mb(sizeAfter).padStart(11) +
      `  ${featuresBefore}`
  )
}

console.log('-'.repeat(75))
console.log(
  'TOTAL'.padEnd(40) + mb(totalBefore).padStart(10) + mb(totalAfter).padStart(11)
)

if (totalBefore > 0) {
  const pct = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  console.log(`\nReducción en disco: ${pct}%`)
}

if (failures > 0) {
  console.error(`\n${failures} archivo(s) con errores: no se ha escrito nada de esos.`)
  process.exit(1)
}

if (CHECK_ONLY) console.log('\n(--check: no se ha escrito ningún archivo)')
