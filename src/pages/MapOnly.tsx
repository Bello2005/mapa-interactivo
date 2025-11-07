// src/pages/MapOnly.tsx
// Página dedicada exclusivamente al mapa interactivo

import { MapView } from '@components/organisms/MapView'

export function MapOnly() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden">
      <MapView fullHeight />
    </div>
  )
}
