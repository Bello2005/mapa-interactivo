// src/components/organisms/MapSidebar/FeatureListView.tsx
// Vista de lista genérica de features de una capa

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import clsx from 'clsx'
import type { LayerFeature } from '../../../types'
import { loadLayerFeatures, getFeatureBounds } from '@services/layerFeatures'
import { getLayerFeatureConfig } from '@config/layerFeatures'
import { filterFeatures, getSecondaryProperties } from '@utils/layerFeatures'
import { useUIStore } from '@stores/uiStore'

interface FeatureListViewProps {
  layerId: string
}

export function FeatureListView({ layerId }: FeatureListViewProps) {
  const [features, setFeatures] = useState<LayerFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { enterFeatureDrillDown, exitFeatureListView } = useUIStore()
  const config = getLayerFeatureConfig(layerId)

  // Cargar features
  useEffect(() => {
    let mounted = true
    
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const loadedFeatures = await loadLayerFeatures(layerId)
        if (mounted) {
          setFeatures(loadedFeatures)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar elementos')
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
  }, [layerId])

  // Filtrar features según búsqueda
  const filteredFeatures = useMemo(() => {
    if (!config) return features
    return filterFeatures(features, searchTerm, config)
  }, [features, searchTerm, config])

  // Handler para seleccionar un feature
  const handleFeatureSelect = async (feature: LayerFeature) => {
    try {
      const bounds = await getFeatureBounds(layerId, feature.id)
      enterFeatureDrillDown(layerId, feature.id, feature.name)
      
      // Emitir evento para que MapView haga zoom
      if (bounds) {
        window.dispatchEvent(new CustomEvent('feature-selected', {
          detail: { layerId, featureId: feature.id, bounds }
        }))
      }
    } catch (err) {
      console.error('Error al seleccionar feature:', err)
    }
  }

  if (!config) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Configuración no encontrada para esta capa</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con botón volver */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => {
            exitFeatureListView()
            // Asegurar que volvemos a la vista de capas
            useUIStore.getState().setSidebarView('layers')
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-choco-forest-700 hover:text-choco-forest-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <h3 className="text-sm font-semibold text-gray-900">
          {features.length} {features.length === 1 ? 'elemento' : 'elementos'}
        </h3>
      </div>

      {/* Search bar */}
      <div className="p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Buscar en ${config.searchableProperties.join(', ')}...`}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de features */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            <span className="ml-2 text-sm text-gray-600">Cargando elementos...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="p-4 text-center">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {searchTerm ? 'No se encontraron elementos' : 'No hay elementos disponibles'}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="p-2 space-y-1">
              {filteredFeatures.map((feature, index) => {
                const secondaryProps = getSecondaryProperties(feature, config)
                
                return (
                  <motion.button
                    key={feature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.02, duration: 0.2 }}
                    onClick={() => handleFeatureSelect(feature)}
                    className={clsx(
                      'w-full text-left p-3 rounded-lg transition-all',
                      'hover:bg-emerald-50 hover:border-emerald-200',
                      'border border-gray-200 bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    )}
                  >
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {feature.name}
                    </div>
                    {secondaryProps.length > 0 && (
                      <div className="space-y-0.5">
                        {secondaryProps.map((prop, idx) => (
                          <div key={idx} className="text-xs text-gray-600">
                            <span className="font-medium">{prop.label}:</span> {prop.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

