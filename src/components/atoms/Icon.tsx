// src/components/atoms/Icon.tsx
// Wrapper para iconos de lucide-react con consistencia

import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface IconProps {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}

export function Icon({ icon: IconComponent, size = 'md', color, className }: IconProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }

  return (
    <IconComponent
      className={clsx(sizes[size], color, className)}
      aria-hidden="true"
    />
  )
}
