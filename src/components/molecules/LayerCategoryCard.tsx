import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface LayerCategoryCardProps {
  title: string
  description?: string
  image?: string
  active: boolean
  opacity?: number
  onToggle: () => void
  onOpacityChange?: (value: number) => void
  badge?: ReactNode
  statLabel?: string
  ctaLabel?: string
  onCtaClick?: () => void
  thumbnailIcon?: ReactNode
}

export function LayerCategoryCard({
  title,
  description,
  image,
  active,
  opacity = 1,
  onToggle,
  onOpacityChange,
  badge,
  statLabel,
  ctaLabel,
  onCtaClick,
  thumbnailIcon,
}: LayerCategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={clsx(
        'relative overflow-hidden rounded-xl border-2 transition-all',
        active
          ? 'border-emerald-500 bg-emerald-50 shadow-lg ring-2 ring-emerald-100'
          : 'border-gray-200 bg-white opacity-70 hover:opacity-100 hover:border-gray-300 hover:shadow-sm'
      )}
    >
      <div className="p-2.5">
        <div className="flex items-start gap-2">
          <div className="h-9 w-9 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : thumbnailIcon ? (
              <span className="text-gray-500 scale-90">{thumbnailIcon}</span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Capa
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <h3 className={clsx(
                "text-sm font-bold leading-tight line-clamp-1",
                active ? 'text-gray-900' : 'text-gray-700'
              )}>
                  {title}
                </h3>
              {badge && <div className="flex-shrink-0 scale-90">{badge}</div>}
            </div>

            {description && (
              <p className={clsx(
                "text-xs line-clamp-1 mb-1.5",
                active ? 'text-gray-700' : 'text-gray-500'
              )}>{description}</p>
            )}

            {statLabel && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-700 mb-1.5">
                {statLabel}
              </span>
            )}

            <div className="flex items-center justify-between gap-2">
              <span
                className={clsx(
                  'text-[10px] font-bold rounded-md px-1.5 py-0.5',
                  active ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-600'
                )}
              >
                {active ? 'Activo' : 'Inactivo'}
              </span>
              <label className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={onToggle}
                  className="sr-only"
                  aria-label={`Activar ${title}`}
                />
                <span
                  className={clsx(
                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                    active ? 'bg-emerald-500' : 'bg-gray-300'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform',
                      active ? 'translate-x-4' : 'translate-x-0.5'
                    )}
                  />
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {active && onOpacityChange && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-100 px-3 py-1.5"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-gray-600 w-16">Opacidad</span>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity * 100}
              onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
              className="flex-1 h-1.5 accent-emerald-600 cursor-pointer"
              aria-label={`Opacidad de ${title}`}
            />
            <span className="text-xs font-semibold text-gray-700 w-10 text-right">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </motion.div>
      )}

      {ctaLabel && (
        <div className="px-3 pb-3 pt-1">
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md px-2 py-1 hover:bg-emerald-100 transition-colors"
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </motion.div>
  )
}
