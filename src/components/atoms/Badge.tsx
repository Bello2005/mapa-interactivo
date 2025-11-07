// src/components/atoms/Badge.tsx
// Componente Badge para etiquetas y estados

import { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
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
    default: 'bg-choco-sand-100 text-choco-sand-700',
    success: 'bg-choco-forest-100 text-choco-forest-700',
    warning: 'bg-choco-gold-100 text-choco-gold-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-choco-pacific-100 text-choco-pacific-700',
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
