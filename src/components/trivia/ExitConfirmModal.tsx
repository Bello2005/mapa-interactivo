// src/components/trivia/ExitConfirmModal.tsx
// Modal de confirmación para salir del test

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@components/atoms/Button'

interface ExitConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ExitConfirmModal({ isOpen, onConfirm, onCancel }: ExitConfirmModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icono de advertencia */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Título */}
            <h2 className="font-display font-bold text-2xl text-choco-sand-900 mb-3 text-center">
              ¿Salir del test?
            </h2>
            <p className="text-choco-sand-600 mb-6 text-center">
              Si sales ahora, perderás todo tu progreso en esta trivia. ¿Estás seguro?
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <Button
                onClick={onCancel}
                variant="outline"
                size="lg"
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                variant="primary"
                size="lg"
                fullWidth
                className="bg-red-600 hover:bg-red-700"
              >
                Sí, salir
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
