// src/stores/uiStore.ts
// Store global de UI con Zustand

import { create } from 'zustand'
import type { SpeciesCategory, ThematicLayer, LayerCategory, LayerFeatureDrillDown } from '../types'
import { getLanguage, saveLanguage } from '@utils/storage'
import { thematicLayers } from '@config/layers'

interface UIStore {
  // Capas del mapa - Sistema dinámico
  activeLayerIds: Set<string> // IDs de capas activas
  layerOpacities: Record<string, number> // Opacidad por capa ID
  quickLayers: string[] // IDs de 6 capas populares
  
  // Capas disponibles (cargadas desde configuración o API)
  availableLayers: ThematicLayer[]
  layerCategories: LayerCategory[]

  // Navegación / vistas
  sidebarView: 'layers' | 'city' | 'surprise'
  layersMode: 'quick' | 'advanced'
  layerDrillDown: {
    categoryId: string | null
    subLayerIds: string[]
  }

  // Sistema genérico de features
  featureDrillDown: LayerFeatureDrillDown | null
  featureListView: string | null // layerId de la capa cuya lista se está mostrando

  // Controles flotantes
  floatingControlsVisible: boolean

  // Surprise Me
  surpriseMeActive: boolean
  surpriseMeType: 'tour' | 'trivia' | null

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
  toggleLayer: (layerId: string) => void
  setLayerOpacity: (layerId: string, opacity: number) => void
  setActiveLayers: (layerIds: string[]) => void
  setAvailableLayers: (layers: ThematicLayer[]) => void
  setSidebarView: (view: UIStore['sidebarView']) => void
  setLayersMode: (mode: UIStore['layersMode']) => void
  enterLayerDrillDown: (categoryId: string) => void
  exitLayerDrillDown: () => void
  toggleSubLayer: (subLayerId: string) => void
  
  // Acciones de features
  enterFeatureListView: (layerId: string) => void
  exitFeatureListView: () => void
  enterFeatureDrillDown: (layerId: string, featureId: string, featureName: string) => void
  exitFeatureDrillDown: () => void
  
  activateSurpriseMe: (type: 'tour' | 'trivia') => void
  setFloatingControlsVisible: (visible: boolean) => void
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

// Estado inicial: activar solo límites administrativos por defecto
const initialActiveLayerIds = new Set<string>(['admin-boundaries'])
const initialLayerOpacities: Record<string, number> = {}
thematicLayers.forEach(layer => {
  initialLayerOpacities[layer.id] = layer.opacity
})
const initialQuickLayers = [
  'admin-boundaries',
  'comunidades-negras',
  'resguardos-indigenas',
  'runap',
  'manglares',
]

export const useUIStore = create<UIStore>((set) => ({
  // Estado inicial
  activeLayerIds: initialActiveLayerIds,
  layerOpacities: initialLayerOpacities,
  quickLayers: initialQuickLayers,
  availableLayers: thematicLayers,
  layerCategories: Array.from(new Set(thematicLayers.map(l => l.category))) as LayerCategory[],

  sidebarView: 'layers',
  layersMode: 'quick',
  layerDrillDown: {
    categoryId: null,
    subLayerIds: [],
  },
  featureDrillDown: null,
  featureListView: null,
  floatingControlsVisible: true,
  surpriseMeActive: false,
  surpriseMeType: null,

  selectedSpecies: [],
  selectedCategories: [],
  sidebarOpen: false,
  modalOpen: false,
  currentModal: null,
  selectedSpeciesId: null,
  language: getLanguage(),

  // Acciones

  toggleLayer: (layerId) =>
    set((state) => {
      const newActiveIds = new Set(state.activeLayerIds)
      if (newActiveIds.has(layerId)) {
        newActiveIds.delete(layerId)
      } else {
        newActiveIds.add(layerId)
      }
      return { activeLayerIds: newActiveIds }
    }),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layerOpacities: {
        ...state.layerOpacities,
        [layerId]: opacity,
      },
    })),

  setActiveLayers: (layerIds) =>
    set({ activeLayerIds: new Set(layerIds) }),

  setAvailableLayers: (layers) =>
    set((state) => {
      const categories = Array.from(new Set(layers.map(l => l.category))) as LayerCategory[]
      // Mantener opacidades existentes y añadir nuevas
      const opacities = { ...state.layerOpacities }
      layers.forEach(layer => {
        if (!(layer.id in opacities)) {
          opacities[layer.id] = layer.opacity
        }
      })
      return {
        availableLayers: layers,
        layerCategories: categories,
        layerOpacities: opacities,
      }
    }),

  setSidebarView: (view) => set({ sidebarView: view }),

  setLayersMode: (mode) => set({ layersMode: mode }),

  enterLayerDrillDown: (categoryId) =>
    set(() => ({
      layerDrillDown: {
        categoryId,
        subLayerIds: [],
      },
      sidebarView: 'layers',
    })),

  exitLayerDrillDown: () =>
    set(() => ({
      layerDrillDown: {
        categoryId: null,
        subLayerIds: [],
      },
    })),

  toggleSubLayer: (subLayerId) =>
    set((state) => {
      const exists = state.layerDrillDown.subLayerIds.includes(subLayerId)
      const updated = exists
        ? state.layerDrillDown.subLayerIds.filter((id) => id !== subLayerId)
        : [...state.layerDrillDown.subLayerIds, subLayerId]
      return {
        layerDrillDown: {
          ...state.layerDrillDown,
          subLayerIds: updated,
        },
      }
    }),

  enterFeatureListView: (layerId) =>
    set(() => ({
      featureListView: layerId,
      featureDrillDown: null,
      sidebarView: 'layers',
    })),

  exitFeatureListView: () =>
    set(() => ({
      featureListView: null,
    })),

  enterFeatureDrillDown: (layerId, featureId, featureName) =>
    set(() => ({
      featureDrillDown: {
        layerId,
        featureId,
        featureName,
      },
      sidebarView: 'layers',
    })),

  exitFeatureDrillDown: () =>
    set((state) => {
      // Si venimos de una lista de features, mantenerla; si no, limpiar todo
      const currentLayerId = state.featureDrillDown?.layerId
      return {
        featureDrillDown: null,
        // Mantener la lista si venimos de ahí
        featureListView: currentLayerId || null,
      }
    }),

  activateSurpriseMe: (type) =>
    set(() => ({
      surpriseMeActive: true,
      surpriseMeType: type,
      sidebarView: 'surprise',
    })),

  setFloatingControlsVisible: (visible) =>
    set({ floatingControlsVisible: visible }),

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
      activeLayerIds: initialActiveLayerIds,
      layerOpacities: initialLayerOpacities,
      quickLayers: initialQuickLayers,
      sidebarView: 'layers',
      layersMode: 'quick',
      layerDrillDown: {
        categoryId: null,
        subLayerIds: [],
      },
      featureDrillDown: null,
      featureListView: null,
      floatingControlsVisible: true,
      surpriseMeActive: false,
      surpriseMeType: null,
      selectedSpecies: [],
      selectedCategories: [],
      sidebarOpen: false,
      modalOpen: false,
      currentModal: null,
      selectedSpeciesId: null,
    }),
}))
