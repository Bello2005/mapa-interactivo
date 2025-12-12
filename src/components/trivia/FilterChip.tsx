// src/components/trivia/FilterChip.tsx
// Componente para filtros de secciones

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useState, useRef, useEffect } from 'react'

interface FilterChipProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function FilterChip({ label, options, value, onChange }: FilterChipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all',
          value !== 'Todas'
            ? 'bg-choco-pacific-500 border-choco-pacific-500 text-white'
            : 'bg-white border-choco-sand-200 text-choco-sand-700 hover:border-choco-pacific-300'
        )}
      >
        <span>{label}: {value}</span>
        <ChevronDown className={clsx(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 bg-white border-2 border-choco-sand-200 rounded-xl shadow-medium overflow-hidden z-50 min-w-[160px]"
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={clsx(
                'w-full text-left px-4 py-2 text-sm transition-colors',
                value === option
                  ? 'bg-choco-pacific-50 text-choco-pacific-700 font-semibold'
                  : 'text-choco-sand-700 hover:bg-choco-sand-50'
              )}
            >
              {option}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
