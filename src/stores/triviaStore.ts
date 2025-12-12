// src/stores/triviaStore.ts
// Store para el sistema de trivia con Zustand

import { create } from 'zustand'
import type { TriviaState } from '../types'
import { 
  saveTriviaState, 
  getTriviaState, 
  clearTriviaState,
  saveSectionScore,
  getSectionScoresBySection,
  getPersonalBest,
  getUserName,
  type SectionScore
} from '@utils/storage'

interface TriviaStore extends TriviaState {
  // Acciones
  startTrivia: (totalQuestions: number, sectionId?: string) => void
  answerQuestion: (answerIndex: number) => void
  nextQuestion: () => void
  completeTrivia: (sectionId?: string) => void
  loadSavedState: () => void
  reset: () => void
  addPoints: (points: number) => void
  // Puntuaciones por sección
  saveSectionScore: (sectionId: string, score: number, correctAnswers: number, totalQuestions: number) => void
  getSectionScores: (sectionId: string) => SectionScore[]
  getPersonalBest: (sectionId: string) => SectionScore | null
  getCurrentSectionId: () => string | undefined
}

const initialState: TriviaState = {
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  completed: false,
  startTime: 0,
  endTime: undefined,
  currentSectionId: undefined,
}

export const useTriviaStore = create<TriviaStore>((set, get) => ({
  ...initialState,

  startTrivia: (totalQuestions, sectionId) => {
    const state: TriviaState = {
      currentQuestionIndex: 0,
      answers: Array(totalQuestions).fill(null),
      score: 0,
      completed: false,
      startTime: Date.now(),
      endTime: undefined,
      currentSectionId: sectionId,
    }
    set(state)
    saveTriviaState(state)
  },

  answerQuestion: (answerIndex) => {
    const state = get()
    const newAnswers = [...state.answers]
    newAnswers[state.currentQuestionIndex] = answerIndex

    const newState = {
      ...state,
      answers: newAnswers,
    }

    set(newState)
    saveTriviaState(newState)
  },

  nextQuestion: () => {
    const state = get()
    const newState = {
      ...state,
      currentQuestionIndex: state.currentQuestionIndex + 1,
    }

    set(newState)
    saveTriviaState(newState)
  },

  addPoints: (points) => {
    const state = get()
    const newState = {
      ...state,
      score: state.score + points,
    }

    set(newState)
    saveTriviaState(newState)
  },

  completeTrivia: (sectionId) => {
    const state = get()
    const finalSectionId = sectionId || state.currentSectionId
    const newState = {
      ...state,
      completed: true,
      endTime: Date.now(),
      currentSectionId: finalSectionId,
    }

    set(newState)
    saveTriviaState(newState)
  },

  saveSectionScore: (sectionId, score, correctAnswers, totalQuestions) => {
    const userName = getUserName() || 'Anónimo'
    const sectionScore: SectionScore = {
      userName,
      score,
      date: Date.now(),
      correctAnswers,
      totalQuestions,
      sectionId,
    }
    saveSectionScore(sectionScore)
  },

  getSectionScores: (sectionId) => {
    return getSectionScoresBySection(sectionId)
  },

  getPersonalBest: (sectionId) => {
    const userName = getUserName()
    if (!userName) return null
    return getPersonalBest(sectionId, userName)
  },

  getCurrentSectionId: () => {
    return get().currentSectionId
  },

  loadSavedState: () => {
    const saved = getTriviaState()
    if (saved) {
      set(saved)
    }
  },

  reset: () => {
    set(initialState)
    clearTriviaState()
  },
}))
