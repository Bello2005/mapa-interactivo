import clsx from 'clsx'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { FloatingButton } from '@components/atoms/FloatingButton'

export interface ToolbarButton {
  id: string
  icon: ReactNode
  label?: string
  ariaLabel?: string
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

interface FloatingToolbarProps {
  buttons: ToolbarButton[]
  layout?: 'vertical' | 'horizontal'
  className?: string
}

export function FloatingToolbar({
  buttons,
  layout = 'vertical',
  className,
}: FloatingToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'backdrop-blur-md bg-white/80 border border-white/60 shadow-xl rounded-2xl',
        // Padding responsive
        'p-1.5 sm:p-2',
        // Gap responsive
        layout === 'vertical' ? 'flex flex-col gap-1.5 sm:gap-2' : 'flex flex-row gap-1.5 sm:gap-2',
        className
      )}
    >
      {buttons.map((button) => (
        <FloatingButton
          key={button.id}
          icon={button.icon}
          ariaLabel={button.ariaLabel || button.label}
          label={button.label}
          active={button.active}
          size={button.size}
          onClick={button.disabled ? undefined : button.onClick}
          className={clsx(
            'transition-opacity',
            button.disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      ))}
    </motion.div>
  )
}
