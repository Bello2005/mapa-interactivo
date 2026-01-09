// src/utils/questionTranslations.ts
// Helper para obtener traducciones de preguntas

import type { TriviaQuestion } from '../types'
import type { Language } from './translations'

/**
 * Obtiene la pregunta traducida según el idioma
 */
export function getTranslatedQuestion(question: TriviaQuestion, language: Language): string {
  if (language === 'en' && question.questionEn) {
    return question.questionEn
  }
  return question.question
}

/**
 * Obtiene las opciones traducidas según el idioma
 */
export function getTranslatedOptions(question: TriviaQuestion, language: Language): string[] {
  if (language === 'en' && question.optionsEn && question.optionsEn.length > 0) {
    return question.optionsEn
  }
  return question.options
}

/**
 * Obtiene la explicación traducida según el idioma
 */
export function getTranslatedExplanation(question: TriviaQuestion, language: Language): string {
  if (language === 'en' && question.explanationEn) {
    return question.explanationEn
  }
  return question.explanation
}

/**
 * Obtiene una pregunta completa traducida
 */
export function getTranslatedQuestionData(question: TriviaQuestion, language: Language): TriviaQuestion {
  return {
    ...question,
    question: getTranslatedQuestion(question, language),
    options: getTranslatedOptions(question, language),
    explanation: getTranslatedExplanation(question, language),
  }
}
