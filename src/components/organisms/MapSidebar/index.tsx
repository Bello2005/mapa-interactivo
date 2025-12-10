import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import clsx from 'clsx'
import { useUIStore } from '@stores/uiStore'
import { TabBar } from '@components/molecules/TabBar'
import { QuickLayersView } from './QuickLayersView'
import { AdvancedLayersView } from './AdvancedLayersView'
import { LayerDetailView } from './LayerDetailView'
import { FeatureListView } from './FeatureListView'
import { FeatureDetailView } from './FeatureDetailView'
import { ArrowLeft, Layers } from 'lucide-react'
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

  const drillDownLayers = useMemo<ThematicLayer[]>(() => {
    if (!layerDrillDown.categoryId) return []
    return availableLayers
      .filter((layer) => layer.category === layerDrillDown.categoryId && layer.enabled !== false)
      .sort((a, b) => a.order - b.order)
  }, [availableLayers, layerDrillDown.categoryId])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[900] md:hidden"
          />

          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className={clsx(
              'fixed md:absolute z-[901]',
              'left-3 md:left-6 lg:left-10 xl:left-20',
              'top-16 md:top-20',
              'w-[calc(100vw-1.5rem)] md:w-[380px] lg:w-[400px]',
              'max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)]',
              'bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden'
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
                      layers={availableLayers}
                      activeLayerIds={activeLayerIds}
                      layerOpacities={layerOpacities}
                      onToggleLayer={toggleLayer}
                      onOpacityChange={setLayerOpacity}
                    />
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
                      layers={availableLayers}
                      activeLayerIds={activeLayerIds}
                      layerOpacities={layerOpacities}
                      onToggleLayer={toggleLayer}
                      onOpacityChange={setLayerOpacity}
                      onEnterCategory={enterLayerDrillDown}
                    />
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
