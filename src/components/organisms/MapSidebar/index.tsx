import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useUIStore } from '@stores/uiStore'
import { TabBar } from '@components/molecules/TabBar'
import { QuickLayersView } from './QuickLayersView'
import { AdvancedLayersView } from './AdvancedLayersView'
import { LayerDetailView } from './LayerDetailView'
import { FeatureListView } from './FeatureListView'
import { FeatureDetailView } from './FeatureDetailView'
import { ArrowLeft, Layers, Search, X } from 'lucide-react'
import type { City, ThematicLayer } from '../../../types'
import { MapSidebarHeader } from './MapSidebarHeader'

interface MapSidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedCity?: City | null
}

export function MapSidebar({ isOpen, onClose, selectedCity = null }: MapSidebarProps) {
  const {
    availableLayers,
    quickLayers,
    layersMode,
    setLayersMode,
    layerDrillDown,
    enterLayerDrillDown,
    exitLayerDrillDown,
    toggleLayer,
    setLayerOpacity,
    activeLayerIds,
    layerOpacities,
    featureDrillDown,
    featureListView,
  } = useUIStore()

  const [searchQuery, setSearchQuery] = useState('')

  const drillDownLayers = useMemo<ThematicLayer[]>(() => {
    if (!layerDrillDown.categoryId) return []
    return availableLayers
      .filter((layer) => layer.category === layerDrillDown.categoryId && layer.enabled !== false)
      .sort((a, b) => a.order - b.order)
  }, [availableLayers, layerDrillDown.categoryId])

  // Filtrar capas según búsqueda
  const filteredLayers = useMemo(() => {
    if (!searchQuery.trim()) return availableLayers
    
    const query = searchQuery.toLowerCase()
    return availableLayers.filter(layer => 
      layer.name.toLowerCase().includes(query) ||
      layer.description.toLowerCase().includes(query) ||
      layer.category.toLowerCase().includes(query)
    )
  }, [availableLayers, searchQuery])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay renderizado en el body usando Portal para cubrir el header */}
          {createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1150] md:hidden"
            />,
            document.body
          )}

          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className={clsx(
              'fixed md:absolute z-[1200]',
              // Móvil: casi pantalla completa con margen mínimo
              'left-2 right-2 sm:left-3 sm:right-auto',
              'md:left-6 lg:left-10 xl:left-20',
              // Top: más bajo en móvil para evitar overlap con header
              'top-20 sm:top-20 md:top-20',
              // Width: flexible en móvil, fijo en desktop
              'w-auto sm:w-[calc(100vw-1.5rem)] md:w-[380px] lg:w-[400px]',
              // Altura reducida en móvil: 75% de pantalla en lugar de 94%
              'max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)]',
              'bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden',
              // Mejor touch en móvil
              'touch-pan-y'
            )}
          >
            <MapSidebarHeader onClose={onClose} selectedCity={selectedCity} />

            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                <Layers className="w-4 h-4 text-choco-forest-600" />
                <span>Capas del mapa</span>
              </div>
              <TabBar value={layersMode} onChange={setLayersMode} />
            </div>

            {/* Campo de búsqueda de capas */}
            {!featureDrillDown && !featureListView && !layerDrillDown.categoryId && (
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Buscar capas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
              <AnimatePresence mode="wait">
                {featureDrillDown ? (
                  <motion.div
                    key="feature-detail"
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -120, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                  >
                    <FeatureDetailView
                      layerId={featureDrillDown.layerId}
                      featureId={featureDrillDown.featureId!}
                    />
                  </motion.div>
                ) : featureListView ? (
                  <motion.div
                    key="feature-list"
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -120, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                  >
                    <FeatureListView layerId={featureListView} />
                  </motion.div>
                ) : layerDrillDown.categoryId ? (
                  <motion.div
                    key="drill"
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -120, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="p-3 space-y-3"
                  >
                    <button
                      onClick={exitLayerDrillDown}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-choco-forest-700 hover:text-choco-forest-800 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Volver
                    </button>
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                      <LayerDetailView
                        layers={drillDownLayers}
                        activeLayerIds={activeLayerIds}
                        layerOpacities={layerOpacities}
                        onToggleLayer={toggleLayer}
                        onOpacityChange={setLayerOpacity}
                      />
                    </div>
                  </motion.div>
                ) : layersMode === 'quick' ? (
                  <motion.div
                    key="quick"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="p-3"
                  >
                    <QuickLayersView
                      quickLayerIds={quickLayers}
                      layers={filteredLayers}
                      activeLayerIds={activeLayerIds}
                      layerOpacities={layerOpacities}
                      onToggleLayer={toggleLayer}
                      onOpacityChange={setLayerOpacity}
                    />
                    {searchQuery && filteredLayers.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No se encontraron capas que coincidan con "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="advanced"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="p-3"
                  >
                    <AdvancedLayersView
                      layers={filteredLayers}
                      activeLayerIds={activeLayerIds}
                      layerOpacities={layerOpacities}
                      onToggleLayer={toggleLayer}
                      onOpacityChange={setLayerOpacity}
                      onEnterCategory={enterLayerDrillDown}
                    />
                    {searchQuery && filteredLayers.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No se encontraron capas que coincidan con "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
