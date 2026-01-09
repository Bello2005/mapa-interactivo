// src/services/layerFeatures.ts
// Servicio para cargar features de capas con cache

import type { LayerFeature, GeoJSONFeatureCollection } from '../types'
import { getLayerFeatureConfig } from '@config/layerFeatures'
import { getLayerById } from '@config/layers'
import { parseLayerFeatures, sortFeaturesByName, isValidFeature } from '@utils/layerFeatures'

// Cache de features cargados
const featuresCache = new Map<string, LayerFeature[]>()

// Cache de GeoJSON raw
const geojsonCache = new Map<string, GeoJSONFeatureCollection>()

/**
 * Cargar features de una capa específica
 * Usa cache para evitar cargas repetidas
 */
export async function loadLayerFeatures(
  layerId: string
): Promise<LayerFeature[]> {
  // Verificar cache
  if (featuresCache.has(layerId)) {
    return featuresCache.get(layerId)!
  }
  
  // Obtener config
  const config = getLayerFeatureConfig(layerId)
  if (!config) {
    throw new Error(`No existe configuración de features para la capa: ${layerId}`)
  }
  
  // Cargar GeoJSON
  const geojson = await loadGeoJSON(layerId)
  
  // Parsear features
  const features = parseLayerFeatures(geojson, config)
  
  // Filtrar solo features con nombres válidos (optimización: no mostrar features sin nombre)
  const validFeatures = features.filter(feature => isValidFeature(feature, config))
  
  // Ordenar alfabéticamente
  const sortedFeatures = sortFeaturesByName(validFeatures)
  
  // Guardar en cache
  featuresCache.set(layerId, sortedFeatures)
  
  return sortedFeatures
}

/**
 * Cargar GeoJSON de una capa
 * Usa cache para evitar cargas repetidas
 */
export async function loadGeoJSON(
  layerId: string
): Promise<GeoJSONFeatureCollection> {
  // Verificar cache
  if (geojsonCache.has(layerId)) {
    return geojsonCache.get(layerId)!
  }
  
  // Obtener capa
  const layer = getLayerById(layerId)
  if (!layer?.geojsonPath) {
    throw new Error(`No se encontró ruta de GeoJSON para la capa: ${layerId}`)
  }
  
  // Cargar desde servidor
  const response = await fetch(layer.geojsonPath)
  if (!response.ok) {
    throw new Error(`Error al cargar GeoJSON: ${response.statusText}`)
  }
  
  const geojson = await response.json() as GeoJSONFeatureCollection
  
  // Validar estructura
  if (!geojson.features || !Array.isArray(geojson.features)) {
    throw new Error(`GeoJSON inválido para la capa: ${layerId}`)
  }
  
  // Guardar en cache
  geojsonCache.set(layerId, geojson)
  
  return geojson
}

/**
 * Obtener un feature específico por ID y opcionalmente por nombre
 */
export async function getFeatureById(
  layerId: string,
  featureId: string,
  featureName?: string
): Promise<LayerFeature | null> {
  const features = await loadLayerFeatures(layerId)
  
  // Si se proporciona el nombre, buscar por ID y nombre para evitar colisiones
  if (featureName) {
    const normalizedName = featureName.toLowerCase().trim()
    const found = features.find(f => 
      f.id === featureId && f.name.toLowerCase().trim() === normalizedName
    )
    if (found) return found
  }
  
  // Fallback: buscar solo por ID (puede haber colisiones)
  return features.find(f => f.id === featureId) || null
}

/**
 * Obtener el bounds de un feature específico del GeoJSON
 */
export async function getFeatureBounds(
  layerId: string,
  featureId: string
): Promise<[[number, number], [number, number]] | null> {
  const geojson = await loadGeoJSON(layerId)
  const config = getLayerFeatureConfig(layerId)
  
  if (!config) return null
  
  const feature = geojson.features.find(
    f => f.properties[config.idProperty]?.toString() === featureId
  )
  
  if (!feature) return null
  
  // Calcular bounds del feature
  const coords = extractCoordinates(feature.geometry)
  if (coords.length === 0) return null
  
  const lats = coords.map(c => c[1])
  const lngs = coords.map(c => c[0])
  
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)]
  ]
}

/**
 * Extraer todas las coordenadas de una geometría
 */
function extractCoordinates(geometry: any): number[][] {
  const coords: number[][] = []
  
  function extract(geom: any) {
    if (geom.type === 'Point') {
      coords.push(geom.coordinates)
    } else if (geom.type === 'LineString' || geom.type === 'MultiPoint') {
      coords.push(...geom.coordinates)
    } else if (geom.type === 'Polygon') {
      geom.coordinates.forEach((ring: number[][]) => coords.push(...ring))
    } else if (geom.type === 'MultiLineString' || geom.type === 'MultiPolygon') {
      geom.coordinates.forEach((part: any) => extract({ type: geom.type.replace('Multi', ''), coordinates: part }))
    }
  }
  
  extract(geometry)
  return coords
}

/**
 * Limpiar cache (útil para desarrollo o cuando se actualizan datos)
 */
export function clearCache(layerId?: string) {
  if (layerId) {
    featuresCache.delete(layerId)
    geojsonCache.delete(layerId)
  } else {
    featuresCache.clear()
    geojsonCache.clear()
  }
}

/**
 * Verificar si una capa tiene features con nombres válidos
 * Útil para determinar si mostrar el botón "Ver elementos"
 */
export async function hasNamedFeatures(layerId: string): Promise<boolean> {
  try {
    const features = await loadLayerFeatures(layerId)
    return features.length > 0
  } catch {
    return false
  }
}

/**
 * Obtener estadísticas de cache
 */
export function getCacheStats() {
  return {
    featuresLayers: Array.from(featuresCache.keys()),
    geojsonLayers: Array.from(geojsonCache.keys()),
    totalFeaturesCached: Array.from(featuresCache.values()).reduce((sum, features) => sum + features.length, 0)
  }
}

