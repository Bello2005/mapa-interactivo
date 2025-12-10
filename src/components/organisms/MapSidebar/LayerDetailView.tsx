import { LayerToggle } from '@components/molecules/LayerToggle'
import type { ThematicLayer } from '../../../types'

interface LayerDetailViewProps {
  layers: ThematicLayer[]
  activeLayerIds: Set<string>
  layerOpacities: Record<string, number>
  onToggleLayer: (layerId: string) => void
  onOpacityChange: (layerId: string, opacity: number) => void
}

export function LayerDetailView({
  layers,
  activeLayerIds,
  layerOpacities,
  onToggleLayer,
  onOpacityChange,
}: LayerDetailViewProps) {
  return (
    <div className="space-y-1.5">
      {layers.map((layer) => {
        const isActive = activeLayerIds.has(layer.id)
        const opacity = layerOpacities[layer.id] ?? layer.opacity
        return (
          <LayerToggle
            key={layer.id}
              label={layer.name}
              description={layer.description}
              checked={isActive}
              onChange={() => onToggleLayer(layer.id)}
              color={layer.color}
              opacity={opacity}
              onOpacityChange={(value) => onOpacityChange(layer.id, value)}
            />
        )
      })}
    </div>
  )
}
