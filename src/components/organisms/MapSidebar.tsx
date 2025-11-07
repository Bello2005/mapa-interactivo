// src/components/organisms/MapSidebar.tsx
// Panel lateral de controles del mapa - Tarjeta flotante estilo interfaz china moderna

import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { 
  Layers, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Sparkles,
  MapPin,
  Sliders,
  Search,
  Satellite,
  Map as MapIcon,
  Mountain,
  Share2,
  Info,
  Maximize,
  Minimize,
  Crosshair,
  Globe,
} from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@components/atoms/Button'
import { LayerToggle } from '@components/molecules/LayerToggle'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'
import type { City } from '../../types'
import { ArrowLeft, Users } from 'lucide-react'

interface MapSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeLayers: {
    bioregion: boolean
  }
  toggleLayer: (layer: 'bioregion') => void
  bioregionOpacity: number
  onOpacityChange: (opacity: number) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFitBounds: () => void
  onSearchLocation?: (query: string) => void
  onToggleMapStyle?: (style: 'default' | 'satellite' | 'terrain') => void
  onShareLocation?: () => void
  onToggleFullscreen?: () => void
  onToggleCoordinates?: () => void
  mapStyle?: 'default' | 'satellite' | 'terrain'
  isFullscreen?: boolean
  showCoordinates?: boolean
  selectedCity?: City | null
  onBackToControls?: () => void
}

