// src/stores/uiStore.ts
// Store global de UI con Zustand

import { create } from 'zustand'
import type { SpeciesCategory } from '../types'
import { getLanguage, saveLanguage } from '@utils/storage'

interface UIStore {
  // Capas del mapa
  activeLayers: {
    bioregion: boolean
    adminBoundaries: boolean
    speciesRanges: boolean
    heatmap: boolean
  }

  // Filtros de especies
  selectedSpecies: string[]
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
  reset: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  // Estado inicial
  activeLayers: {
    bioregion: true,
    adminBoundaries: false,
    speciesRanges: false, // Desactivada por defecto para evitar superposición con datos placeholder
    heatmap: false,
  },

  selectedSpecies: [],
  selectedCategories: [],
  sidebarOpen: false,
  modalOpen: false,
  currentModal: null,
  selectedSpeciesId: null,
  language: getLanguage(),

  // Acciones

  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layer]: !state.activeLayers[layer],
      },
    })),

  setSelectedSpecies: (speciesIds) =>
    set({ selectedSpecies: speciesIds }),

  toggleSpecies: (speciesId) =>
    set((state) => {
      const isSelected = state.selectedSpecies.includes(speciesId)
      return {
        selectedSpecies: isSelected
          ? state.selectedSpecies.filter((id) => id !== speciesId)
          : [...state.selectedSpecies, speciesId],
      }
    }),

  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),

  toggleCategory: (category) =>
    set((state) => {
      const isSelected = state.selectedCategories.includes(category)
      return {
        selectedCategories: isSelected
          ? state.selectedCategories.filter((c) => c !== category)
          : [...state.selectedCategories, category],
      }
    }),

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  openModal: (modal, speciesId) =>
    set({
      modalOpen: true,
      currentModal: modal,
      selectedSpeciesId: speciesId || null,
    }),

  closeModal: () =>
    set({
      modalOpen: false,
      currentModal: null,
      selectedSpeciesId: null,
    }),

  setLanguage: (lang) => {
    saveLanguage(lang)
    set({ language: lang })
  },

  reset: () =>
    set({
      activeLayers: {
        bioregion: true,
        adminBoundaries: false,
        speciesRanges: false, // Desactivada por defecto para evitar superposición con datos placeholder
        heatmap: false,
      },
      selectedSpecies: [],
      selectedCategories: [],
      sidebarOpen: false,
      modalOpen: false,
      currentModal: null,
      selectedSpeciesId: null,
    }),
}))
