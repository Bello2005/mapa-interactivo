// src/components/organisms/HeroSection.tsx
// Hero section para la página de inicio

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@components/atoms/Button'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

export function HeroSection() {
  const language = useUIStore((state) => state.language)
  const translations = t(language)

  const stats = [
    { value: '25%', label: translations.home.hero.stats.birds },
    { value: '8,000+', label: translations.home.hero.stats.plants },
    { value: '200+', label: translations.home.hero.stats.mammals },
    { value: '600+', label: translations.home.hero.stats.amphibians },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-choco-forest-50 via-choco-pacific-50 to-choco-gold-50">
      {/* Patrón de fondo animado */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-choco-forest-500 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-choco-pacific-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-soft mb-6"
          >
            <Sparkles className="w-4 h-4 text-choco-gold-500" />
            <span className="text-sm font-medium text-choco-sand-700">
              {translations.home.hero.badge}
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl lg:text-7xl text-choco-sand-900 mb-6 leading-tight"
          >
            {language === 'es' ? 'Explora el ' : 'Explore the '}
            <span className="bg-gradient-choco bg-clip-text text-transparent">
              {translations.home.hero.title}
            </span>
          </motion.h1>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-choco-sand-700 mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            {translations.home.hero.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/mapa">
              <Button
                size="lg"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                {translations.home.hero.exploreMap}
              </Button>
            </Link>

            <Link to="/trivia">
              <Button
                size="lg"
                variant="secondary"
              >
                {translations.home.hero.playTrivia}
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-choco-forest-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-base md:text-lg text-choco-sand-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
