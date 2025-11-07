// src/utils/storage.ts
// Utilidades para localStorage y gestión de progreso del usuario

import type { UserProgress, Badge, TriviaState } from '../types'

const STORAGE_KEYS = {
  USER_PROGRESS: 'choco_user_progress',
  TRIVIA_STATE: 'choco_trivia_state',
  LANGUAGE: 'choco_language',
  VISITED_SPECIES: 'choco_visited_species',
} as const

/**
 * Inicializa el progreso del usuario
 */
export function initUserProgress(): UserProgress {
  return {
    totalPoints: 0,
    triviaCompleted: 0,
    speciesDiscovered: [],
    badges: getDefaultBadges(),
    lastVisit: Date.now(),
    visitCount: 1,
  }
}

/**
 * Obtiene el progreso del usuario desde localStorage
 */
export function getUserProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
    if (!stored) return initUserProgress()

    const progress: UserProgress = JSON.parse(stored)

    // Actualizar última visita
    progress.lastVisit = Date.now()
    progress.visitCount = (progress.visitCount || 0) + 1

    saveUserProgress(progress)

    return progress
  } catch (error) {
    console.error('Error loading user progress:', error)
    return initUserProgress()
  }
}

/**
 * Guarda el progreso del usuario
 */
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving user progress:', error)
  }
}

/**
 * Añade puntos al usuario
 */
export function addPoints(points: number): UserProgress {
  const progress = getUserProgress()
  progress.totalPoints += points
  saveUserProgress(progress)
  return progress
}

/**
 * Marca una especie como descubierta
 */
export function discoverSpecies(speciesId: string): UserProgress {
  const progress = getUserProgress()

  if (!progress.speciesDiscovered.includes(speciesId)) {
    progress.speciesDiscovered.push(speciesId)
    progress.totalPoints += 10 // Bonus por descubrir nueva especie

    // Verificar badges
    progress.badges = checkBadges(progress)
  }

  saveUserProgress(progress)
  return progress
}

/**
 * Define los badges por defecto
 */
function getDefaultBadges(): Badge[] {
  return [
    {
      id: 'explorer',
      name: 'Explorador del Chocó',
      description: 'Descubre tu primera especie',
      icon: 'compass',
      requirement: 'Descubre 1 especie',
      unlocked: false,
    },
    {
      id: 'researcher',
      name: 'Investigador Junior',
      description: 'Completa tu primera trivia',
      icon: 'microscope',
      requirement: 'Completa 1 trivia',
      unlocked: false,
    },
    {
      id: 'biodiversity_lover',
      name: 'Amante de la Biodiversidad',
      description: 'Descubre 10 especies diferentes',
      icon: 'heart',
      requirement: 'Descubre 10 especies',
      unlocked: false,
    },
    {
      id: 'expert',
      name: 'Experto del Pacífico',
      description: 'Alcanza 500 puntos',
      icon: 'award',
      requirement: 'Alcanza 500 puntos',
      unlocked: false,
    },
    {
      id: 'guardian',
      name: 'Guardián del Bosque',
      description: 'Completa todas las trivias',
      icon: 'shield',
      requirement: 'Completa todas las trivias',
      unlocked: false,
    },
  ]
}

/**
 * Verifica y desbloquea badges según el progreso
 */
function checkBadges(progress: UserProgress): Badge[] {
  const badges = progress.badges.map(badge => {
    if (badge.unlocked) return badge

    let shouldUnlock = false

    switch (badge.id) {
      case 'explorer':
        shouldUnlock = progress.speciesDiscovered.length >= 1
        break
      case 'researcher':
        shouldUnlock = progress.triviaCompleted >= 1
        break
      case 'biodiversity_lover':
        shouldUnlock = progress.speciesDiscovered.length >= 10
        break
      case 'expert':
        shouldUnlock = progress.totalPoints >= 500
        break
      case 'guardian':
        shouldUnlock = progress.triviaCompleted >= 3 // Ajustar según número de trivias
        break
    }

    if (shouldUnlock) {
      return {
        ...badge,
        unlocked: true,
        unlockedAt: Date.now(),
      }
    }

    return badge
  })

  return badges
}

/**
 * Obtiene los badges desbloqueados recientemente (últimos 5 minutos)
 */
export function getRecentlyUnlockedBadges(progress: UserProgress): Badge[] {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000

  return progress.badges.filter(
    badge => badge.unlocked && badge.unlockedAt && badge.unlockedAt > fiveMinutesAgo
  )
}

/**
 * Guarda el estado de la trivia
 */
export function saveTriviaState(state: TriviaState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRIVIA_STATE, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving trivia state:', error)
  }
}

/**
 * Obtiene el estado de la trivia
 */
export function getTriviaState(): TriviaState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRIVIA_STATE)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error loading trivia state:', error)
    return null
  }
}

/**
 * Limpia el estado de la trivia
 */
export function clearTriviaState(): void {
  localStorage.removeItem(STORAGE_KEYS.TRIVIA_STATE)
}

/**
 * Completa una trivia y actualiza el progreso
 */
export function completeTrivia(score: number): UserProgress {
  const progress = getUserProgress()

  progress.triviaCompleted += 1
  progress.totalPoints += score
  progress.badges = checkBadges(progress)

  saveUserProgress(progress)
  clearTriviaState()

  return progress
}

/**
 * Guarda el idioma preferido
 */
export function saveLanguage(lang: 'es' | 'en'): void {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang)
}

/**
 * Obtiene el idioma preferido
 */
export function getLanguage(): 'es' | 'en' {
  return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'es' | 'en') || 'es'
}

/**
 * Resetea todo el progreso (para testing)
 */
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS)
  localStorage.removeItem(STORAGE_KEYS.TRIVIA_STATE)
  localStorage.removeItem(STORAGE_KEYS.VISITED_SPECIES)
}
