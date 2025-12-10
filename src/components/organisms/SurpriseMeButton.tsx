import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useUIStore } from '@stores/uiStore'

interface SurpriseMeButtonProps {
  className?: string
}

export function SurpriseMeButton({ className }: SurpriseMeButtonProps) {
  const activateSurpriseMe = useUIStore((s) => s.activateSurpriseMe)
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  const handleClick = () => {
    const type = Math.random() > 0.5 ? 'tour' : 'trivia'
    activateSurpriseMe(type)
    setSidebarOpen(true) // Abrir sidebar para mostrar la sorpresa
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 0 20px rgba(22, 163, 74, 0.3)',
          '0 0 40px rgba(37, 99, 235, 0.5)',
          '0 0 20px rgba(245, 158, 11, 0.3)',
        ],
        scale: [1, 1.02, 1],
      }}
      transition={{ duration: 3, repeat: Infinity }}
      className={`
        inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold
        bg-gradient-to-r from-choco-forest-500 via-choco-pacific-500 to-choco-gold-500
        shadow-2xl ${className || ''}
      `}
    >
      <Sparkles className="w-5 h-5" />
      Me quiero sorprender
    </motion.button>
  )
}
