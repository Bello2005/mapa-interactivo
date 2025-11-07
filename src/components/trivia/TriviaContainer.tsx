// src/components/trivia/TriviaContainer.tsx
// Contenedor principal de la trivia

import { useEffect, useState } from 'react'
import type React from 'react'
import { motion } from 'framer-motion'
import type { TriviaQuestion } from '@types/index'
import { useTriviaStore } from '@stores/triviaStore'
import { TriviaQuestion as TriviaQuestionComponent } from './TriviaQuestion'
import { TriviaResults } from './TriviaResults'
import { TriviaProgress } from './TriviaProgress'
import { Button } from '@components/atoms/Button'
import { Play, RotateCcw } from 'lucide-react'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

export function TriviaContainer() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const language = useUIStore((state) => state.language)
  const translations = t(language)

  const {
    currentQuestionIndex,
    answers,
    score,
    completed,
    startTime,
    startTrivia,
    reset,
    loadSavedState,
  } = useTriviaStore()

  // Cargar preguntas
  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch('/data/trivia.json')
        const data = await response.json()
        setQuestions(data)
      } catch (error) {
        console.error('Error loading trivia questions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
    loadSavedState()
  }, [loadSavedState])

  // Limpiar estado guardado si la trivia está completada
  useEffect(() => {
    if (completed) {
      // Opcional: limpiar después de mostrar resultados
      // reset()
    }
  }, [completed])

  const handleStart = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (questions.length === 0) {
      console.error('No hay preguntas cargadas')
      alert('No hay preguntas disponibles. Por favor, recarga la página.')
      return
    }
    
    console.log('Iniciando trivia con', questions.length, 'preguntas')
    console.log('Estado antes de iniciar:', { currentQuestionIndex, answers, completed })
    
    try {
      startTrivia(questions.length)
      console.log('Trivia iniciada correctamente')
    } catch (error) {
      console.error('Error al iniciar trivia:', error)
      alert('Error al iniciar la trivia. Por favor, intenta de nuevo.')
    }
  }

  const handleRestart = () => {
    reset()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-choco-pacific-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-choco-sand-700 font-medium">{translations.trivia.loading}</p>
        </div>
      </div>
    )
  }

  // Pantalla de inicio - mostrar solo si la trivia NO ha comenzado
  // La trivia ha comenzado si startTime > 0
  const hasTriviaStarted = startTime > 0
  const shouldShowStartScreen = !hasTriviaStarted && !completed && !loading
  
  if (shouldShowStartScreen) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12"
      >
        <div className="bg-white rounded-3xl shadow-strong p-8 md:p-12">
          <div className="w-20 h-20 bg-gradient-pacific rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-white" />
          </div>

          <h2 className="font-display font-bold text-3xl md:text-4xl text-choco-sand-900 mb-4">
            {translations.trivia.ready}
          </h2>

          <p className="text-lg text-choco-sand-700 mb-8">
            {translations.trivia.readyDescription.replace('{count}', questions.length.toString())}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-choco-pacific-50 rounded-xl p-4">
              <div className="font-display font-bold text-2xl text-choco-pacific-700 mb-1">
                {questions.length}
              </div>
              <div className="text-sm text-choco-sand-600">{translations.trivia.questions}</div>
            </div>
            <div className="bg-choco-gold-50 rounded-xl p-4">
              <div className="font-display font-bold text-2xl text-choco-gold-700 mb-1">
                {questions.reduce((sum, q) => sum + q.points, 0)}
              </div>
              <div className="text-sm text-choco-sand-600">{translations.trivia.maxPoints}</div>
            </div>
            <div className="bg-choco-forest-50 rounded-xl p-4">
              <div className="font-display font-bold text-2xl text-choco-forest-700 mb-1">
                ~{Math.ceil(questions.length * 1.5)}
              </div>
              <div className="text-sm text-choco-sand-600">{translations.trivia.minutes}</div>
            </div>
          </div>

          <Button
            onClick={handleStart}
            size="lg"
            variant="primary"
            fullWidth
            disabled={questions.length === 0}
            icon={<Play className="w-5 h-5" />}
            iconPosition="right"
          >
            {translations.trivia.start}
          </Button>
        </div>
      </motion.div>
    )
  }

  // Pantalla de resultados
  if (completed) {
    return (
      <div>
        <TriviaResults
          questions={questions}
          answers={answers}
          score={score}
          onRestart={handleRestart}
        />
      </div>
    )
  }

  // Pantalla de pregunta actual
  const currentQuestion = questions[currentQuestionIndex]

  // Si no hay pregunta actual, volver a la pantalla de inicio
  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-3xl shadow-strong p-8 md:p-12">
          <p className="text-choco-sand-700 mb-4">No se encontró la pregunta actual.</p>
          <Button onClick={handleRestart} variant="primary">
            Reiniciar Trivia
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TriviaProgress
        current={currentQuestionIndex + 1}
        total={questions.length}
        score={score}
      />

      <TriviaQuestionComponent
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
    </div>
  )
}
