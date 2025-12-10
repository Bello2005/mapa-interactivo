import { MapPin, ZoomIn, ZoomOut, Maximize2, Maximize, Minimize, Share2, Globe, Crosshair, Search } from 'lucide-react'
import clsx from 'clsx'
import { FloatingToolbar } from '@components/molecules/FloatingToolbar'
import type { ReactNode } from 'react'

interface FloatingMapControlsProps {
  className?: string
  onZoomIn: () => void
  onZoomOut: () => void
  onFitBounds: () => void
  onLocate?: () => void
  onShareLocation?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  onToggleCoordinates?: () => void
  showCoordinates?: boolean
  onToggleMapStyle?: (style: 'default' | 'satellite' | 'terrain') => void
  mapStyle?: 'default' | 'satellite' | 'terrain'
  onSearchToggle?: () => void
  searchActive?: boolean
}

const mapStyleIcons: Record<'default' | 'satellite' | 'terrain', ReactNode> = {
  default: <Globe className="w-5 h-5" />,
  satellite: <Globe className="w-5 h-5" />,
  terrain: <Globe className="w-5 h-5" />,
}

export function FloatingMapControls({
  className,
  onZoomIn,
  onZoomOut,
  onFitBounds,
  onLocate,
  onShareLocation,
  onToggleFullscreen,
  isFullscreen,
  onToggleCoordinates,
  showCoordinates,
  onToggleMapStyle,
  mapStyle = 'default',
  onSearchToggle,
  searchActive,
}: FloatingMapControlsProps) {
  return (
    <div
      className={clsx(
        'fixed right-4 top-20 z-[950] flex flex-col gap-3',
        'md:right-6 lg:right-8',
        className
      )}
    >
      <FloatingToolbar
        buttons={[
          onSearchToggle && {
            id: 'search',
            icon: <Search className="w-5 h-5" />,
            ariaLabel: 'Buscar',
            active: searchActive,
            onClick: onSearchToggle,
          },
          {
            id: 'zoom-in',
            icon: <ZoomIn className="w-5 h-5" />,
            ariaLabel: 'Acercar',
            onClick: onZoomIn,
            size: 'lg',
          },
          {
            id: 'zoom-out',
            icon: <ZoomOut className="w-5 h-5" />,
            ariaLabel: 'Alejar',
            onClick: onZoomOut,
            size: 'lg',
          },
          {
            id: 'fit',
            icon: <Maximize2 className="w-5 h-5" />,
            ariaLabel: 'Ajustar vista',
            onClick: onFitBounds,
            size: 'lg',
          },
          onLocate && {
            id: 'locate',
            icon: <Crosshair className="w-5 h-5" />,
            ariaLabel: 'Mi ubicación',
            onClick: onLocate,
            size: 'lg',
          },
          onToggleMapStyle && {
            id: 'style',
            icon: mapStyleIcons[mapStyle],
            ariaLabel: 'Cambiar estilo',
            onClick: () => {
              const order: Array<'default' | 'satellite' | 'terrain'> = ['default', 'satellite', 'terrain']
              const next = order[(order.indexOf(mapStyle) + 1) % order.length]
              onToggleMapStyle(next)
            },
          },
          onToggleFullscreen && {
            id: 'fullscreen',
            icon: isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />,
            ariaLabel: isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa',
            active: !!isFullscreen,
            onClick: onToggleFullscreen,
          },
          onToggleCoordinates && {
            id: 'coords',
            icon: <Crosshair className="w-5 h-5" />,
            ariaLabel: 'Mostrar coordenadas',
            active: showCoordinates,
            onClick: onToggleCoordinates,
          },
          onShareLocation && {
            id: 'share',
            icon: <Share2 className="w-5 h-5" />,
            ariaLabel: 'Compartir ubicación',
            onClick: onShareLocation,
          },
          {
            id: 'focus',
            icon: <MapPin className="w-5 h-5" />,
            ariaLabel: 'Centro Chocó',
            onClick: onFitBounds,
          },
        ].filter(Boolean) as Parameters<typeof FloatingToolbar>[0]['buttons']}
      />
    </div>
  )
}
