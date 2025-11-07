// src/components/atoms/Button.tsx
// Componente Button con variantes y animaciones

import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-choco-forest-500 hover:bg-choco-forest-600 text-white shadow-md hover:shadow-lg',
      secondary: 'bg-choco-pacific-500 hover:bg-choco-pacific-600 text-white shadow-md hover:shadow-lg',
      outline: 'border-2 border-choco-forest-500 text-choco-forest-600 hover:bg-choco-forest-50',
      ghost: 'text-choco-forest-600 hover:bg-choco-forest-50',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      // @ts-expect-error - Framer Motion types conflict with React HTMLAttributes
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={clsx(
          'inline-flex items-center justify-center gap-2',
          'font-medium rounded-xl',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-choco-forest-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
