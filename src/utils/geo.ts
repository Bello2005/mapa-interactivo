// src/utils/geo.ts
// Utilidades geoespaciales con Turf.js

import * as turf from '@turf/turf'
import type { GeoJSONFeatureCollection, SpeciesRange, GeoJSONFeature } from '../types'
import type { LatLngBoundsExpression } from 'leaflet'

// Tipos GeoJSON inline para evitar dependencia externa
type PolygonGeometry = { type: 'Polygon'; coordinates: [number, number][][] }
type MultiPolygonGeometry = { type: 'MultiPolygon'; coordinates: [number, number][][][] }

type Feature<T = PolygonGeometry | MultiPolygonGeometry> = {
  type: 'Feature'
  geometry: T
  properties?: Record<string, any>
}

type FeatureCollection<T = PolygonGeometry | MultiPolygonGeometry> = {
  type: 'FeatureCollection'
  features: Feature<T>[]
}

/**
 * Obtiene los límites (bounds) de un GeoJSON para hacer fitBounds
 */
export function getBounds(geojson: GeoJSONFeatureCollection): LatLngBoundsExpression {
  const bbox = turf.bbox(geojson)
  // bbox formato: [minLng, minLat, maxLng, maxLat]
  // Leaflet espera: [[minLat, minLng], [maxLat, maxLng]]
  return [
    [bbox[1], bbox[0]], // Southwest [minLat, minLng]
    [bbox[3], bbox[2]]  // Northeast [maxLat, maxLng]
  ]
}

/**
 * Verifica si un punto está dentro de un polígono
 */
export function isPointInPolygon(
  lat: number,
  lng: number,
  polygon: GeoJSONFeatureCollection
): boolean {
  const point = turf.point([lng, lat])

  for (const feature of polygon.features) {
    // Solo procesar Polygon y MultiPolygon
    if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') {
      continue
    }

    const poly = turf.feature(feature.geometry) as Feature<Polygon | MultiPolygon>
    if (turf.booleanPointInPolygon(point, poly)) {
      return true
    }
  }

  return false
}

/**
 * Recorta un rango de especies a la bioregión del Chocó
 */
export function clipRangeToRegion(
  range: SpeciesRange,
  bioregion: GeoJSONFeatureCollection
): GeoJSONFeatureCollection | null {
  try {
    // Filtrar solo Polygon y MultiPolygon de la bioregión
    const polygonFeatures = bioregion.features.filter(
      (f) => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
    )

    if (polygonFeatures.length === 0) return null

    // Verificar que el rango también sea Polygon o MultiPolygon
    if (range.geometry.type !== 'Polygon' && range.geometry.type !== 'MultiPolygon') {
      return null
    }

    const rangePolygon = turf.feature(range.geometry) as Feature<Polygon | MultiPolygon>
    const bioregionCollection = turf.featureCollection(
      polygonFeatures.map((f) => turf.feature(f.geometry) as Feature<Polygon | MultiPolygon>)
    ) as FeatureCollection<Polygon | MultiPolygon>
    
    const bioregionUnion = turf.union(bioregionCollection)

    if (!bioregionUnion) return null

    const intersection = turf.intersect(
      turf.featureCollection([rangePolygon, bioregionUnion]) as FeatureCollection<Polygon | MultiPolygon>
    )

    if (!intersection) return null

    // Asegurar que las propiedades no sean null
    const feature: GeoJSONFeature = {
      type: 'Feature',
      geometry: intersection.geometry,
      properties: intersection.properties || {}
    }

    return {
      type: 'FeatureCollection',
      features: [feature]
    }
  } catch (error) {
    console.error('Error clipping range to region:', error)
    return null
  }
}

/**
 * Calcula el área de un polígono en km²
 */
export function calculateArea(geojson: GeoJSONFeatureCollection): number {
  const area = turf.area(geojson)
  return area / 1_000_000 // Convertir de m² a km²
}

/**
 * Calcula el centroide de un polígono
 */
export function getCentroid(geojson: GeoJSONFeatureCollection): [number, number] {
  const centroid = turf.centroid(geojson)
  return centroid.geometry.coordinates as [number, number]
}

/**
 * Calcula la distancia entre dos puntos en km
 */
export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const from = turf.point([lng1, lat1])
  const to = turf.point([lng2, lat2])
  return turf.distance(from, to, { units: 'kilometers' })
}

/**
 * Genera puntos aleatorios dentro de un polígono (para testing/demo)
 */
export function generateRandomPointsInPolygon(
  polygon: GeoJSONFeatureCollection,
  count: number
): Array<[number, number]> {
  const points: Array<[number, number]> = []
  const bbox = turf.bbox(polygon)

  let attempts = 0
  const maxAttempts = count * 10

  while (points.length < count && attempts < maxAttempts) {
    const randomLng = bbox[0] + Math.random() * (bbox[2] - bbox[0])
    const randomLat = bbox[1] + Math.random() * (bbox[3] - bbox[1])

    if (isPointInPolygon(randomLat, randomLng, polygon)) {
      points.push([randomLat, randomLng])
    }

    attempts++
  }

  return points
}

/**
 * Simplifica geometría para mejor rendimiento
 */
export function simplifyGeometry(
  geojson: GeoJSONFeatureCollection,
  tolerance: number = 0.01
): GeoJSONFeatureCollection {
  try {
    const simplified = turf.simplify(geojson, {
      tolerance,
      highQuality: false
    })
    return simplified
  } catch (error) {
    console.error('Error simplifying geometry:', error)
    return geojson
  }
}
