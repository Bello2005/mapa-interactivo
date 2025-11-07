// src/components/trivia/TriviaQuestion.tsx
// Componente para mostrar una pregunta individual

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, Info } from 'lucide-react'
import clsx from 'clsx'
import type { TriviaQuestion as TriviaQuestionType } from '@types/index'
import { useTriviaStore } from '@stores/triviaStore'
import { Button } from '@components/atoms/Button'
import { Badge } from '@components/atoms/Badge'
import { categoryLabels } from '@utils/colors'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

interface TriviaQuestionProps {
  question: TriviaQuestionType
  questionNumber: number
  totalQuestions: number
}

export function TriviaQuestion({
  question,
  questionNumber,
  totalQuestions,
}: TriviaQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const language = useUIStore((state) => state.language)
  const translations = t(language)

  const { answerQuestion, nextQuestion, addPoints, completeTrivia, answers } = useTriviaStore()

  const currentAnswer = answers[questionNumber - 1]
  const hasAnswered = currentAnswer !== null

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return
    setSelectedAnswer(index)
  }

  const handleConfirm = () => {
    if (selectedAnswer === null) return

    answerQuestion(selectedAnswer)

    // Añadir puntos si es correcta
    if (selectedAnswer === question.correctAnswer) {
      addPoints(question.points)
    }

    setShowExplanation(true)
  }

  const handleNext = () => {
    if (questionNumber < totalQuestions) {
      nextQuestion()
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      completeTrivia()
    }
  }

  const isCorrect = hasAnswered && currentAnswer === question.correctAnswer

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-3xl shadow-strong p-6 md:p-10 mt-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Badge variant="info" size="md">
            {question.category}
          </Badge>
          <Badge variant="warning" size="md" className="ml-2">
            {question.difficulty}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-sm text-choco-sand-600">{translations.trivia.points}</div>
          <div className="font-bold text-2xl text-choco-gold-600">
            +{question.points}
          </div>
        </div>
      </div>

      {/* Pregunta */}
      <h3 className="font-display font-bold text-2xl md:text-3xl text-choco-sand-900 mb-6">
        {question.question}
      </h3>

      {/* Imagen (si existe) */}
      {question.imageUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden">
          <img
            src={question.imageUrl}
            alt="Imagen de la pregunta"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Opciones */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index || currentAnswer === index
          const isCorrectAnswer = index === question.correctAnswer
          const showCorrect = hasAnswered && isCorrectAnswer
          const showIncorrect = hasAnswered && currentAnswer === index && !isCorrect

          return (
            <motion.button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={hasAnswered}
              whileHover={hasAnswered ? {} : { scale: 1.01 }}
              whileTap={hasAnswered ? {} : { scale: 0.99 }}
              className={clsx(
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                hasAnswered && 'cursor-default',
                !hasAnswered && 'hover:border-choco-pacific-500 hover:bg-choco-pacific-50',
                isSelected && !hasAnswered && 'border-choco-pacific-500 bg-choco-pacific-50',
                showCorrect && 'border-choco-forest-500 bg-choco-forest-50',
                showIncorrect && 'border-red-500 bg-red-50',
                !isSelected && !showCorrect && !showIncorrect && 'border-choco-sand-200'
              )}
            >
              {/* Indicador */}
              <div
                className={clsx(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all',
                  isSelected && !hasAnswered && 'bg-choco-pacific-500 text-white',
                  showCorrect && 'bg-choco-forest-500 text-white',
                  showIncorrect && 'bg-red-500 text-white',
                  !isSelected && !showCorrect && !showIncorrect && 'bg-choco-sand-100 text-choco-sand-700'
                )}
              >
                {showCorrect ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : showIncorrect ? (
                  <X className="w-5 h-5" strokeWidth={3} />
                ) : (
                  String.fromCharCode(65 + index) // A, B, C, D
                )}
              </div>

              {/* Texto */}
              <div className="flex-1 text-base md:text-lg text-choco-sand-900">
                {option}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Explicación */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={clsx(
              'mb-6 p-4 rounded-xl border-2',
              isCorrect
                ? 'bg-choco-forest-50 border-choco-forest-200'
                : 'bg-blue-50 border-blue-200'
            )}
          >
            <div className="flex items-start gap-3">
              <Info className={clsx(
                'w-5 h-5 flex-shrink-0 mt-0.5',
                isCorrect ? 'text-choco-forest-600' : 'text-blue-600'
              )} />
              <div>
                <div className={clsx(
                  'font-semibold mb-1',
                  isCorrect ? 'text-choco-forest-700' : 'text-blue-700'
                )}>
                  {isCorrect ? translations.trivia.correct : translations.trivia.incorrect}
                </div>
                <div className="text-sm text-choco-sand-700">
                  {question.explanation}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acciones */}
      <div className="flex gap-3">
        {!hasAnswered ? (
          <Button
            onClick={handleConfirm}
            disabled={selectedAnswer === null}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Check className="w-5 h-5" />}
            iconPosition="right"
          >
            {translations.trivia.confirm}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="primary"
            size="lg"
            fullWidth
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            {questionNumber < totalQuestions ? translations.trivia.next : translations.trivia.viewResults}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
