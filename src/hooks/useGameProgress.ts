// src/hooks/useGameProgress.ts
// Hook personalizado para gestionar el progreso del juego

import { useState, useEffect, useCallback } from 'react'
import type { UserProgress, Badge } from '@types/index'
import {
  getUserProgress,
  saveUserProgress,
  addPoints,
  discoverSpecies,
  completeTrivia,
  getRecentlyUnlockedBadges,
} from '@utils/storage'

export function useGameProgress() {
  const [progress, setProgress] = useState<UserProgress>(getUserProgress())
  const [newBadges, setNewBadges] = useState<Badge[]>([])

  // Recargar progreso desde localStorage
  const reloadProgress = useCallback(() => {
    const updated = getUserProgress()
    setProgress(updated)

    // Verificar badges recién desbloqueados
    const recent = getRecentlyUnlockedBadges(updated)
    setNewBadges(recent)
  }, [])

  // Añadir puntos
  const addUserPoints = useCallback((points: number) => {
    const updated = addPoints(points)
    setProgress(updated)

    const recent = getRecentlyUnlockedBadges(updated)
    if (recent.length > 0) {
      setNewBadges(recent)
    }
  }, [])

  // Descubrir especie
  const discoverNewSpecies = useCallback((speciesId: string) => {
    const updated = discoverSpecies(speciesId)
    setProgress(updated)

    const recent = getRecentlyUnlockedBadges(updated)
    if (recent.length > 0) {
      setNewBadges(recent)
    }
  }, [])

  // Completar trivia
  const finishTrivia = useCallback((score: number) => {
    const updated = completeTrivia(score)
    setProgress(updated)

    const recent = getRecentlyUnlockedBadges(updated)
    if (recent.length > 0) {
      setNewBadges(recent)
    }
  }, [])

  // Limpiar notificaciones de badges
  const clearNewBadges = useCallback(() => {
    setNewBadges([])
  }, [])

  // Guardar progreso manualmente
  const saveProgress = useCallback((updatedProgress: UserProgress) => {
    saveUserProgress(updatedProgress)
    setProgress(updatedProgress)
  }, [])

  return {
    progress,
    newBadges,
    reloadProgress,
    addUserPoints,
    discoverNewSpecies,
    finishTrivia,
    clearNewBadges,
    saveProgress,
  }
}
