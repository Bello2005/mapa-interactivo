// src/components/organisms/MapSidebar/FeatureDetailView.tsx
// Vista de detalle genérica de un feature específico

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, AlertCircle, MapPin, Ruler, Mountain, Hash, Users, Waves, ShieldCheck, FileText, Calendar, TreePine, Leaf, Info, Star, TrendingUp, Map, Building } from 'lucide-react'
import type { LayerFeature } from '../../../types'
import { getFeatureById } from '@services/layerFeatures'
import { getLayerFeatureConfig } from '@config/layerFeatures'
import { formatPropertyValue } from '@utils/layerFeatures'
import { useUIStore } from '@stores/uiStore'

interface FeatureDetailViewProps {
  layerId: string
  featureId: string
}

// Mapeo de iconos
const iconMap: Record<string, any> = {
  MapPin,
  Ruler,
  Mountain,
  Hash,
  Users,
  Waves,
  ShieldCheck,
  FileText,
  Calendar,
  TreePine,
  Leaf,
  Info,
  Star,
  TrendingUp,
  Map,
  Building
}

export function FeatureDetailView({ layerId, featureId }: FeatureDetailViewProps) {
  const [feature, setFeature] = useState<LayerFeature | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { exitFeatureDrillDown, featureDrillDown } = useUIStore()
  const config = getLayerFeatureConfig(layerId)

  // Cargar feature
  useEffect(() => {
    let mounted = true
    
    async function load() {
      try {
        setLoading(true)
        setError(null)
        // Usar el nombre del featureDrillDown si está disponible para evitar colisiones de ID
        const featureName = featureDrillDown?.featureName
        const loadedFeature = await getFeatureById(layerId, featureId, featureName)
        if (mounted) {
          if (loadedFeature) {
            setFeature(loadedFeature)
          } else {
            setError('Elemento no encontrado')
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar elemento')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    
    load()
    
    return () => {
      mounted = false
    }
  }, [layerId, featureId, featureDrillDown?.featureName])

  if (!config) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Configuración no encontrada</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-600">Cargando información...</span>
      </div>
    )
  }

  if (error || !feature) {
    return (
      <div className="p-4">
        <button
          onClick={exitFeatureDrillDown}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-choco-forest-700 hover:text-choco-forest-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{error || 'Elemento no encontrado'}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="p-3 space-y-3"
    >
      {/* Header con botón volver */}
      <button
        onClick={() => {
          exitFeatureDrillDown()
          // Asegurar que mantenemos la vista de lista si existe
        }}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-choco-forest-700 hover:text-choco-forest-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      {/* Nombre del feature */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900">{feature.name}</h2>
      </div>

      {/* Propiedades */}
      <div className="space-y-2">
        {config.displayProperties.map((prop, index) => {
          const value = feature.properties[prop.key]
          const formattedValue = formatPropertyValue(value, prop.format, prop.unit)
          
          // Saltar si no hay valor
          if (formattedValue === 'N/A') return null
          
          const Icon = prop.icon ? iconMap[prop.icon] : Info
          
          return (
            <motion.div
              key={prop.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="bg-white rounded-lg border border-gray-200 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  {Icon && <Icon className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 mb-0.5">
                    {prop.label}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 break-words">
                    {formattedValue}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Información adicional si hay propiedades no configuradas */}
      {Object.keys(feature.properties).length > config.displayProperties.length && (
        <details className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          <summary className="text-xs font-medium text-gray-700 cursor-pointer">
            Ver más información
          </summary>
          <div className="mt-2 space-y-1">
            {Object.entries(feature.properties)
              .filter(([key]) => !config.displayProperties.some(p => p.key === key))
              .filter(([_, value]) => value != null && value !== '')
              .map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="font-medium text-gray-600">{key}:</span>{' '}
                  <span className="text-gray-800">{String(value)}</span>
                </div>
              ))}
          </div>
        </details>
      )}
    </motion.div>
  )
}

