// src/utils/colors.ts
// Paleta de colores y utilidades de visualización

import type { ThreatStatus, SpeciesCategory } from '@types/index'

/**
 * Paleta Chocó Biogeográfico
 * Basada en la bandera del Chocó con ajustes de accesibilidad WCAG AA/AAA
 */
export const colors = {
  // Colores primarios de la bandera
  forest: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#16a34a',  // Principal
    600: '#15803d',  // AAA
    700: '#14532d',
    800: '#052e16',
    900: '#021810',
  },
  pacific: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#2563eb',  // Principal
    600: '#1d4ed8',  // AAA
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#172554',
  },
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Principal
    600: '#d97706',
    700: '#b45309',  // AAA
    800: '#92400e',
    900: '#78350f',
  },
  sand: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',  // AAA
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  }
} as const

/**
 * Colores por estado de amenaza IUCN
 * https://www.iucnredlist.org/
 */
export const threatStatusColors: Record<ThreatStatus, string> = {
  'LC': colors.forest[500],  // Least Concern - Verde
  'NT': colors.gold[400],    // Near Threatened - Amarillo claro
  'VU': colors.gold[600],    // Vulnerable - Naranja
  'EN': '#ea580c',           // Endangered - Naranja oscuro
  'CR': '#dc2626',           // Critically Endangered - Rojo
  'EW': '#991b1b',           // Extinct in Wild - Rojo oscuro
  'EX': '#1c1917',           // Extinct - Negro
}

/**
 * Nombres en español de los estados de amenaza
 */
export const threatStatusLabels: Record<ThreatStatus, string> = {
  'LC': 'Preocupación Menor',
  'NT': 'Casi Amenazado',
  'VU': 'Vulnerable',
  'EN': 'En Peligro',
  'CR': 'En Peligro Crítico',
  'EW': 'Extinto en Estado Silvestre',
  'EX': 'Extinto',
}

/**
 * Colores por categoría de especies
 */
export const categoryColors: Record<SpeciesCategory, string> = {
  'aves': colors.pacific[500],      // Azul
  'mamiferos': colors.gold[600],    // Dorado/Naranja
  'reptiles': colors.forest[600],   // Verde oscuro
  'anfibios': colors.pacific[400],  // Azul claro
  'plantas': colors.forest[500],    // Verde
}

/**
 * Iconos por categoría (usando lucide-react)
 */
export const categoryIcons: Record<SpeciesCategory, string> = {
  'aves': 'Bird',
  'mamiferos': 'Squirrel',
  'reptiles': 'Turtle',
  'anfibios': 'Fish', // Closest approximation
  'plantas': 'Leaf',
}

/**
 * Nombres de categorías en español
 */
export const categoryLabels: Record<SpeciesCategory, string> = {
  'aves': 'Aves',
  'mamiferos': 'Mamíferos',
  'reptiles': 'Reptiles',
  'anfibios': 'Anfibios',
  'plantas': 'Plantas',
}

/**
 * Convierte hex a rgba
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Genera color aleatorio para features en mapa
 */
export function getRandomColor(): string {
  const colorPalette = [
    colors.forest[500],
    colors.pacific[500],
    colors.gold[500],
    colors.forest[600],
    colors.pacific[600],
    colors.gold[600],
  ]

  return colorPalette[Math.floor(Math.random() * colorPalette.length)]
}

/**
 * Obtiene color de contraste (blanco o negro) según el fondo
 */
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Luminosidad relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#1c1917' : '#ffffff'
}
