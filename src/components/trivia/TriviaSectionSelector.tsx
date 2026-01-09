// src/components/trivia/TriviaSectionSelector.tsx
// Selector visual de secciones de trivia

import { motion, AnimatePresence } from 'framer-motion'
import type { TriviaSection } from '../../types'
import { BookOpen, MapPin, Bird, Trees, Shield, Users, Trophy, Sparkles, Check, X, Mountain } from 'lucide-react'
import clsx from 'clsx'
import { useTriviaStore } from '@stores/triviaStore'
import { getUserName } from '@utils/storage'
import { FloatingBar } from './FloatingBar'
import { FilterChip } from './FilterChip'
import { useState, useMemo } from 'react'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

interface TriviaSectionSelectorProps {
  sections: TriviaSection[]
  selectedSectionIds: string[]
  onSelectSection: (sectionIds: string[]) => void
  onStartTrivia: () => void
}

// Emojis temáticos del Chocó Biogeográfico
const sectionEmojis: Record<string, string> = {
  geografia: '🗺️',
  fauna: '🦜',      // Loro - emblemático del Chocó
  flora: '🌺',      // Flor tropical
  conservacion: '🌿', // Hoja - conservación
  cultura: '🎭',    // Máscara cultural
  runap: '🏞️',     // Parques Nacionales
  'admin-boundaries': '🏘️', // Municipios
  'resguardos-indigenas': '🪶', // Resguardos Indígenas
  'comunidades-negras': '👥', // Comunidades Negras
}

