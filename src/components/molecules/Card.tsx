// src/components/molecules/Card.tsx
// Componente Card versátil con hover effects

import type { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  variant?: 'default' | 'elevated' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  hoverable = false,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white shadow-soft',
    elevated: 'bg-white shadow-medium',
    bordered: 'bg-white border-2 border-choco-sand-200',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const Component = hoverable ? motion.div : 'div'
  const motionProps = hoverable
    ? {
        whileHover: { y: -4, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' },
        transition: { duration: 0.2 },
      }
    : {}

  return (
    // @ts-expect-error - Framer Motion types conflict with React HTMLAttributes
    <Component
      className={clsx(
        'rounded-2xl',
        'transition-shadow duration-200',
        variants[variant],
        paddings[padding],
        hoverable && 'cursor-pointer',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}
