import { LayerCategoryCard } from '@components/molecules/LayerCategoryCard'
import type { ThematicLayer, LayerCategory } from '../../../types'
import { Leaf, Users, Waves, ShieldCheck, Mountain } from 'lucide-react'
import type { JSX } from 'react'

interface QuickLayersViewProps {
  quickLayerIds: string[]
  layers: ThematicLayer[]
  activeLayerIds: Set<string>
  layerOpacities: Record<string, number>
  onToggleLayer: (layerId: string) => void
  onOpacityChange: (layerId: string, opacity: number) => void
}

export function QuickLayersView({
  quickLayerIds,
  layers,
  activeLayerIds,
  layerOpacities,
  onToggleLayer,
  onOpacityChange,
}: QuickLayersViewProps) {
  const categoryLabels: Record<LayerCategory, string> = {
    ecosistemas: 'Ecosistemas',
    social: 'Social',
    hidrografia: 'Hidrografía',
    conservacion: 'Conservación',
    fisico: 'Físico',
  }

  const categoryIcons: Record<LayerCategory, JSX.Element> = {
    ecosistemas: <Leaf className="w-4 h-4 text-emerald-600" />,
    social: <Users className="w-4 h-4 text-sky-600" />,
    hidrografia: <Waves className="w-4 h-4 text-blue-600" />,
    conservacion: <ShieldCheck className="w-4 h-4 text-amber-600" />,
    fisico: <Mountain className="w-4 h-4 text-gray-700" />,
  }

  const getStatLabel = (layer: ThematicLayer) => {
    if (layer.description) {
      const match = layer.description.match(/(\d+)\s+([A-Za-zÁÉÍÓÚáéíóúñ]+)/)
      if (match) {
        return `${match[1]} ${match[2].toLowerCase()}`
      }
    }
    if (layer.metadata?.year) return `Actualizado ${layer.metadata.year}`
    if (layer.metadata?.source) return layer.metadata.source
    return 'Datos listos'
  }

  const quickLayers = quickLayerIds
    .map((id) => layers.find((l) => l.id === id && l.enabled !== false))
    .filter(Boolean) as ThematicLayer[]

  return (
    <div className="grid grid-cols-1 gap-2">
      {quickLayers.map((layer) => {
        const isActive = activeLayerIds.has(layer.id)
        const opacity = layerOpacities[layer.id] ?? layer.opacity
        return (
          <LayerCategoryCard
            key={layer.id}
            title={layer.name}
            description={layer.description}
            active={isActive}
            opacity={opacity}
            onToggle={() => onToggleLayer(layer.id)}
            onOpacityChange={(value) => onOpacityChange(layer.id, value)}
            badge={
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-gray-700">
                {categoryIcons[layer.category]}
                <span className="hidden sm:inline">{categoryLabels[layer.category]}</span>
              </span>
            }
            statLabel={getStatLabel(layer)}
            thumbnailIcon={categoryIcons[layer.category]}
          />
        )
      })}
    </div>
  )
}
