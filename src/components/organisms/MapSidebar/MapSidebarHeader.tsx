import { X, MapPin, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import type { City } from '../../../types'

interface MapSidebarHeaderProps {
  onClose: () => void
  selectedCity?: City | null
}

export function MapSidebarHeader({ onClose, selectedCity = null }: MapSidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2.5 min-w-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-choco-forest-500 to-choco-pacific-500 flex items-center justify-center shadow-sm flex-shrink-0"
        >
          {selectedCity ? (
            <MapPin className="w-4 h-4 text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
        </motion.div>
        <div className="min-w-0">
          <h2 className="font-bold text-base text-gray-900 truncate">
            {selectedCity ? selectedCity.name : 'Explorar capas'}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {selectedCity ? selectedCity.country : 'Chocó Biogeográfico'}
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-all flex-shrink-0"
        aria-label="Cerrar panel"
      >
        <X className="w-4 h-4 text-gray-600" />
      </motion.button>
    </div>
  )
}
