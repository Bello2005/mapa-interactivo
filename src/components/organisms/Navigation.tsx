// src/components/organisms/Navigation.tsx
// Navegación principal con responsive mobile menu

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  Map,
  Brain,
  Globe,
} from 'lucide-react'
import clsx from 'clsx'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const language = useUIStore((state) => state.language)
  const setLanguage = useUIStore((state) => state.setLanguage)

  const translations = t(language)

  const navItems = [
    { path: '/', label: translations.nav.home, icon: Home },
    { path: '/mapa', label: translations.nav.map, icon: Map },
    { path: '/trivia', label: translations.nav.trivia, icon: Brain },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-[1100] bg-white/95 border-b border-choco-sand-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow p-1.5">
              <img
                src="/media/icons/iiap-logo.png"
                alt="IIAP - Instituto de Investigaciones Ambientales del Pacífico"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.innerHTML = '<div class="text-white font-bold text-lg">IIAP</div>'
                }}
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-lg text-choco-forest-700">
                Chocó Biogeográfico
              </div>
              <div className="text-xs text-choco-sand-600">
                IIAP
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl',
                    'font-medium transition-all duration-200',
                    'hover:bg-choco-forest-50',
                    isActive(item.path)
                      ? 'text-choco-forest-700 bg-choco-forest-50'
                      : 'text-choco-sand-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Idioma */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => {
                const newLang = language === 'es' ? 'en' : 'es'
                setLanguage(newLang)
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-choco-sand-50 transition-colors"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-4 h-4 text-choco-sand-600" />
              <span 
                key={language}
                className="text-sm font-medium text-choco-sand-700 uppercase"
              >
                {language}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-choco-sand-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-choco-sand-700" />
            ) : (
              <Menu className="w-6 h-6 text-choco-sand-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-choco-sand-200"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-xl',
                        'font-medium transition-all duration-200',
                        isActive(item.path)
                          ? 'text-choco-forest-700 bg-choco-forest-50'
                          : 'text-choco-sand-700 hover:bg-choco-sand-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}

                {/* Idioma mobile */}
                <button
                  onClick={() => {
                    const newLang = language === 'es' ? 'en' : 'es'
                    setLanguage(newLang)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-choco-sand-50 transition-colors"
                >
                  <span className="flex items-center gap-3 font-medium text-choco-sand-700">
                    <Globe className="w-5 h-5" />
                    {translations.nav.language}
                  </span>
                  <span className="text-sm font-semibold text-choco-forest-600 uppercase">
                    {language === 'es' ? 'Español' : 'English'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
