import { useState, useId, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
  defaultOpen?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
  itemClassName?: string
  onToggle?: (id: string, open: boolean) => void
}

export function Accordion({
  items,
  allowMultiple = false,
  className,
  itemClassName,
  onToggle,
}: AccordionProps) {
  const baseId = useId()
  const [openIds, setOpenIds] = useState<Set<string>>(
    () =>
      new Set(
        items.filter((item) => item.defaultOpen).map((item) => item.id)
      )
  )

  const handleToggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      const isOpen = next.has(id)

      if (allowMultiple) {
        isOpen ? next.delete(id) : next.add(id)
      } else {
        next.clear()
        if (!isOpen) next.add(id)
      }

      onToggle?.(id, next.has(id))
      return next
    })
  }

  return (
    <div className={clsx('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        const controlId = `${baseId}-control-${item.id}`
        const panelId = `${baseId}-panel-${item.id}`

        return (
          <div
            key={item.id}
            className={clsx(
              'rounded-lg border border-gray-200 bg-white',
              'hover:border-gray-300 transition-colors',
              itemClassName
            )}
          >
            <button
              id={controlId}
              aria-controls={panelId}
              aria-expanded={isOpen}
              onClick={() => handleToggle(item.id)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
            >
              <div className="flex-1 min-w-0">
                {item.title}
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-500 flex-shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={controlId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 text-gray-700">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
