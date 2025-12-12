// src/components/trivia/WelcomeModal.tsx
// Modal de bienvenida para capturar nombre de usuario

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'
import { Button } from '@components/atoms/Button'
import { saveUserName, getUserName } from '@utils/storage'

interface WelcomeModalProps {
  onComplete: (userName: string) => void
}

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [userName, setUserName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Intentar cargar nombre guardado
    const savedName = getUserName()
    if (savedName) {
      setUserName(savedName)
    }
    // Focus en el input al montar
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedName = userName.trim()

    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }

    if (trimmedName.length > 20) {
      setError('El nombre no puede tener más de 20 caracteres')
      return
    }

    // Guardar y continuar
    saveUserName(trimmedName)
    onComplete(trimmedName)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => {
          // No cerrar al hacer click fuera
          e.stopPropagation()
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icono */}
          <div className="w-20 h-20 bg-gradient-to-br from-choco-pacific-500 to-choco-forest-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>

          {/* Título */}
          <h2 className="font-display font-bold text-2xl md:text-3xl text-choco-sand-900 mb-2 text-center">
            ¡Bienvenido a la Trivia!
          </h2>
          <p className="text-choco-sand-600 mb-6 text-center">
            Para comenzar, por favor ingresa tu nombre
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-choco-sand-700 mb-2">
                Tu nombre
              </label>
              <input
                ref={inputRef}
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value)
                  setError('')
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ej: María, Juan, Ana..."
                className="w-full px-4 py-3 border-2 border-choco-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-choco-pacific-500 focus:border-transparent text-choco-sand-900 placeholder-choco-sand-400 transition-all"
                maxLength={20}
                autoComplete="name"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'userName-error' : undefined}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="userName-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
              <p className="mt-2 text-xs text-choco-sand-500">
                {userName.length}/20 caracteres
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={userName.trim().length < 2}
              className="mt-6"
            >
              Comenzar
            </Button>
          </form>

          {/* Info adicional */}
          <p className="mt-6 text-xs text-choco-sand-500 text-center">
            Tu nombre se guardará para mostrar tus puntuaciones y progreso
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
