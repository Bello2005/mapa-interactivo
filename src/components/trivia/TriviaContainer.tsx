// src/components/trivia/TriviaContainer.tsx
// Contenedor principal de la trivia

import { useEffect, useState } from 'react'
import type React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { TriviaQuestion, TriviaData, TriviaSection } from '../../types'
import { useTriviaStore } from '@stores/triviaStore'
import { TriviaQuestion as TriviaQuestionComponent } from './TriviaQuestion'
import { TriviaResults } from './TriviaResults'
import { TriviaProgress } from './TriviaProgress'
import { TriviaSectionSelector } from './TriviaSectionSelector'
import { WelcomeModal } from './WelcomeModal'
import { Button } from '@components/atoms/Button'
import { Play } from 'lucide-react'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'
import { getUserName } from '@utils/storage'

export function TriviaContainer() {
  const [triviaData, setTriviaData] = useState<TriviaData | null>(null)
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
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
    getCurrentSectionId,
  } = useTriviaStore()

  // Verificar nombre de usuario al montar
  useEffect(() => {
    const savedName = getUserName()
    if (!savedName) {
      setShowWelcomeModal(true)
    }
  }, [])

  // Cargar datos de trivia
  useEffect(() => {
    async function loadTriviaData() {
      try {
        const response = await fetch('/data/trivia.json')
        const data = await response.json()
        
        // Manejar tanto formato antiguo (array) como nuevo (objeto con sections)
        if (Array.isArray(data)) {
          // Formato antiguo: convertir a formato con secciones
          const sections: TriviaSection[] = [
            {
              id: 'all',
              name: 'Todas las Preguntas',
              description: 'Todas las preguntas disponibles',
              questions: data
            }
          ]
          setTriviaData({ sections })
          setQuestions(data)
        } else if (data.sections) {
          // Formato nuevo con secciones
          setTriviaData(data as TriviaData)
        } else {
          throw new Error('Formato de trivia inválido')
        }
      } catch (error) {
        console.error('Error loading trivia data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTriviaData()
    loadSavedState()
  }, [loadSavedState])

  // Actualizar preguntas cuando se seleccionan secciones
  useEffect(() => {
    if (triviaData && selectedSectionIds.length > 0) {
      // Combinar preguntas de las secciones seleccionadas
      const selectedSections = triviaData.sections.filter(s => selectedSectionIds.includes(s.id))
      const combinedQuestions = selectedSections.flatMap(s => s.questions)
      setQuestions(combinedQuestions)
    } else if (triviaData && selectedSectionIds.length === 0) {
      // Si no hay secciones seleccionadas, no cargar preguntas
      setQuestions([])
    }
  }, [triviaData, selectedSectionIds])

  // Limpiar estado guardado si la trivia está completada
  useEffect(() => {
    if (completed) {
      // Opcional: limpiar después de mostrar resultados
      // reset()
    }
  }, [completed])

  const handleWelcomeComplete = (_name: string) => {
    // El nombre ya se guardó en localStorage desde WelcomeModal
    setShowWelcomeModal(false)
  }

  const handleStart = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (questions.length === 0) {
      console.error('No hay preguntas cargadas')
      alert('No hay preguntas disponibles. Por favor, selecciona al menos una sección.')
      return
    }

    console.log('Iniciando trivia con', questions.length, 'preguntas')
    console.log('Secciones seleccionadas:', selectedSectionIds)
    console.log('Estado antes de iniciar:', { currentQuestionIndex, answers, completed })

    try {
      // Si solo hay una sección seleccionada, pasar su ID; de lo contrario, undefined
      const sectionId = selectedSectionIds.length === 1 ? selectedSectionIds[0] : undefined
      startTrivia(questions.length, sectionId)
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

  // Mostrar modal de bienvenida si no hay nombre
  if (showWelcomeModal) {
    return <WelcomeModal onComplete={handleWelcomeComplete} />
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
        className="max-w-4xl mx-auto py-12"
      >
        {/* Botón de volver */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-choco-sand-700 hover:text-choco-forest-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al inicio</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-strong p-10 md:p-14">
          <div className="w-20 h-20 bg-gradient-pacific rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-white" />
          </div>

          <h2 className="font-display font-bold text-3xl md:text-4xl text-choco-sand-900 mb-4 text-center">
            {translations.trivia.ready}
          </h2>

          <p className="text-lg text-choco-sand-700 mb-8 text-center">
            {translations.trivia.readyDescription.replace('{count}', questions.length.toString())}
          </p>

          {/* Selector de secciones */}
          {triviaData && triviaData.sections.length > 0 && (
            <div className="mb-8">
              <TriviaSectionSelector
                sections={triviaData.sections}
                selectedSectionIds={selectedSectionIds}
                onSelectSection={(sectionIds) => {
                  setSelectedSectionIds(sectionIds)
                  reset() // Resetear trivia al cambiar secciones
                }}
                onStartTrivia={handleStart}
              />
            </div>
          )}

          {/* Nota: El botón de inicio ahora está en la FloatingBar */}
        </div>
      </motion.div>
    )
  }

  // Pantalla de resultados
  if (completed) {
    const sectionId = getCurrentSectionId() || (selectedSectionIds.length === 1 ? selectedSectionIds[0] : null)
    return (
      <div>
        <TriviaResults
          questions={questions}
          answers={answers}
          score={score}
          onRestart={handleRestart}
          sectionId={sectionId}
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
