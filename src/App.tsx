// src/App.tsx
// Aplicación principal con routing

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from '@components/organisms/Navigation'
import { Footer } from '@components/organisms/Footer'
import { Home } from '@pages/Home'
import { MapOnly } from '@pages/MapOnly'
import { Trivia } from '@pages/Trivia'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-choco-sand-50">
        <Navigation />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mapa" element={<MapOnly />} />
            <Route path="/trivia" element={<Trivia />} />
          </Routes>
        </main>

        <Routes>
          <Route path="/mapa" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
