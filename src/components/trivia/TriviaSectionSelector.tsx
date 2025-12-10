// src/components/trivia/TriviaSectionSelector.tsx
// Selector visual de secciones de trivia

import { motion } from 'framer-motion'
import type { TriviaSection } from '../../types'
import { BookOpen, MapPin, Bird, Trees, Shield, Users } from 'lucide-react'
import clsx from 'clsx'

interface TriviaSectionSelectorProps {
  sections: TriviaSection[]
  selectedSectionId: string | null
  onSelectSection: (sectionId: string | null) => void
}

const sectionIcons: Record<string, typeof BookOpen> = {
  geografia: MapPin,
  fauna: Bird,
  flora: Trees,
  conservacion: Shield,
  cultura: Users,
}

const sectionColors: Record<string, { bg: string; border: string; text: string }> = {
  geografia: {
    bg: 'bg-choco-pacific-50',
    border: 'border-choco-pacific-500',
    text: 'text-choco-pacific-700',
  },
  fauna: {
    bg: 'bg-choco-forest-50',
    border: 'border-choco-forest-500',
    text: 'text-choco-forest-700',
  },
  flora: {
    bg: 'bg-choco-gold-50',
    border: 'border-choco-gold-500',
    text: 'text-choco-gold-700',
  },
  conservacion: {
    bg: 'bg-choco-forest-50',
    border: 'border-choco-forest-500',
    text: 'text-choco-forest-700',
  },
  cultura: {
    bg: 'bg-choco-pacific-50',
    border: 'border-choco-pacific-500',
    text: 'text-choco-pacific-700',
  },
}

const sectionIconColors: Record<string, { bg: string; text: string }> = {
  geografia: {
    bg: 'bg-choco-pacific-500',
    text: 'text-white',
  },
  fauna: {
    bg: 'bg-choco-forest-500',
    text: 'text-white',
  },
  flora: {
    bg: 'bg-choco-gold-500',
    text: 'text-white',
  },
  conservacion: {
    bg: 'bg-choco-forest-500',
    text: 'text-white',
  },
  cultura: {
    bg: 'bg-choco-pacific-500',
    text: 'text-white',
  },
}

export function TriviaSectionSelector({
  sections,
  selectedSectionId,
  onSelectSection,
}: TriviaSectionSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-choco-sand-900 text-center mb-4">
        Selecciona una sección
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Opción: Todas las secciones */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectSection(null)}
          className={clsx(
            'p-4 rounded-xl border-2 transition-all text-left',
            selectedSectionId === null
              ? 'border-choco-forest-500 bg-choco-forest-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-choco-forest-300 hover:bg-choco-forest-50/50'
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              selectedSectionId === null
                ? 'bg-choco-forest-500 text-white'
                : 'bg-gray-100 text-gray-600'
            )}>
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-choco-sand-900">
              Todas las Preguntas
            </h4>
          </div>
          <p className="text-sm text-choco-sand-600">
            {sections.reduce((sum, s) => sum + s.questions.length, 0)} preguntas de todas las categorías
          </p>
        </motion.button>

        {/* Secciones individuales */}
        {sections.map((section) => {
          const Icon = sectionIcons[section.id] || BookOpen
          const colors = sectionColors[section.id] || sectionColors.cultura
          const iconColors = sectionIconColors[section.id] || sectionIconColors.cultura
          const isSelected = selectedSectionId === section.id

          return (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSection(section.id)}
              className={clsx(
                'p-4 rounded-xl border-2 transition-all text-left',
                isSelected
                  ? `${colors.border} ${colors.bg} shadow-md`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  isSelected
                    ? `${iconColors.bg} ${iconColors.text}`
                    : 'bg-gray-100 text-gray-600'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-choco-sand-900">
                  {section.name}
                </h4>
              </div>
              {section.description && (
                <p className="text-sm text-choco-sand-600 mb-2">
                  {section.description}
                </p>
              )}
              <p className="text-xs font-semibold text-choco-sand-500">
                {section.questions.length} pregunta{section.questions.length !== 1 ? 's' : ''}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