const sectionIcons: Record<string, typeof BookOpen> = {
  geografia: MapPin,
  fauna: Bird,
  flora: Trees,
  conservacion: Shield,
  cultura: Users,
  runap: Mountain,
  'admin-boundaries': MapPin,
  'resguardos-indigenas': Users,
  'comunidades-negras': Users,
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
  runap: {
    bg: 'bg-choco-forest-50',
    border: 'border-choco-forest-500',
    text: 'text-choco-forest-700',
  },
  'admin-boundaries': {
    bg: 'bg-choco-pacific-50',
    border: 'border-choco-pacific-500',
    text: 'text-choco-pacific-700',
  },
  'resguardos-indigenas': {
    bg: 'bg-choco-gold-50',
    border: 'border-choco-gold-500',
    text: 'text-choco-gold-700',
  },
  'comunidades-negras': {
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
  runap: {
    bg: 'bg-choco-forest-500',
    text: 'text-white',
  },
  'admin-boundaries': {
    bg: 'bg-choco-pacific-500',
    text: 'text-white',
  },
  'resguardos-indigenas': {
    bg: 'bg-choco-gold-500',
    text: 'text-white',
  },
  'comunidades-negras': {
    bg: 'bg-choco-pacific-500',
    text: 'text-white',
  },
}

export function TriviaSectionSelector({
  sections,
  selectedSectionIds,
  onSelectSection,
  onStartTrivia,
}: TriviaSectionSelectorProps) {
  const [showAll, setShowAll] = useState(false)
  const language = useUIStore((state) => state.language)
  const translations = t(language)
  const [difficultyFilter, setDifficultyFilter] = useState<string>(translations.trivia.all)
  const [statusFilter, setStatusFilter] = useState<string>(translations.trivia.all)
  const { getPersonalBest } = useTriviaStore()
  const userName = getUserName()

  // Progressive disclosure: mostrar solo 5 secciones individuales + 1 "Todas" = 6 tarjetas totales
  const INITIAL_DISPLAY_COUNT = 5

  const getSectionBestScore = (sectionId: string) => {
    if (!userName) return null
    return getPersonalBest(sectionId)
  }

  const hasAttemptedSection = (sectionId: string) => {
    return getSectionBestScore(sectionId) !== null
  }

  const getAverageDifficulty = (section: TriviaSection) => {
    if (section.questions.length === 0) return 'facil'
    const difficulties = section.questions.map(q => {
      if (q.difficulty === 'facil') return 1
      if (q.difficulty === 'medio') return 2
      return 3
    })
    const avg = difficulties.reduce((a, b) => a + b, 0) / difficulties.length
    if (avg < 1.5) return 'facil'
    if (avg < 2.5) return 'medio'
    return 'dificil'
  }

  // Aplicar filtros
  const filteredSections = useMemo(() => {
    return sections.filter(section => {
      // Filtro de dificultad
      if (difficultyFilter !== translations.trivia.all) {
        const avgDiff = getAverageDifficulty(section)
        const diffMap: Record<string, string> = {
          [translations.trivia.easy]: 'facil',
          [translations.trivia.medium]: 'medio',
          [translations.trivia.hard]: 'dificil',
        }
        if (avgDiff !== diffMap[difficultyFilter]) return false
      }

      // Filtro de estado
      if (statusFilter !== translations.trivia.all) {
        const hasAttempted = hasAttemptedSection(section.id)
        if (statusFilter === translations.trivia.new && hasAttempted) return false
        if (statusFilter === translations.trivia.completed && !hasAttempted) return false
      }

      return true
    })
  }, [sections, difficultyFilter, statusFilter, translations])

  const displayedSections = showAll ? filteredSections : filteredSections.slice(0, INITIAL_DISPLAY_COUNT)

  const toggleSection = (sectionId: string | null) => {
    if (sectionId === null) {
      // "Todas las secciones" - seleccionar/deseleccionar todas
      if (selectedSectionIds.length === filteredSections.length) {
        onSelectSection([])
      } else {
        onSelectSection(filteredSections.map(s => s.id))
      }
    } else {
      // Toggle individual section
      if (selectedSectionIds.includes(sectionId)) {
        onSelectSection(selectedSectionIds.filter(id => id !== sectionId))
      } else {
        onSelectSection([...selectedSectionIds, sectionId])
      }
    }
  }

  const clearFilters = () => {
    setDifficultyFilter(translations.trivia.all)
    setStatusFilter(translations.trivia.all)
  }

  const hasActiveFilters = difficultyFilter !== translations.trivia.all || statusFilter !== translations.trivia.all

  // Calcular métricas
  const selectedSections = sections.filter(s => selectedSectionIds.includes(s.id))
  const totalQuestions = selectedSections.reduce((sum, s) => sum + s.questions.length, 0)
  const estimatedTime = Math.ceil(totalQuestions * 1.5)
  const maxPoints = selectedSections.reduce((sum, s) =>
    sum + s.questions.reduce((qSum, q) => qSum + q.points, 0), 0
  )

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-choco-sand-900 text-center mb-6">
        {translations.trivia.selectSection}
      </h3>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 justify-center items-center mb-4">
        <FilterChip
          label={translations.trivia.difficulty}
          options={[translations.trivia.all, translations.trivia.easy, translations.trivia.medium, translations.trivia.hard]}
          value={difficultyFilter}
          onChange={setDifficultyFilter}
        />

        <FilterChip
          label={translations.trivia.status}
          options={[translations.trivia.all, translations.trivia.new, translations.trivia.completed]}
          value={statusFilter}
          onChange={setStatusFilter}
        />

        {hasActiveFilters && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-choco-sand-500 hover:text-choco-sand-700 transition-colors"
          >
            <X className="w-4 h-4" />
            {translations.trivia.clearFilters}
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Opción: Todas las secciones */}
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggleSection(null)}
          className={clsx(
            'p-6 rounded-xl border-2 transition-all text-left relative',
            selectedSectionIds.length === sections.length
              ? 'border-choco-forest-500 bg-choco-forest-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-choco-forest-300 hover:bg-choco-forest-50/50'
          )}
        >
          {/* Checkbox visual */}
          {selectedSectionIds.length === sections.length && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-choco-forest-500 rounded-full flex items-center justify-center animate-scale-in">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              selectedSectionIds.length === sections.length
                ? 'bg-choco-forest-500 text-white'
                : 'bg-gray-100 text-gray-600'
            )}>
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-choco-sand-900">
              {translations.trivia.allQuestions}
            </h4>
          </div>
          <p className="text-sm text-choco-sand-600">
            {translations.trivia.allQuestionsDescription.replace('{count}', sections.reduce((sum, s) => sum + s.questions.length, 0).toString())}
          </p>
        </motion.button>

        {/* Secciones individuales */}
        {displayedSections.map((section) => {
          const Icon = sectionIcons[section.id] || BookOpen
          const emoji = sectionEmojis[section.id] || '📚'
          const colors = sectionColors[section.id] || sectionColors.cultura
          const iconColors = sectionIconColors[section.id] || sectionIconColors.cultura
          const isSelected = selectedSectionIds.includes(section.id)
          const bestScore = getSectionBestScore(section.id)
          const hasAttempted = hasAttemptedSection(section.id)
          const avgDifficulty = getAverageDifficulty(section)

          return (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSection(section.id)}
              className={clsx(
                'p-6 rounded-xl border-2 transition-all text-left relative',
                isSelected
                  ? `${colors.border} ${colors.bg} shadow-md`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* Emoji decorativo grande */}
              <div className="absolute top-4 left-4 text-4xl opacity-20 pointer-events-none select-none">
                {emoji}
              </div>

              {/* Checkbox visual cuando está seleccionado */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center animate-scale-in',
                    iconColors.bg
                  )}>
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>
              )}

              {/* Badge "Nuevo" si no se ha intentado y NO está seleccionado */}
              {!hasAttempted && !isSelected && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {translations.trivia.new}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  isSelected
                    ? `${iconColors.bg} ${iconColors.text}`
                    : 'bg-gray-100 text-gray-600'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base text-choco-sand-900">
                    {section.name}
                  </h4>
                  {bestScore && (
                    <div className="flex items-center gap-1 mt-1">
                      <Trophy className="w-3 h-3 text-choco-gold-600" />
                      <span className="text-xs font-semibold text-choco-gold-700">
                        {translations.trivia.bestScore.replace('{score}', bestScore.score.toString())}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {section.description && (
                <p className="text-sm text-choco-sand-600 mb-2">
                  {section.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-choco-sand-500">
                  {section.questions.length} {section.questions.length === 1 ? translations.trivia.question : translations.trivia.questions}
                </p>
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  avgDifficulty === 'facil' && 'bg-green-100 text-green-700',
                  avgDifficulty === 'medio' && 'bg-yellow-100 text-yellow-700',
                  avgDifficulty === 'dificil' && 'bg-red-100 text-red-700'
                )}>
                  {avgDifficulty === 'facil' ? translations.trivia.easy : avgDifficulty === 'medio' ? translations.trivia.medium : translations.trivia.hard}
                </span>
              </div>
            </motion.button>
          )
        })}

        {/* Botón "Ver todas las categorías" */}
        {!showAll && filteredSections.length > INITIAL_DISPLAY_COUNT && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAll(true)}
            className="col-span-full mx-auto flex items-center gap-2 text-choco-pacific-600 hover:text-choco-pacific-700 font-medium py-4 px-6 rounded-xl hover:bg-choco-pacific-50 transition-colors"
          >
            <span>{translations.trivia.seeAllCategories} ({filteredSections.length})</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Barra flotante con resumen */}
      <AnimatePresence>
        {selectedSectionIds.length > 0 && (
          <FloatingBar
            questionsCount={totalQuestions}
            estimatedTime={estimatedTime}
            maxPoints={maxPoints}
            onStart={onStartTrivia}
          />
        )}
      </AnimatePresence>
    </div>
  )
}






