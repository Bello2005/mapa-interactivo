// src/components/trivia/TriviaResults.tsx
// Pantalla de resultados de la trivia

import { motion } from 'framer-motion'
import { Trophy, Award, RotateCcw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import type { TriviaQuestion } from '../../types'
import { Button } from '@components/atoms/Button'
import { useGameProgress } from '@hooks/useGameProgress'
import { BadgeCard } from '@components/molecules/BadgeCard'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'
import { ScoreHistory } from './ScoreHistory'
import { useTriviaStore } from '@stores/triviaStore'
import { getUserName } from '@utils/storage'

interface TriviaResultsProps {
  questions: TriviaQuestion[]
  answers: (number | null)[]
  score: number
  onRestart: () => void
  sectionId?: string | null
}

export function TriviaResults({
  questions,
  answers,
  score,
  onRestart,
  sectionId,
}: TriviaResultsProps) {
  const { finishTrivia, progress, newBadges } = useGameProgress()
  const language = useUIStore((state) => state.language)
  const translations = t(language)
  const { saveSectionScore, getSectionScores } = useTriviaStore()
  const userName = getUserName() || 'Anónimo'

  // Calcular estadísticas
  const correctAnswers = answers.filter(
    (answer, index) => answer === questions[index]?.correctAnswer
  ).length

  const totalQuestions = questions.length
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  // Guardar progreso cuando se monta el componente
  useEffect(() => {
    finishTrivia(score)
    
    // Guardar puntuación de sección si hay sectionId
    if (sectionId) {
      saveSectionScore(sectionId, score, correctAnswers, totalQuestions)
    }
  }, [sectionId, score, correctAnswers, totalQuestions, finishTrivia, saveSectionScore])

  // Mensaje según el desempeño
  const getMessage = () => {
    if (percentage >= 90) return translations.trivia.results.messages.excellent
    if (percentage >= 70) return translations.trivia.results.messages.veryGood
    if (percentage >= 50) return translations.trivia.results.messages.good
    return translations.trivia.results.messages.keepLearning
  }

  const getColor = () => {
    if (percentage >= 70) return 'gold'
    if (percentage >= 50) return 'pacific'
    return 'sand'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto"
    >
      {/* Card principal de resultados */}
      <div className="bg-white rounded-3xl shadow-strong p-8 md:p-12 text-center mb-8">
        {/* Icono */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`w-24 h-24 rounded-full bg-gradient-${getColor()} flex items-center justify-center mx-auto mb-6 shadow-glow-${getColor()}`}
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>

        {/* Mensaje */}
        <h2 className="font-display font-bold text-3xl md:text-4xl text-choco-sand-900 mb-2">
          ¡Felicidades{userName !== 'Anónimo' ? `, ${userName}` : ''}!
        </h2>
        <p className="text-xl text-choco-sand-700 mb-8">
          {getMessage()}
        </p>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-choco-pacific-50 rounded-2xl p-4">
            <div className="font-display font-bold text-3xl text-choco-pacific-700 mb-1">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-choco-sand-600">{translations.trivia.results.correctAnswers}</div>
          </div>

          <div className="bg-choco-gold-50 rounded-2xl p-4">
            <div className="font-display font-bold text-3xl text-choco-gold-700 mb-1">
              {percentage}%
            </div>
            <div className="text-sm text-choco-sand-600">{translations.trivia.results.percentage}</div>
          </div>

          <div className="bg-choco-forest-50 rounded-2xl p-4">
            <div className="font-display font-bold text-3xl text-choco-forest-700 mb-1">
              {score}
            </div>
            <div className="text-sm text-choco-sand-600">{translations.trivia.results.score}</div>
          </div>

          <div className="bg-choco-sand-100 rounded-2xl p-4">
            <div className="font-display font-bold text-3xl text-choco-sand-700 mb-1">
              {progress.totalPoints}
            </div>
            <div className="text-sm text-choco-sand-600">{translations.trivia.results.total}</div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onRestart}
            variant="primary"
            size="lg"
            fullWidth
            icon={<RotateCcw className="w-5 h-5" />}
          >
            {translations.trivia.results.restart}
          </Button>

          <Link to="/" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              icon={<Home className="w-5 h-5" />}
            >
              {translations.trivia.results.backHome}
            </Button>
          </Link>
        </div>
      </div>

      {/* Badges desbloqueados */}
      {newBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-strong p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-choco-gold-600" />
            <h3 className="font-display font-bold text-2xl text-choco-sand-900">
              {translations.trivia.results.newBadges.replace('{plural}', newBadges.length > 1 ? 's' : '')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                showAnimation
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Historial de puntuaciones */}
      {sectionId && (
        <ScoreHistory
          sectionId={sectionId}
          currentScore={score}
          currentCorrectAnswers={correctAnswers}
          currentTotalQuestions={totalQuestions}
          scores={getSectionScores(sectionId)}
        />
      )}

      {/* Resumen por pregunta */}
      <div className="bg-white rounded-3xl shadow-strong p-8">
        <h3 className="font-display font-bold text-2xl text-choco-sand-900 mb-6">
          {translations.trivia.results.summary}
        </h3>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = answers[index]
            const isCorrect = userAnswer === question.correctAnswer

            return (
              <div
                key={question.id}
                className={`p-4 rounded-xl border-2 ${
                  isCorrect
                    ? 'bg-choco-forest-50 border-choco-forest-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isCorrect
                        ? 'bg-choco-forest-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-choco-sand-900 mb-2">
                      {question.question}
                    </div>

                    <div className="text-sm text-choco-sand-700">
                      <span className="font-medium">{translations.trivia.results.yourAnswer}</span>{' '}
                      {userAnswer !== null ? question.options[userAnswer] : translations.trivia.results.noAnswer}
                    </div>

                    {!isCorrect && (
                      <div className="text-sm text-choco-sand-700 mt-1">
                        <span className="font-medium">{translations.trivia.results.correctAnswer}</span>{' '}
                        {question.options[question.correctAnswer]}
                      </div>
                    )}
                  </div>

                  <div className={`flex-shrink-0 font-bold ${
                    isCorrect ? 'text-choco-forest-700' : 'text-red-700'
                  }`}>
                    {isCorrect ? `+${question.points}` : '0'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
