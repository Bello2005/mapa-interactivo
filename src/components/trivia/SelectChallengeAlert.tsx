// src/components/trivia/SelectChallengeAlert.tsx
// Alerta con diseño liquid glass inspirado en Apple

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useUIStore } from '@stores/uiStore'

interface SelectChallengeAlertProps {
  isOpen: boolean
  onClose: () => void
}

export function SelectChallengeAlert({ isOpen, onClose }: SelectChallengeAlertProps) {
  const language = useUIStore((state) => state.language)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-md"
          />

          {/* Alerta con diseño liquid glass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[90%] max-w-md
                       bg-white/80 backdrop-blur-xl
                       border border-white/20
                       rounded-3xl
                       shadow-2xl
                       p-8
                       relative
                       overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            }}
          >
            {/* Efecto de brillo sutil en el fondo */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(circle at 30% 20%, rgba(37, 99, 235, 0.2) 0%, transparent 50%)',
              }}
            />

            {/* Contenido */}
            <div className="relative z-10">
              {/* Botón de cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm 
                         flex items-center justify-center
                         hover:bg-white/70 transition-colors
                         border border-white/20"
              >
                <X className="w-4 h-4 text-choco-sand-700" />
              </button>

              {/* Icono */}
              <div className="w-16 h-16 mx-auto mb-4 
                            bg-gradient-to-br from-choco-pacific-500 to-choco-forest-500
                            rounded-2xl flex items-center justify-center
                            shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              {/* Título */}
              <h3 className="font-display font-bold text-2xl text-center text-choco-sand-900 mb-3">
                {language === 'es' ? 'Selecciona tu Reto' : 'Select Your Challenge'}
              </h3>

              {/* Mensaje */}
              <p className="text-center text-choco-sand-700 mb-6 leading-relaxed">
                {language === 'es' 
                  ? 'Por favor, selecciona al menos una sección de trivia para comenzar tu aventura de aprendizaje.'
                  : 'Please select at least one trivia section to begin your learning adventure.'}
              </p>

              {/* Botón de acción */}
              <button
                onClick={onClose}
                className="w-full py-3 px-6
                         bg-gradient-to-r from-choco-pacific-500 to-choco-forest-500
                         text-white font-semibold rounded-xl
                         shadow-lg hover:shadow-xl
                         transition-all duration-200
                         hover:scale-[1.02] active:scale-[0.98]"
              >
                {language === 'es' ? 'Entendido' : 'Got it'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
