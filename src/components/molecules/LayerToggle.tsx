// src/components/molecules/LayerToggle.tsx
// Toggle para capas del mapa - Diseño moderno y premium

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Check } from 'lucide-react'

interface LayerToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  color?: string
  icon?: React.ReactNode
}

export function LayerToggle({
  label,
  description,
  checked,
  onChange,
  color = '#16a34a',
  icon,
}: LayerToggleProps) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={clsx(
        'w-full flex items-center gap-3 p-0',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-choco-forest-500 focus:ring-offset-2 rounded-xl',
        checked && 'bg-gradient-to-r from-choco-forest-50 to-transparent'
      )}
      role="switch"
      aria-checked={checked}
    >
      {/* Checkbox mejorado */}
      <motion.div
        className={clsx(
          'flex-shrink-0 w-6 h-6 rounded-lg border-2',
          'flex items-center justify-center',
          'transition-all duration-300',
          checked
            ? 'bg-gradient-to-br from-choco-forest-500 to-choco-forest-600 border-choco-forest-600 shadow-md'
            : 'bg-white border-gray-300 hover:border-choco-forest-300'
        )}
        animate={{
          scale: checked ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>

      {/* Icon */}
      {icon && (
        <motion.div 
          className="flex-shrink-0 text-gray-500"
          animate={{ color: checked ? color : '#6b7280' }}
        >
          {icon}
        </motion.div>
      )}

      {/* Label y descripción mejorados - Responsive */}
      <div className="flex-1 text-left min-w-0">
        <motion.div 
          className={clsx(
            'font-semibold text-sm sm:text-base',
            checked ? 'text-gray-900' : 'text-gray-700'
          )}
          animate={{ fontWeight: checked ? 600 : 500 }}
        >
          {label}
        </motion.div>
        {description && (
          <motion.div 
            className={clsx(
              'text-xs sm:text-sm mt-0.5',
              checked ? 'text-gray-600' : 'text-gray-500'
            )}
          >
            {description}
          </motion.div>
        )}
      </div>

      {/* Color indicator mejorado */}
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="flex-shrink-0 w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: color }}
        />
      )}
    </motion.button>
  )
}
