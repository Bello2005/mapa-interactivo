// src/components/atoms/Badge.tsx
// Componente Badge para etiquetas y estados

import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'new' | 'featured'
  size?: 'sm' | 'md'
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-choco-sand-100 text-choco-sand-700 border border-choco-sand-200',
    success: 'bg-choco-forest-100 text-choco-forest-700 border border-choco-forest-200',
    warning: 'bg-choco-gold-100 text-choco-gold-700 border border-choco-gold-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-choco-pacific-100 text-choco-pacific-700 border border-choco-pacific-200',
    new: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    featured: 'bg-amber-100 text-amber-700 border border-amber-200',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1',
        'font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
