// src/components/organisms/Footer.tsx
// Footer con información del IIAP y enlaces

import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUIStore } from '@stores/uiStore'
import { t } from '@utils/translations'

export function Footer() {
  const language = useUIStore((state) => state.language)
  const translations = t(language)

  return (
    <footer className="bg-choco-sand-900 text-choco-sand-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sobre el IIAP */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center shadow-md p-1.5">
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
              <h3 className="font-display font-bold text-xl">{translations.footer.about}</h3>
            </div>
            <p className="text-sm text-choco-sand-300 mb-4 leading-relaxed">
              {translations.home.iiap.subtitle}
            </p>
            <p className="text-sm text-choco-sand-400 leading-relaxed">
              {translations.home.iiap.description}
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">{translations.footer.contact}</h3>
            <div className="space-y-3 text-sm text-choco-sand-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {translations.footer.address}
                  <br />
                  {translations.footer.addressPlaceholder}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{translations.footer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:contacto@iiap.org.co"
                  className="hover:text-choco-forest-400 transition-colors"
                >
                  contacto@iiap.org.co
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://iiap.org.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-choco-forest-400 transition-colors"
                >
                  iiap.org.co
                </a>
              </div>
            </div>
          </div>

          {/* Recursos y fuentes */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">{translations.footer.dataSources}</h3>
            <div className="space-y-2 text-sm text-choco-sand-300">
              <a
                href="https://iiap.org.co"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-choco-forest-400 transition-colors"
              >
                {translations.footer.dataLinks.iiap}
              </a>
              <a
                href="https://www.gbif.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-choco-forest-400 transition-colors"
              >
                {translations.footer.dataLinks.gbif}
              </a>
              <a
                href="https://sibcolombia.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-choco-forest-400 transition-colors"
              >
                {translations.footer.dataLinks.sib}
              </a>
              <a
                href="https://www.worldwildlife.org/ecoregions"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-choco-forest-400 transition-colors"
              >
                {translations.footer.dataLinks.wwf}
              </a>
              <a
                href="https://gadm.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-choco-forest-400 transition-colors"
              >
                {translations.footer.dataLinks.gadm}
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-choco-sand-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-choco-sand-400">
            <div>
              {translations.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-choco-forest-400 transition-colors">
                {translations.footer.links.home}
              </Link>
              <Link to="/mapa" className="hover:text-choco-forest-400 transition-colors">
                {translations.footer.links.map}
              </Link>
              <Link to="/trivia" className="hover:text-choco-forest-400 transition-colors">
                {translations.footer.links.trivia}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
