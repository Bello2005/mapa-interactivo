// src/components/molecules/LayerToggle.tsx
// Toggle para capas del mapa con estados claros y control de opacidad

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import type { ReactNode, KeyboardEvent } from 'react'

interface LayerToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  color?: string
  icon?: ReactNode
  opacity?: number
  onOpacityChange?: (value: number) => void
}

export function LayerToggle({
  label,
  description,
  checked,
  onChange,
  color = '#16a34a',
  icon,
  opacity = 1,
  onOpacityChange,
}: LayerToggleProps) {
  const handleToggle = () => onChange(!checked)
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }

  const handleOpacityInput = (value: number) => {
    const clamped = Math.min(100, Math.max(0, value))
    onOpacityChange?.(clamped / 100)
  }

  return (
    <div className="space-y-2">
    <motion.div
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      className={clsx(
          'w-full flex items-center gap-2.5 p-2.5 cursor-pointer',
          'transition-all duration-200 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
        checked
            ? 'bg-emerald-50 hover:bg-emerald-100'
            : 'bg-transparent hover:bg-gray-50'
      )}
      role="switch"
      aria-checked={checked}
      aria-label={`Activar ${label}`}
    >
      <motion.div
        className={clsx(
            'flex-shrink-0 w-5 h-5 rounded border-2',
          'flex items-center justify-center',
            'transition-all duration-200',
          checked
              ? 'bg-emerald-600 border-emerald-600'
              : 'bg-white border-gray-300'
        )}
        animate={{
            scale: checked ? [1, 1.08, 1] : 1,
        }}
          transition={{ duration: 0.2 }}
      >
        {checked && (
          <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
          >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>

      {icon && (
          <div className="flex-shrink-0" style={{ color: checked ? color : '#9ca3af' }}>
          {icon}
          </div>
      )}

      <div className="flex-1 text-left min-w-0">
          <div
            className={clsx(
              'font-medium text-sm leading-tight',
              checked ? 'text-gray-900' : 'text-gray-700'
            )}
          >
            {label}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {description}
            </div>
        )}
        </div>

        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
        )}
      </motion.div>

      {checked && onOpacityChange && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div
            className="flex items-center gap-2 px-2.5 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-gray-500 font-medium flex-shrink-0">
              Opacidad:
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(opacity * 100)}
              onChange={(e) => handleOpacityInput(Number(e.target.value))}
              className="flex-1 h-1.5 accent-emerald-600 cursor-pointer"
              aria-label={`Opacidad de ${label}`}
            />
            <span className="text-xs font-semibold text-gray-700 w-8 text-right">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </motion.div>
        )}
      </div>
  )
}
