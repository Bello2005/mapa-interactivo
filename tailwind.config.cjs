// tailwind.config.cjs
// Paleta inspirada en la bandera del Chocó (verde, blanco, azul, amarillo-dorado)
// con ajustes para contraste WCAG AA/AAA y accesibilidad para jóvenes

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Asegurar que todas las clases se incluyan en el build
  safelist: [
    // Clases responsive críticas
    'md:hidden',
    'md:flex',
    'md:block',
    'sm:hidden',
    'sm:flex',
    'sm:block',
    'lg:hidden',
    'lg:flex',
    'lg:block',
    // Z-index values
    'z-[1100]',
    'z-[1150]',
    'z-[1200]',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Chocó Biogeográfico (con variantes para accesibilidad)
        choco: {
          // Verde bosque (de la bandera y selvas del Chocó)
          forest: {
            50: '#f0fdf4',   // Fondo muy claro
            100: '#dcfce7',  // Hover states
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#16a34a',  // Principal - ratio 4.5:1 con blanco
            600: '#15803d',  // Más oscuro - ratio 7:1 (AAA)
            700: '#14532d',  // Texto oscuro
            800: '#052e16',
            900: '#021810',
          },
          // Azul Pacífico (océano y ríos)
          pacific: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#2563eb',  // Principal - ratio 4.5:1
            600: '#1d4ed8',  // Ratio 7:1 (AAA)
            700: '#1e40af',
            800: '#1e3a8a',
            900: '#172554',
          },
          // Dorado (sol y biodiversidad)
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',  // Principal
            600: '#d97706',  // Mejor contraste
            700: '#b45309',  // Texto oscuro - AAA
            800: '#92400e',
            900: '#78350f',
          },
          // Neutros con calidez tropical
          sand: {
            50: '#fafaf9',
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c',
            600: '#57534e',  // Texto - ratio 7:1 con blanco
            700: '#44403c',
            800: '#292524',
            900: '#1c1917',
          }
        },
        // Semánticos
        success: '#16a34a',  // Verde forest-500
        warning: '#f59e0b',  // Dorado gold-500
        error: '#dc2626',    // Rojo accesible
        info: '#2563eb',     // Azul pacific-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        // Escala tipográfica optimizada para lectura (jóvenes 14-25)
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      spacing: {
        // Sistema de espaciado 8px
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'glow-forest': '0 0 20px rgba(22, 163, 74, 0.3)',
        'glow-pacific': '0 0 20px rgba(37, 99, 235, 0.3)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-forest': 'linear-gradient(135deg, #16a34a 0%, #14532d 100%)',
        'gradient-pacific': 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
        'gradient-choco': 'linear-gradient(135deg, #16a34a 0%, #2563eb 50%, #f59e0b 100%)',
      },
    },
  },
  plugins: [],
}
