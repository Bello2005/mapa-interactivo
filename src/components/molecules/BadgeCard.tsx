// src/components/molecules/BadgeCard.tsx
// Card para mostrar badges/logros desbloqueados

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Lock, Award } from 'lucide-react'
import type { Badge } from '@types/index'

interface BadgeCardProps {
  badge: Badge
  showAnimation?: boolean
}

export function BadgeCard({ badge, showAnimation = false }: BadgeCardProps) {
  return (
    <motion.div
      className={clsx(
        'relative p-6 rounded-2xl',
        'border-2 transition-all duration-300',
        badge.unlocked
          ? 'bg-gradient-to-br from-choco-gold-50 to-choco-forest-50 border-choco-gold-400'
          : 'bg-choco-sand-50 border-choco-sand-200 opacity-60'
      )}
      initial={showAnimation ? { scale: 0, rotate: -10 } : false}
      animate={showAnimation ? { scale: 1, rotate: 0 } : false}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Badge desbloqueado - animación de brillo */}
      {badge.unlocked && showAnimation && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      )}

      {/* Icono */}
      <div className="flex justify-center mb-4">
        <div
          className={clsx(
            'w-16 h-16 rounded-full flex items-center justify-center',
            badge.unlocked
              ? 'bg-gradient-gold shadow-glow-gold'
              : 'bg-choco-sand-200'
          )}
        >
          {badge.unlocked ? (
            <Award className="w-8 h-8 text-white" />
          ) : (
            <Lock className="w-8 h-8 text-choco-sand-400" />
          )}
        </div>
      </div>

      {/* Información */}
      <h3 className={clsx(
        'text-lg font-bold text-center mb-2',
        badge.unlocked ? 'text-choco-gold-800' : 'text-choco-sand-600'
      )}>
        {badge.name}
      </h3>

      <p className={clsx(
        'text-sm text-center mb-3',
        badge.unlocked ? 'text-choco-sand-700' : 'text-choco-sand-500'
      )}>
        {badge.description}
      </p>

      {/* Requirement */}
      <div className="text-xs text-center text-choco-sand-600 border-t border-choco-sand-200 pt-3">
        {badge.requirement}
      </div>

      {/* Fecha de desbloqueo */}
      {badge.unlocked && badge.unlockedAt && (
        <div className="text-xs text-center text-choco-gold-600 mt-2">
          Desbloqueado el {new Date(badge.unlockedAt).toLocaleDateString('es-CO')}
        </div>
      )}
    </motion.div>
  )
}
