// src/pages/Trivia.tsx
// Página de trivia

import { TriviaContainer } from '@components/trivia/TriviaContainer'

export function Trivia() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-choco-pacific-50 via-white to-choco-gold-50 py-12">
      <div className="container mx-auto px-4">
        <TriviaContainer />
      </div>
    </div>
  )
}
