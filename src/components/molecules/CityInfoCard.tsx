// src/components/molecules/CityInfoCard.tsx
// Tarjeta de información de ciudad con botón de regresar

import { motion } from 'framer-motion'
import { X, MapPin, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@components/atoms/Button'
import type { City } from '../../types'

interface CityInfoCardProps {
  city: City
  onClose: () => void
}

export function CityInfoCard({ city, onClose }: CityInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute top-4 right-4 z-[1000] bg-white rounded-2xl shadow-2xl border-2 border-choco-forest-200 max-w-md w-full md:w-96 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-choco-forest-500 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-choco-sand-900">
              {city.name}
            </h3>
            <p className="text-sm text-choco-sand-600">{city.country}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-choco-sand-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-choco-sand-600" />
        </button>
      </div>

      {/* Información */}
      <div className="space-y-4 mb-6">
        <p className="text-choco-sand-700 leading-relaxed">
          {city.description}
        </p>

        {city.population && (
          <div className="flex items-center gap-2 text-sm text-choco-sand-600">
            <Users className="w-4 h-4" />
            <span>Población: {city.population.toLocaleString()}</span>
          </div>
        )}

        {city.importance && (
          <div className="bg-choco-forest-50 rounded-lg p-3">
            <p className="text-sm font-medium text-choco-forest-700">
              {city.importance}
            </p>
          </div>
        )}
      </div>

      {/* Botón de regresar */}
      <Button
        onClick={onClose}
        variant="primary"
        fullWidth
        icon={<ArrowLeft className="w-4 h-4" />}
        iconPosition="left"
      >
        Regresar a Controles
      </Button>
    </motion.div>
  )
}

