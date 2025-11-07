// src/components/molecules/CityMarker.tsx
// Componente para mostrar botones circulares de ciudades en el mapa

import { CircleMarker, useMap } from 'react-leaflet'
import type { City } from '../../types'

interface CityMarkerProps {
  city: City
  onClick: (city: City) => void
}

export function CityMarker({ city, onClick }: CityMarkerProps) {
  const map = useMap()

  const handleClick = () => {
    // Centrar el mapa en la ciudad
    map.setView([city.lat, city.lng], 10, { animate: true })
    onClick(city)
  }

  return (
    <CircleMarker
      center={[city.lat, city.lng]}
      radius={12}
      pathOptions={{
        fillColor: '#3b82f6',
        fillOpacity: 0.8,
        color: '#1e40af',
        weight: 2,
        opacity: 1,
      }}
      eventHandlers={{
        click: handleClick,
        mouseover: (e) => {
          const layer = e.target
          layer.setStyle({
            fillColor: '#2563eb',
            fillOpacity: 1,
            radius: 15,
          })
        },
        mouseout: (e) => {
          const layer = e.target
          layer.setStyle({
            fillColor: '#3b82f6',
            fillOpacity: 0.8,
            radius: 12,
          })
        },
      }}
    />
  )
}

