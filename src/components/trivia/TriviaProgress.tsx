// src/components/trivia/TriviaProgress.tsx
// Barra de progreso de la trivia

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { ProgressBar } from '@components/atoms/ProgressBar'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

interface TriviaProgressProps {
  current: number
  total: number
  score: number
}

export function TriviaProgress({ current, total, score }: TriviaProgressProps) {
  const language = useUIStore((state) => state.language)
  const translations = t(language)
  const percentage = Math.round((current / total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-medium p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-choco-sand-600 mb-1">{translations.trivia.progress}</div>
          <motion.div
            key={current}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-bold text-xl text-choco-sand-900"
          >
            {translations.trivia.questionOf.replace('{current}', current.toString()).replace('{total}', total.toString())}
          </motion.div>
          <div className="text-xs text-choco-sand-500 mt-1">{percentage}% completado</div>
        </div>

        <motion.div
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-3"
        >
          <Award className="w-6 h-6 text-choco-gold-600" />
          <div>
            <div className="text-sm text-choco-sand-600">{translations.trivia.points}</div>
            <div className="font-bold text-xl text-choco-gold-700">{score}</div>
          </div>
        </motion.div>
      </div>

      <ProgressBar
        value={current}
        max={total}
        color="pacific"
        size="lg"
      />
    </motion.div>
  )
}
