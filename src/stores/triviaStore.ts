// src/stores/triviaStore.ts
// Store para el sistema de trivia con Zustand

import { create } from 'zustand'
import type { TriviaState } from '@types/index'
import { saveTriviaState, getTriviaState, clearTriviaState } from '@utils/storage'

interface TriviaStore extends TriviaState {
  // Acciones
  startTrivia: (totalQuestions: number) => void
  answerQuestion: (answerIndex: number) => void
  nextQuestion: () => void
  completeTrivia: () => void
  loadSavedState: () => void
  reset: () => void
  addPoints: (points: number) => void
}

const initialState: TriviaState = {
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  completed: false,
  startTime: 0,
  endTime: undefined,
}

export const useTriviaStore = create<TriviaStore>((set, get) => ({
  ...initialState,

  startTrivia: (totalQuestions) => {
    const state: TriviaState = {
      currentQuestionIndex: 0,
      answers: Array(totalQuestions).fill(null),
      score: 0,
      completed: false,
      startTime: Date.now(),
      endTime: undefined,
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

  completeTrivia: () => {
    const state = get()
    const newState = {
      ...state,
      completed: true,
      endTime: Date.now(),
    }

    set(newState)
    saveTriviaState(newState)
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
