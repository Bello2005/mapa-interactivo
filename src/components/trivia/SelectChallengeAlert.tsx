// src/components/trivia/SelectChallengeAlert.tsx
// Alerta con diseño liquid glass inspirado en Apple

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

interface SelectChallengeAlertProps {
  isOpen: boolean
  onClose: () => void
}

export function SelectChallengeAlert({ isOpen, onClose }: SelectChallengeAlertProps) {
  const language = useUIStore((state) => state.language)
  const translations = t(language)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-md p-4"
        >
          {/* Alerta con diseño liquid glass - completamente responsive y centrada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md
                       bg-white/80 backdrop-blur-xl
                       border border-white/20
                       rounded-2xl md:rounded-3xl
                       shadow-2xl
                       p-6 md:p-8
                       relative
                       overflow-hidden
                       max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            }}
            onClick={(e) => e.stopPropagation()}
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
              {/* Botón de cerrar - responsive */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 
                         w-8 h-8 md:w-9 md:h-9 
                         rounded-full bg-white/50 backdrop-blur-sm 
                         flex items-center justify-center
                         hover:bg-white/70 active:bg-white/60
                         transition-colors touch-manipulation
                         border border-white/20
                         min-w-[44px] min-h-[44px]"
                aria-label={translations.common.close}
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-choco-sand-700" />
              </button>

              {/* Icono - responsive */}
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 
                            bg-gradient-to-br from-choco-pacific-500 to-choco-forest-500
                            rounded-xl md:rounded-2xl flex items-center justify-center
                            shadow-lg">
                <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>

              {/* Título - responsive */}
              <h3 className="font-display font-bold text-xl md:text-2xl text-center text-choco-sand-900 mb-3 px-2">
                {translations.trivia.selectChallenge}
              </h3>

              {/* Mensaje - responsive */}
              <p className="text-center text-sm md:text-base text-choco-sand-700 mb-6 leading-relaxed px-2">
                {translations.trivia.selectChallengeDescription}
              </p>

              {/* Botón de acción - responsive */}
              <button
                onClick={onClose}
                className="w-full py-3 md:py-3.5 px-6
                         bg-gradient-to-r from-choco-pacific-500 to-choco-forest-500
                         text-white font-semibold text-sm md:text-base
                         rounded-xl md:rounded-xl
                         shadow-lg hover:shadow-xl active:shadow-md
                         transition-all duration-200
                         hover:scale-[1.02] active:scale-[0.98]
                         touch-manipulation
                         min-h-[44px]"
              >
                {translations.trivia.understood}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
