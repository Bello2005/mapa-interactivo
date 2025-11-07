// src/components/molecules/SpeciesCard.tsx
// Card para mostrar información de especies

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { MapPin, AlertCircle } from 'lucide-react'
import type { Species } from '@types/index'
import { Badge } from '@components/atoms/Badge'
import { categoryLabels, threatStatusLabels, threatStatusColors } from '@utils/colors'

interface SpeciesCardProps {
  species: Species
  onClick?: () => void
  compact?: boolean
}

export function SpeciesCard({ species, onClick, compact = false }: SpeciesCardProps) {
  if (compact) {
    return (
      <motion.button
        onClick={onClick}
        className={clsx(
          'w-full flex items-center gap-3 p-3 rounded-xl',
          'bg-white border border-choco-sand-200',
          'hover:border-choco-forest-500 hover:shadow-md',
          'transition-all duration-200',
          'text-left'
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <img
          src={species.image}
          alt={species.commonName}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-choco-sand-900 truncate">
            {species.commonName}
          </div>
          <div className="text-sm text-choco-sand-600 italic truncate">
            {species.scientificName}
          </div>
        </div>
        {species.endemic && (
          <Badge variant="warning" size="sm">Endémica</Badge>
        )}
      </motion.button>
    )
  }

  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'group relative overflow-hidden rounded-2xl',
        'bg-white shadow-medium',
        'hover:shadow-strong',
        'transition-shadow duration-300',
        onClick && 'cursor-pointer'
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={species.image}
          alt={species.commonName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay con categoría */}
        <div className="absolute top-3 left-3">
          <Badge variant="info" size="sm">
            {categoryLabels[species.category]}
          </Badge>
        </div>

        {/* Estado de conservación */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: threatStatusColors[species.threatStatus] }}
        >
          <AlertCircle className="w-3 h-3" />
          {species.threatStatus}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-choco-sand-900 mb-1">
          {species.commonName}
        </h3>

        <p className="text-sm text-choco-sand-600 italic mb-2">
          {species.scientificName}
        </p>

        {species.commonNameLocal && (
          <p className="text-sm text-choco-pacific-600 mb-2">
            "{species.commonNameLocal}"
          </p>
        )}

        <p className="text-sm text-choco-sand-700 line-clamp-2 mb-3">
          {species.description}
        </p>

        {/* Datos adicionales */}
        <div className="flex items-center gap-2 text-sm text-choco-sand-600">
          <MapPin className="w-4 h-4" />
          <span>{species.habitat}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {species.endemic && (
            <Badge variant="warning" size="sm">
              Endémica del Chocó
            </Badge>
          )}
          <Badge variant="default" size="sm">
            {threatStatusLabels[species.threatStatus]}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}
