// src/pages/Home.tsx
// Página de inicio con información educativa

import { motion } from 'framer-motion'
import { MapPin, Bird, Trees, Waves, BookOpen, Users, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroSection } from '@components/organisms/HeroSection'
import { Card } from '@components/molecules/Card'
import { Button } from '@components/atoms/Button'
import { Badge } from '@components/atoms/Badge'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

export function Home() {
  const language = useUIStore((state) => state.language)
  const translations = t(language)

  const features = [
    {
      icon: MapPin,
      title: translations.home.features.explore.title,
      description: translations.home.features.explore.description,
      link: '/mapa',
      color: 'text-choco-forest-600',
      bgColor: 'bg-choco-forest-50',
    },
    {
      icon: Bird,
      title: translations.home.features.species.title,
      description: translations.home.features.species.description,
      link: '/mapa',
      color: 'text-choco-pacific-600',
      bgColor: 'bg-choco-pacific-50',
    },
    {
      icon: Award,
      title: translations.home.features.trivia.title,
      description: translations.home.features.trivia.description,
      link: '/trivia',
      color: 'text-choco-gold-600',
      bgColor: 'bg-choco-gold-50',
    },
  ]

  const facts = [
    {
      icon: Trees,
      title: translations.home.facts.forest.title,
      description: translations.home.facts.forest.description,
    },
    {
      icon: Waves,
      title: translations.home.facts.corridor.title,
      description: translations.home.facts.corridor.description,
    },
    {
      icon: Bird,
      title: translations.home.facts.endemism.title,
      description: translations.home.facts.endemism.description,
    },
  ]

  return (
    <div>
      <HeroSection />

      {/* Sección de características */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-choco-sand-900 mb-4">
              {translations.home.features.title}
            </h2>
            <p className="text-lg text-choco-sand-700 max-w-2xl mx-auto whitespace-nowrap">
              {translations.home.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hoverable className="h-full">
                    <Link to={feature.link} className="block h-full">
                      <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7" />
                      </div>

                      <h3 className="font-display font-bold text-xl text-choco-sand-900 mb-2">
                        {feature.title}
                      </h3>

                      <p className="text-choco-sand-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </Link>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sobre el Chocó */}
      <section className="py-20 bg-gradient-to-br from-choco-forest-50 to-choco-pacific-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="success" size="md" className="mb-4">
                Región Biodiversa
              </Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-choco-sand-900 mb-4">
                {translations.home.facts.title}
              </h2>
              <p className="text-lg text-choco-sand-700 leading-relaxed">
                El Chocó biogeográfico es una región natural que se extiende desde el este de Panamá,
                a lo largo de toda la costa pacífica de Colombia, hasta el noroccidente de Ecuador.
                Es reconocida mundialmente como una de las zonas con mayor biodiversidad y endemismo del planeta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {facts.map((fact, index) => {
                const Icon = fact.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full text-center">
                      <div className="w-12 h-12 rounded-full bg-choco-forest-500 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="font-bold text-lg text-choco-sand-900 mb-2">
                        {fact.title}
                      </h3>

                      <p className="text-sm text-choco-sand-700">
                        {fact.description}
                      </p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre el IIAP */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-blue-900 flex items-center justify-center shadow-md p-2">
                    <img
                      src="/media/icons/iiap-logo.png"
                      alt="IIAP - Instituto de Investigaciones Ambientales del Pacífico"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.innerHTML = '<div class="text-white font-bold text-2xl">IIAP</div>'
                      }}
                    />
                  </div>
                  <h2 className="font-display font-bold text-3xl text-choco-sand-900">
                    {translations.home.iiap.title}
                  </h2>
                </div>

                <h3 className="font-bold text-xl text-choco-sand-900 mb-4">
                  {translations.home.iiap.subtitle}
                </h3>

                <p className="text-choco-sand-700 leading-relaxed mb-6">
                  {translations.home.iiap.description}
                </p>

                <a
                  href="https://iiap.org.co"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="lg">
                    {translations.home.iiap.visit}
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-choco-forest-50 rounded-2xl p-6">
                  <BookOpen className="w-8 h-8 text-choco-forest-600 mb-3" />
                  <h4 className="font-bold text-choco-sand-900 mb-2">Investigación</h4>
                  <p className="text-sm text-choco-sand-700">
                    Ciencia y conocimiento tradicional
                  </p>
                </div>

                <div className="bg-choco-pacific-50 rounded-2xl p-6">
                  <MapPin className="w-8 h-8 text-choco-pacific-600 mb-3" />
                  <h4 className="font-bold text-choco-sand-900 mb-2">Región</h4>
                  <p className="text-sm text-choco-sand-700">
                    Pacífico colombiano
                  </p>
                </div>

                <div className="bg-choco-gold-50 rounded-2xl p-6">
                  <Trees className="w-8 h-8 text-choco-gold-600 mb-3" />
                  <h4 className="font-bold text-choco-sand-900 mb-2">Conservación</h4>
                  <p className="text-sm text-choco-sand-700">
                    Gestión ambiental sostenible
                  </p>
                </div>

                <div className="bg-choco-sand-100 rounded-2xl p-6">
                  <Users className="w-8 h-8 text-choco-sand-600 mb-3" />
                  <h4 className="font-bold text-choco-sand-900 mb-2">Comunidad</h4>
                  <p className="text-sm text-choco-sand-700">
                    Participación local
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-gradient-choco text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            {translations.home.cta.title}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {translations.home.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mapa" className="inline-block">
              <Button 
                size="lg" 
                variant="primary" 
                className="!bg-white !text-choco-forest-700 hover:!bg-white/90 shadow-lg"
              >
                {translations.home.cta.viewMap}
              </Button>
            </Link>

            <Link to="/trivia" className="inline-block">
              <Button 
                size="lg" 
                variant="outline" 
                className="!border-white !text-white hover:!bg-white/10"
              >
                {translations.home.cta.playTrivia}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
