// src/services/api.ts
// Cliente API para consumir el backend

import type { ThematicLayer } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  error?: string
}

export interface LayerMetadata {
  id: string
  name: string
  description: string
  category: string
  source: string
  storageType: string
  geojsonPath?: string
  geoserverLayer?: string
  color: string
  opacity: number
  order: number
  enabled: boolean
  fileSize?: number
  featureCount?: number
  metadata?: {
    source: string
    year?: number
    resolution?: string
  }
}

/**
 * Obtener todas las capas (solo metadata)
 */
export async function getLayers(filters?: {
  category?: string
  enabled?: boolean
}): Promise<ThematicLayer[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.enabled !== undefined) params.append('enabled', String(filters.enabled))

    const url = `${API_URL}/layers${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<LayerMetadata[]> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Error al obtener capas')
    }

    // Convertir a formato ThematicLayer
    return result.data.map((layer) => ({
      id: layer.id,
      name: layer.name,
      description: layer.description,
      category: layer.category as ThematicLayer['category'],
      source: layer.source as ThematicLayer['source'],
      storageType: layer.storageType as ThematicLayer['storageType'],
      geojsonPath: layer.geojsonPath,
      geoserverLayer: layer.geoserverLayer,
      color: layer.color,
      opacity: layer.opacity,
      visible: false,
      order: layer.order,
      enabled: layer.enabled,
      fileSize: layer.fileSize,
      featureCount: layer.featureCount,
      metadata: layer.metadata,
    }))
  } catch (error) {
    console.warn('⚠️ Error obteniendo capas desde API, usando configuración estática:', error)
    // Fallback: retornar array vacío, el componente usará configuración estática
    return []
  }
}

/**
 * Obtener categorías disponibles
 */
export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/layers/categories/list`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<string[]> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Error al obtener categorías')
    }

    return result.data
  } catch (error) {
    console.warn('⚠️ Error obteniendo categorías desde API:', error)
    return []
  }
}

/**
 * Verificar si el backend está disponible
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // Timeout de 2 segundos
    
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    // Error silencioso - el backend no está disponible, usar fallback estático
    // No loguear el error ya que es un comportamiento esperado
    return false
  }
}

