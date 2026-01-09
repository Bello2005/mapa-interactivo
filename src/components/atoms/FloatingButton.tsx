import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { ReactNode } from 'react'

type FloatingButtonSize = 'sm' | 'md' | 'lg'

interface FloatingButtonProps {
  icon: ReactNode
  onClick?: () => void
  label?: string
  size?: FloatingButtonSize
  className?: string
  ariaLabel?: string
  active?: boolean
}

// Tamaños responsive - más grandes en móvil para mejor touch
const sizeClasses: Record<FloatingButtonSize, string> = {
  sm: 'w-11 h-11 sm:w-10 sm:h-10 text-sm',
  md: 'w-12 h-12 sm:w-11 sm:h-11 md:w-12 md:h-12 text-base',
  lg: 'w-14 h-14 sm:w-13 sm:h-13 md:w-14 md:h-14 text-lg',
}

export function FloatingButton({
  icon,
  onClick,
  label,
  size = 'md',
  className,
  ariaLabel,
  active = false,
}: FloatingButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: active
          ? [
              '0 0 12px rgba(34,197,94,0.4)',
              '0 0 18px rgba(59,130,246,0.45)',
              '0 0 12px rgba(245,158,11,0.4)',
            ]
          : undefined,
        scale: active ? [1, 1.02, 1] : 1,
      }}
      transition={{ duration: active ? 2.5 : 0.2, repeat: active ? Infinity : 0 }}
      onClick={onClick}
      className={clsx(
        'rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/60',
        'flex items-center justify-center text-gray-700',
        'hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-choco-forest-400',
        'active:scale-90 touch-manipulation', // Mejor feedback táctil en móvil
        sizeClasses[size],
        className
      )}
      aria-label={ariaLabel || label}
    >
      {icon}
      {label && <span className="sr-only">{label}</span>}
    </motion.button>
  )
}
