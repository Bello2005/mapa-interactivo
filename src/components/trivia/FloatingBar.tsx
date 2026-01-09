// src/components/trivia/FloatingBar.tsx
// Barra flotante que muestra el resumen de la selección múltiple

import { motion } from 'framer-motion'
import { Play, FileText, Clock, Trophy } from 'lucide-react'
import { Button } from '@components/atoms/Button'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

interface FloatingBarProps {
  questionsCount: number
  estimatedTime: number
  maxPoints: number
  onStart: () => void
}

export function FloatingBar({
  questionsCount,
  estimatedTime,
  maxPoints,
  onStart,
}: FloatingBarProps) {
  const language = useUIStore((state) => state.language)
  const translations = t(language)
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed z-50
                 bg-white shadow-2xl border-2 border-choco-forest-500
                 flex items-center

                 /* Mobile */
                 bottom-0 left-0 right-0
                 rounded-t-3xl px-4 py-4
                 flex-col gap-3

                 /* Desktop */
                 md:bottom-6 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2
                 md:rounded-full md:px-6 md:py-4
                 md:flex-row md:gap-6
                 md:max-w-2xl md:w-auto"
    >
      {/* Métricas */}
      <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center w-full md:w-auto">
        <div className="flex items-center gap-2 px-3 py-2 bg-choco-pacific-50 rounded-full">
          <FileText className="w-4 h-4 text-choco-pacific-600" />
          <span className="text-xs md:text-sm font-semibold text-choco-pacific-700">
            {questionsCount} {questionsCount === 1 ? translations.trivia.question : translations.trivia.questions}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-choco-gold-50 rounded-full">
          <Clock className="w-4 h-4 text-choco-gold-600" />
          <span className="text-xs md:text-sm font-semibold text-choco-gold-700">
            ~{estimatedTime} {translations.trivia.minutes.toLowerCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-choco-forest-50 rounded-full">
          <Trophy className="w-4 h-4 text-choco-forest-600" />
          <span className="text-xs md:text-sm font-semibold text-choco-forest-700">
            {maxPoints} {translations.trivia.maxPoints.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Botón de inicio */}
      <Button
        onClick={onStart}
        variant="primary"
        size="lg"
        icon={<Play className="w-5 h-5" />}
        iconPosition="right"
        className="shadow-lg hover:shadow-xl transition-shadow w-full md:w-auto"
      >
        {translations.trivia.start}
      </Button>
    </motion.div>
  )
}
