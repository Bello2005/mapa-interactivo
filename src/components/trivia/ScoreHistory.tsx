// src/components/trivia/ScoreHistory.tsx
// Componente para mostrar historial personal de puntuaciones

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Calendar } from 'lucide-react'
import type { SectionScore } from '@utils/storage'
import { getUserName } from '@utils/storage'
import clsx from 'clsx'

interface ScoreHistoryProps {
  sectionId?: string
  currentScore: number
  currentCorrectAnswers: number
  currentTotalQuestions?: number
  scores: SectionScore[]
}

export function ScoreHistory({
  currentScore,
  currentCorrectAnswers,
  scores,
}: ScoreHistoryProps) {
  const userName = getUserName() || 'Anónimo'

  // Filtrar solo las puntuaciones del usuario actual
  const userScores = useMemo(() => {
    return scores.filter(s => s.userName === userName).slice(0, 5) // Últimas 5
  }, [scores, userName])

  // Encontrar mejor puntuación
  const bestScore = useMemo(() => {
    if (userScores.length === 0) return null
    return userScores.reduce((best, current) => {
      if (current.score > best.score) return current
      if (current.score === best.score && current.correctAnswers > best.correctAnswers) return current
      return best
    }, userScores[0])
  }, [userScores])

  // Comparar con mejor puntuación anterior (excluyendo la actual si es la mejor)
  const previousBest = useMemo(() => {
    if (!bestScore) return null
    // Excluir la mejor puntuación si es la actual
    const isCurrentBest = bestScore.score === currentScore && 
      bestScore.correctAnswers === currentCorrectAnswers &&
      Math.abs(bestScore.date - Date.now()) < 5000 // Dentro de 5 segundos (puntuación recién guardada)
    
    if (!isCurrentBest) return null
    
    // Buscar la segunda mejor puntuación
    const otherScores = userScores.filter(
      s => !(s.score === bestScore.score && s.correctAnswers === bestScore.correctAnswers && Math.abs(s.date - bestScore.date) < 1000)
    )
    if (otherScores.length === 0) return null
    return otherScores.reduce((best, current) => {
      if (current.score > best.score) return current
      if (current.score === best.score && current.correctAnswers > best.correctAnswers) return current
      return best
    }, otherScores[0])
  }, [userScores, currentScore, currentCorrectAnswers, bestScore])

  const isNewRecord = bestScore && 
    bestScore.score === currentScore && 
    bestScore.correctAnswers === currentCorrectAnswers &&
    Math.abs(bestScore.date - Date.now()) < 5000 // Dentro de 5 segundos
  const improvement = previousBest ? currentScore - previousBest.score : null

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (userScores.length === 0 && !isNewRecord) {
    return null // No mostrar si no hay historial
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl shadow-strong p-6 md:p-8 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-choco-gold-600" />
        <h3 className="font-display font-bold text-xl text-choco-sand-900">
          Tu Historial
        </h3>
      </div>

      {/* Mensaje de récord o mejora */}
      {isNewRecord && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-choco-gold-50 to-choco-pacific-50 rounded-xl border-2 border-choco-gold-300"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-choco-gold-600" />
            <span className="font-bold text-choco-gold-700">¡Nuevo récord personal!</span>
          </div>
          <p className="text-sm text-choco-sand-700">
            Has alcanzado tu mejor puntuación en esta sección: {currentScore} puntos
          </p>
        </motion.div>
      )}

      {improvement && improvement > 0 && !isNewRecord && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 bg-choco-forest-50 rounded-xl border-2 border-choco-forest-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-choco-forest-600" />
            <span className="font-bold text-choco-forest-700">¡Mejoraste!</span>
          </div>
          <p className="text-sm text-choco-sand-700">
            Has mejorado {improvement} puntos respecto a tu mejor marca anterior
          </p>
        </motion.div>
      )}

      {/* Tabla de historial */}
      {userScores.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-choco-sand-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-choco-sand-700">
                  Fecha
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-choco-sand-700">
                  Puntuación
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-choco-sand-700">
                  Correctas
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-choco-sand-700">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody>
              {userScores.map((score, index) => {
                const percentage = Math.round((score.correctAnswers / score.totalQuestions) * 100)
                const isBest = bestScore && score.score === bestScore.score && score.correctAnswers === bestScore.correctAnswers && Math.abs(score.date - bestScore.date) < 1000
                const isCurrent = Math.abs(score.date - Date.now()) < 5000 // Dentro de 5 segundos

                return (
                  <motion.tr
                    key={score.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={clsx(
                      'border-b border-choco-sand-100',
                      isCurrent && 'bg-choco-pacific-50',
                      isBest && !isCurrent && 'bg-choco-gold-50'
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-choco-sand-400" />
                        <span className="text-sm text-choco-sand-700">
                          {formatDate(score.date)}
                        </span>
                        {isCurrent && (
                          <span className="text-xs px-2 py-0.5 bg-choco-pacific-500 text-white rounded-full">
                            Actual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          'font-bold',
                          isBest ? 'text-choco-gold-700' : 'text-choco-sand-900'
                        )}>
                          {score.score}
                        </span>
                        {isBest && !isCurrent && (
                          <Trophy className="w-4 h-4 text-choco-gold-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-choco-sand-700">
                      {score.correctAnswers}/{score.totalQuestions}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          'text-sm font-semibold',
                          percentage >= 70 ? 'text-choco-forest-700' :
                          percentage >= 50 ? 'text-choco-gold-700' :
                          'text-choco-sand-700'
                        )}>
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {userScores.length === 0 && (
        <div className="text-center py-8 text-choco-sand-500">
          <p className="text-sm">Esta es tu primera vez en esta sección. ¡Sigue así!</p>
        </div>
      )}
    </motion.div>
  )
}
