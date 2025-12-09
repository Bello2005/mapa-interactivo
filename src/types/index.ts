// src/types/index.ts
// Tipos TypeScript para el proyecto Chocó Biogeográfico

import type { LatLngBoundsExpression } from 'leaflet'

// ===== TIPOS GEOESPACIALES =====

export interface GeoJSONFeature {
  type: 'Feature'
  properties: Record<string, any>
  geometry: {
    type: 'Polygon' | 'MultiPolygon' | 'Point' | 'LineString' | 'MultiLineString'
    coordinates: any[]
  }
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

export interface SpeciesRange extends GeoJSONFeature {
  properties: {
    speciesId: string
    speciesName: string
    commonName: string
    category: 'aves' | 'mamiferos' | 'reptiles' | 'anfibios' | 'plantas'
    threatStatus?: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX'
    endemic?: boolean
  }
}

export interface SpeciesPoint {
  id: string
  speciesId: string
  lat: number
  lng: number
  date?: string
  observer?: string
}

// ===== ESPECIES =====

export interface Species {
  id: string
  scientificName: string
  commonName: string
  commonNameLocal?: string // Nombre común en la región
  category: 'aves' | 'mamiferos' | 'reptiles' | 'anfibios' | 'plantas'
  family: string
  description: string
  habitat: string
  diet?: string
  threatStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX'
  endemic: boolean
  image: string
  imageCredit?: string
  funFacts: string[]
  conservationInfo?: string
  iucnLink?: string
}

export type SpeciesCategory = Species['category']
export type ThreatStatus = Species['threatStatus']

// ===== CAPAS DEL MAPA =====

export interface MapLayer {
  id: string
  name: string
  description: string
  visible: boolean
  type: 'polygon' | 'point' | 'heatmap'
  color: string
  data?: GeoJSONFeatureCollection
}

export interface MapBounds {
  bounds: LatLngBoundsExpression
  label: string
}

// ===== CIUDADES =====

export interface City {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  description: string
  population?: number
  importance?: string
  imageUrl?: string
}

// ===== TRIVIA Y GAMIFICACIÓN =====

export interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // Índice de la respuesta correcta
  explanation: string
  category: 'geografia' | 'fauna' | 'flora' | 'conservacion' | 'cultura'
  difficulty: 'facil' | 'medio' | 'dificil'
  points: number
  imageUrl?: string
}

export interface TriviaState {
  currentQuestionIndex: number
  answers: (number | null)[]
  score: number
  completed: boolean
  startTime: number
  endTime?: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  unlocked: boolean
  unlockedAt?: number
}

export interface UserProgress {
  totalPoints: number
  triviaCompleted: number
  speciesDiscovered: string[] // IDs de especies vistas en el mapa
  badges: Badge[]
  lastVisit: number
  visitCount: number
}

// ===== UI STORE =====

export interface UIStore {
  // Capas del mapa
  activeLayers: {
    bioregion: boolean
    adminBoundaries: boolean
    blackCommunities: boolean
    speciesRanges: boolean
    heatmap: boolean
  }

  // Filtros de especies
  selectedSpecies: string[] // IDs de especies seleccionadas
  selectedCategories: SpeciesCategory[]

  // UI State
  sidebarOpen: boolean
  modalOpen: boolean
  currentModal: 'species' | 'info' | 'badge' | null
  selectedSpeciesId: string | null

  // Idioma
  language: 'es' | 'en'

  // Acciones
  toggleLayer: (layer: keyof UIStore['activeLayers']) => void
  setSelectedSpecies: (speciesIds: string[]) => void
  toggleSpecies: (speciesId: string) => void
  setSelectedCategories: (categories: SpeciesCategory[]) => void
  toggleCategory: (category: SpeciesCategory) => void
  setSidebarOpen: (open: boolean) => void
  openModal: (modal: 'species' | 'info' | 'badge', speciesId?: string) => void
  closeModal: () => void
  setLanguage: (lang: 'es' | 'en') => void
}

// ===== UTILIDADES =====

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}
