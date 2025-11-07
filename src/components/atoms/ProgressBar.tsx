// src/components/atoms/ProgressBar.tsx
// Barra de progreso animada

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  color?: 'forest' | 'pacific' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = 'forest',
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    forest: 'bg-choco-forest-500',
    pacific: 'bg-choco-pacific-500',
    gold: 'bg-choco-gold-500',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-choco-sand-700">
            {label || `${Math.round(percentage)}%`}
          </span>
          {!label && (
            <span className="text-sm text-choco-sand-600">
              {value} / {max}
            </span>
          )}
        </div>
      )}

      <div
        className={clsx(
          'w-full rounded-full overflow-hidden',
          'bg-choco-sand-200',
          sizes[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className={clsx('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  )
}
