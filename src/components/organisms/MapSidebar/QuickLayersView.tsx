import { LayerCategoryCard } from '@components/molecules/LayerCategoryCard'
import { Accordion } from '@components/molecules/Accordion'
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

  const categoryColors: Record<LayerCategory, string> = {
    ecosistemas: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    social: 'bg-sky-100 text-sky-700 border border-sky-200',
    hidrografia: 'bg-blue-100 text-blue-700 border border-blue-200',
    conservacion: 'bg-amber-100 text-amber-700 border border-amber-200',
    fisico: 'bg-gray-100 text-gray-700 border border-gray-200',
  }

  const getStatLabel = (layer: ThematicLayer) => {
    // Priorizar información útil extraída de la descripción
    if (layer.description) {
      const match = layer.description.match(/(\d+)\s+([A-Za-zÁÉÍÓÚáéíóúñ]+)/)
      if (match) {
        return `${match[1]} ${match[2].toLowerCase()}`
      }
    }
    // Mostrar fuente si está disponible (más útil que el año)
    if (layer.metadata?.source) return layer.metadata.source
    // No mostrar "Actualizado XXXX" - ocupa espacio sin aportar valor
    return null
  }

  const quickLayers = quickLayerIds
    .map((id) => layers.find((l) => l.id === id && l.enabled !== false))
    .filter(Boolean) as ThematicLayer[]

  // Agrupar capas rápidas por categoría
  const groupedQuickLayers = quickLayers.reduce<Record<LayerCategory, ThematicLayer[]>>((acc, layer) => {
    acc[layer.category] = acc[layer.category] || []
    acc[layer.category].push(layer)
    return acc
  }, {} as Record<LayerCategory, ThematicLayer[]>)

  // Crear items de acordeón con contadores
  const items = Object.entries(groupedQuickLayers).map(([category, categoryLayers]) => {
    const activeCount = categoryLayers.filter(l => activeLayerIds.has(l.id)).length
    const totalCount = categoryLayers.length
    const hasActiveLayers = activeCount > 0

    return {
      id: category,
      title: (
        <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
          {categoryIcons[category as LayerCategory]}
          {categoryLabels[category as LayerCategory]}
          {hasActiveLayers ? (
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[category as LayerCategory]}`}>
              {activeCount}/{totalCount}
            </span>
          ) : (
            <span className="text-xs text-gray-500 font-normal">
              {totalCount} {totalCount === 1 ? 'capa' : 'capas'}
            </span>
          )}
        </div>
      ),
      content: (
        <div className="space-y-1.5 pt-2">
          {categoryLayers.map((layer) => {
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
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium ${categoryColors[layer.category]}`}>
                    {categoryIcons[layer.category]}
                    <span className="hidden sm:inline">{categoryLabels[layer.category]}</span>
                  </span>
                }
                statLabel={getStatLabel(layer) || undefined}
                thumbnailIcon={categoryIcons[layer.category]}
              />
            )
          })}
        </div>
      ),
      // Abrir por defecto si tiene capas activas, o si es la primera categoría
      defaultOpen: hasActiveLayers || category === Object.keys(groupedQuickLayers)[0],
    }
  })

  return <Accordion items={items} allowMultiple />
}
