// src/utils/layerFeatures.ts
// Utilidades genéricas para trabajar con features de capas

import type { GeoJSONFeatureCollection, LayerFeature, LayerFeatureConfig, FeatureDisplayProperty } from '../types'

/**
 * Parsear features de cualquier GeoJSON según configuración
 */
export function parseLayerFeatures(
  geojson: GeoJSONFeatureCollection,
  config: LayerFeatureConfig
): LayerFeature[] {
  return geojson.features.map(feature => {
    const nameValue = feature.properties[config.nameProperty]
    // Verificar que el nombre no esté vacío, null, undefined, o sea solo espacios
    const name = (nameValue && String(nameValue).trim()) || 'Sin nombre'
    
    return {
      id: feature.properties[config.idProperty]?.toString() || '',
      name,
      properties: feature.properties,
      layerId: config.layerId
    }
  })
}

/**
 * Filtrar features por término de búsqueda
 */
export function filterFeatures(
  features: LayerFeature[],
  searchTerm: string,
  config: LayerFeatureConfig
): LayerFeature[] {
  if (!searchTerm.trim()) return features
  
  const term = searchTerm.toLowerCase()
  return features.filter(feature => 
    config.searchableProperties.some(prop => 
      feature.properties[prop]?.toString().toLowerCase().includes(term)
    )
  )
}

/**
 * Formatear valor según tipo y formato especificado
 */
export function formatPropertyValue(
  value: any,
  format?: FeatureDisplayProperty['format'],
  unit?: string
): string {
  if (value == null || value === '') return 'N/A'
  
  switch (format) {
    case 'area':
      return `${Number(value).toLocaleString('es-CO', { maximumFractionDigits: 2 })} ${unit || 'ha'}`
    case 'altitude':
      return `${Number(value).toLocaleString('es-CO', { maximumFractionDigits: 0 })} ${unit || 'msnm'}`
    case 'number':
      return `${Number(value).toLocaleString('es-CO', { maximumFractionDigits: 2 })} ${unit || ''}`
    case 'date':
      try {
        return new Date(value).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return value.toString()
      }
    case 'text':
    default:
      return value.toString()
  }
}

/**
 * Ordenar features alfabéticamente por nombre
 */
export function sortFeaturesByName(features: LayerFeature[]): LayerFeature[] {
  return [...features].sort((a, b) => 
    a.name.localeCompare(b.name, 'es-CO', { sensitivity: 'base' })
  )
}

/**
 * Obtener propiedades secundarias para mostrar en lista
 * (primeras 2 propiedades configuradas)
 */
export function getSecondaryProperties(
  feature: LayerFeature,
  config: LayerFeatureConfig
): Array<{ label: string; value: string }> {
  return config.displayProperties
    .slice(0, 2)
    .map(prop => ({
      label: prop.label,
      value: formatPropertyValue(
        feature.properties[prop.key],
        prop.format,
        prop.unit
      )
    }))
    .filter(item => item.value !== 'N/A')
}

/**
 * Validar si un feature tiene nombre válido basándose en propiedades raw y configuración
 * Útil para validar features antes de parsearlos o en el mapa
 */
export function hasValidFeatureName(
  properties: Record<string, any>,
  config: LayerFeatureConfig
): boolean {
  if (!properties || !config) return false
  const nameValue = properties[config.nameProperty]
  const name = (nameValue && String(nameValue).trim()) || ''
  return name !== '' && name !== 'Sin nombre'
}

/**
 * Validar si un feature tiene datos válidos
 */
export function isValidFeature(feature: LayerFeature, config: LayerFeatureConfig): boolean {
  // Verificar que tenga ID válido
  if (!feature.id || feature.id.trim() === '') {
    return false
  }
  
  // Verificar que tenga nombre válido (no vacío, no "Sin nombre", no solo espacios)
  const name = feature.name?.trim()
  if (!name || name === '' || name === 'Sin nombre') {
    return false
  }
  
  // Verificar que tenga al menos una propiedad con valor
  return config.displayProperties.some(prop => {
    const value = feature.properties[prop.key]
    return value != null && value !== '' && String(value).trim() !== ''
  })
}