export function MapSidebar({
  isOpen,
  onClose,
  activeLayers,
  toggleLayer,
  bioregionOpacity,
  onOpacityChange,
  onZoomIn,
  onZoomOut,
  onFitBounds,
  onSearchLocation,
  onToggleMapStyle,
  onShareLocation,
  onToggleFullscreen,
  onToggleCoordinates,
  mapStyle = 'default',
  isFullscreen = false,
  showCoordinates = false,
  selectedCity = null,
  onBackToControls,
}: MapSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const language = useUIStore((state) => state.language)
  const translations = t(language)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sidebarContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay para móviles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] md:hidden"
          />

          {/* Tarjeta flotante */}
          <motion.aside
            initial={{ x: -500, opacity: 0, scale: 0.9 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              scale: 1
            }}
            exit={{ 
              x: -500, 
              opacity: 0,
              scale: 0.9
            }}
            transition={{ 
              type: 'spring', 
              damping: 35, 
              stiffness: 400,
              mass: 0.7
            }}
            className={clsx(
              // Posicionamiento responsive
              'fixed sm:absolute z-[1000]',
              'left-2 sm:left-4 md:left-6 lg:left-8 xl:left-24',
              'top-20 sm:top-24 md:top-24 lg:top-24',
              'right-2 sm:right-auto',
              // Ancho responsive
              'w-[calc(100vw-1rem)]', // Móvil: casi todo el ancho con pequeño margen
              'sm:w-[calc(100vw-2rem)]', // Small: más margen
              'md:w-[420px]', // Medium: ancho fijo
              'lg:w-[480px]', // Large: más ancho
              'xl:w-[520px]', // XL: ancho máximo
              // Altura responsive
              'max-h-[calc(100vh-5rem)]', // Móvil: altura adaptativa
              'sm:max-h-[calc(100vh-6rem)]', // Small
              'md:max-h-[calc(100vh-7rem)]', // Medium
              'lg:max-h-[600px]', // Large: altura máxima
              // Estilos base
              'bg-white',
              'rounded-xl sm:rounded-2xl',
              'shadow-2xl shadow-black/10',
              'border border-gray-200/60',
              'flex flex-col',
              'overflow-hidden',
              'ring-1 ring-black/5'
            )}
          >
            {/* Header minimalista compacto - Responsive */}
            <div className="relative px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 md:pt-5 pb-3 sm:pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-choco-forest-500 to-choco-pacific-500 flex items-center justify-center shadow-md flex-shrink-0"
                  >
                    {selectedCity ? (
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 tracking-tight truncate">
                      {selectedCity ? selectedCity.name : translations.map.title}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium truncate">
                      {selectedCity ? selectedCity.country : 'Chocó Biogeográfico'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all flex-shrink-0"
                  aria-label="Cerrar panel"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Contenido con scroll suave - Altura reducida para scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0">
              <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 space-y-3 sm:space-y-4 md:space-y-5">
                {selectedCity ? (
                  /* Vista de información de ciudad */
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Imagen de la ciudad */}
                    {selectedCity.imageUrl && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl overflow-hidden shadow-lg"
                      >
                        <img
                          src={selectedCity.imageUrl}
                          alt={selectedCity.name}
                          className="w-full h-full object-cover object-center"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            // Fallback si la imagen no carga
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&q=80'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5">
                          <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white mb-1 drop-shadow-lg">
                            {selectedCity.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-white/90 drop-shadow-md">{selectedCity.country}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Descripción */}
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        {selectedCity.description}
                      </p>

                      {selectedCity.population && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <Users className="w-4 h-4" />
                          <span>Población: {selectedCity.population.toLocaleString()}</span>
                        </div>
                      )}

                      {selectedCity.importance && (
                        <div className="bg-choco-forest-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-choco-forest-700">
                            {selectedCity.importance}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botón de regresar */}
                    <Button
                      onClick={onBackToControls}
                      variant="primary"
                      fullWidth
                      icon={<ArrowLeft className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Regresar a Controles
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    {/* Card de información - Responsive */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-choco-forest-500 to-choco-pacific-500 flex items-center justify-center shadow-md flex-shrink-0"
                        >
                          <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900">
                              Chocó Biogeográfico
                            </h3>
                            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-bold bg-choco-forest-100 text-choco-forest-700 rounded-full whitespace-nowrap">
                              Hotspot
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                            {translations.map.bioregionDescription}, 
                            caracterizada por su <span className="font-semibold text-choco-forest-700">alta biodiversidad</span> y endemismo.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                {/* Sección de Capas - Responsive */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-choco-forest-500 to-choco-pacific-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 tracking-tight">
                      {translations.map.layers}
                    </h3>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {/* Layer Toggle - Responsive */}
                    <motion.div
                      whileHover={{ y: -1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <LayerToggle
                        label="Chocó Biogeográfico"
                        description={translations.map.bioregion}
                        checked={activeLayers.bioregion}
                        onChange={() => toggleLayer('bioregion')}
                        color="#1b7a3a"
                      />
                      
                      {/* Control de opacidad - Tamaño aumentado */}
                      {activeLayers.bioregion && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Sliders className="w-4 h-4 text-gray-500" />
                              <label className="text-base font-semibold text-gray-700">
                                {translations.map.opacity}
                              </label>
                            </div>
                            <span className="px-3 py-1 bg-choco-forest-100 text-choco-forest-700 rounded-full text-base font-bold">
                              {Math.round(bioregionOpacity * 100)}%
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={bioregionOpacity * 100}
                              onChange={(e) => onOpacityChange(parseInt(e.target.value) / 100)}
                              className="w-full h-2 bg-gradient-to-r from-gray-200 via-choco-forest-200 to-choco-forest-400 rounded-full appearance-none cursor-pointer accent-choco-forest-500 slider"
                              style={{
                                background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${bioregionOpacity * 100}%, #86efac ${bioregionOpacity * 100}%, #4ade80 100%)`
                              }}
                            />
                            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Búsqueda de ubicaciones */}
                {onSearchLocation && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0">
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 tracking-tight">
                        {translations.map.search}
                      </h3>
                    </div>
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                      <div className="flex gap-1.5 sm:gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && searchQuery.trim()) {
                              onSearchLocation(searchQuery.trim())
                            }
                          }}
                          placeholder={translations.map.searchPlaceholder}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-choco-forest-500 focus:border-transparent text-xs sm:text-sm"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (searchQuery.trim()) {
                              onSearchLocation(searchQuery.trim())
                            }
                          }}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex-shrink-0"
                        >
                          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Estilos de mapa */}
                {onToggleMapStyle && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 tracking-tight">
                        {translations.map.mapStyles.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-2.5">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onToggleMapStyle('default')}
                        className={clsx(
                          'p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 transition-all font-semibold text-xs sm:text-sm',
                          mapStyle === 'default'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 shadow-sm'
                        )}
                      >
                        <MapIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mx-auto mb-0.5 sm:mb-1" />
                        <span className="hidden sm:inline">{translations.map.mapStyles.default}</span>
                        <span className="sm:hidden text-[10px]">Std</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onToggleMapStyle('satellite')}
                        className={clsx(
                          'p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 transition-all font-semibold text-xs sm:text-sm',
                          mapStyle === 'satellite'
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-600 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 shadow-sm'
                        )}
                      >
                        <Satellite className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mx-auto mb-0.5 sm:mb-1" />
                        <span className="hidden sm:inline">{translations.map.mapStyles.satellite}</span>
                        <span className="sm:hidden text-[10px]">Sat</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onToggleMapStyle('terrain')}
                        className={clsx(
                          'p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 transition-all font-semibold text-xs sm:text-sm',
                          mapStyle === 'terrain'
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-600 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 shadow-sm'
                        )}
                      >
                        <Mountain className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mx-auto mb-0.5 sm:mb-1" />
                        <span className="hidden sm:inline">{translations.map.mapStyles.terrain}</span>
                        <span className="sm:hidden text-[10px]">Ter</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Controles de navegación - Tamaño aumentado */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-choco-pacific-500 to-choco-forest-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 tracking-tight">
                      {translations.map.navigation}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                    <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={onZoomIn}
                        variant="primary"
                        size="md"
                        icon={<ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />}
                        className="w-full h-10 sm:h-11 md:h-12 bg-gradient-to-r from-choco-forest-500 to-choco-forest-600 hover:from-choco-forest-600 hover:to-choco-forest-700 shadow-md hover:shadow-lg rounded-lg sm:rounded-xl transition-all font-semibold text-xs sm:text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">{translations.map.zoomIn}</span>
                        <span className="sm:hidden">+</span>
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={onZoomOut}
                        variant="secondary"
                        size="md"
                        icon={<ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />}
                        className="w-full h-10 sm:h-11 md:h-12 bg-gradient-to-r from-choco-pacific-500 to-choco-pacific-600 hover:from-choco-pacific-600 hover:to-choco-pacific-700 shadow-md hover:shadow-lg rounded-lg sm:rounded-xl transition-all font-semibold text-xs sm:text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">{translations.map.zoomOut}</span>
                        <span className="sm:hidden">-</span>
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01, y: -1 }} 
                      whileTap={{ scale: 0.99 }}
                      className="col-span-2"
                    >
                      <Button
                        onClick={onFitBounds}
                        variant="outline"
                        size="md"
                        icon={<Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                        className="w-full h-10 sm:h-11 md:h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold shadow-sm hover:shadow-md rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm md:text-base"
                      >
                        {translations.map.fitBounds}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Herramientas avanzadas */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 tracking-tight">
                      {translations.map.toolsLabel}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5">
                    {onToggleFullscreen && (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onToggleFullscreen}
                        className={clsx(
                          'p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2',
                          isFullscreen
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 shadow-sm'
                        )}
                      >
                        {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        <span className="hidden sm:inline">{isFullscreen ? translations.map.tools.exitFullscreen : translations.map.tools.fullscreen}</span>
                      </motion.button>
                    )}
                    {onToggleCoordinates && (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onToggleCoordinates}
                        className={clsx(
                          'p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2',
                          showCoordinates
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 shadow-sm'
                        )}
                      >
                        <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{translations.map.tools.coordinates}</span>
                      </motion.button>
                    )}
                    {onShareLocation && (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onShareLocation}
                        className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-pink-300 shadow-sm transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{translations.map.tools.share}</span>
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        alert(translations.map.tools.infoText)
                      }}
                      className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-cyan-300 shadow-sm transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{translations.map.tools.info}</span>
                    </motion.button>
                  </div>
                </motion.div>

                    {/* Footer minimalista */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="pt-4 border-t border-gray-100"
                    >
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-medium">Powered by IIAP</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return (
    <>
      {createPortal(sidebarContent, document.body)}
      {/* Estilos adicionales para el slider y scrollbar personalizado */}
          <style dangerouslySetInnerHTML={{__html: `
            /* Scrollbar personalizado - Hermoso y elegante */
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
              border-radius: 10px;
              margin: 10px 0;
              border: 1px solid rgba(229, 231, 235, 0.5);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #16a34a, #22c55e);
              border-radius: 10px;
              border: 2px solid transparent;
              background-clip: padding-box;
              box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #15803d, #16a34a);
              box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15), 0 0 8px rgba(34, 197, 94, 0.3);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:active {
              background: linear-gradient(to bottom, #14532d, #15803d);
            }

            /* Firefox scrollbar */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #16a34a #f9fafb;
            }
            
            /* Slider personalizado mejorado */
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: linear-gradient(135deg, #16a34a, #22c55e);
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(34, 197, 94, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.8);
              transition: all 0.2s ease;
            }
            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 4px 12px rgba(34, 197, 94, 0.6), 0 0 0 3px rgba(34, 197, 94, 0.2);
            }
            .slider::-webkit-slider-thumb:active {
              transform: scale(1.1);
            }
            .slider::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: linear-gradient(135deg, #16a34a, #22c55e);
              cursor: pointer;
              border: 2px solid rgba(255, 255, 255, 0.8);
              box-shadow: 0 2px 6px rgba(34, 197, 94, 0.4);
              transition: all 0.2s ease;
            }
            .slider::-moz-range-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 4px 12px rgba(34, 197, 94, 0.6);
            }
          `}} />
    </>
  )
}
