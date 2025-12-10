import clsx from 'clsx'
import { motion } from 'framer-motion'

type TabValue = 'quick' | 'advanced'

interface TabBarProps {
  value: TabValue
  onChange: (value: TabValue) => void
  className?: string
}

const tabs: { value: TabValue; label: string }[] = [
  { value: 'quick', label: 'Rápido' },
  { value: 'advanced', label: 'Avanzado' },
]

export function TabBar({ value, onChange, className }: TabBarProps) {
  return (
    <div
      className={clsx(
        'relative flex items-center bg-gray-100 rounded-full p-0.5',
        'text-xs font-medium text-gray-600',
        className
      )}
      role="tablist"
      aria-label="Modo de capas"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={clsx(
              'relative z-10 px-3 py-1 rounded-full transition-colors',
              isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-800'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tabbar-pill"
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
