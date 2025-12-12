import { Accordion } from '@components/molecules/Accordion'
import { LayerToggle } from '@components/molecules/LayerToggle'
import { Leaf, Users, Waves, ShieldCheck, Mountain, List } from 'lucide-react'
import clsx from 'clsx'
import type { LayerCategory, ThematicLayer } from '../../../types'
import type { JSX } from 'react'
import { useState, useEffect } from 'react'
import { hasSelectableFeatures } from '@config/layerFeatures'
import { hasNamedFeatures } from '@services/layerFeatures'
import { useUIStore } from '@stores/uiStore'

interface AdvancedLayersViewProps {
  layers: ThematicLayer[]
  activeLayerIds: Set<string>
  layerOpacities: Record<string, number>
  onToggleLayer: (layerId: string) => void
  onOpacityChange: (layerId: string, opacity: number) => void
  onEnterCategory: (categoryId: string) => void
}

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
  ecosistemas: 'bg-emerald-100 text-emerald-700',
  social: 'bg-sky-100 text-sky-700',
  hidrografia: 'bg-blue-100 text-blue-700',
  conservacion: 'bg-amber-100 text-amber-700',
  fisico: 'bg-gray-100 text-gray-700',
}

// Componente para el botón "Ver elementos" que verifica si hay features con nombres
function FeatureListButton({ 
  layerId, 
  isActive, 
  featureCount 
}: { 
  layerId: string
  isActive: boolean
  featureCount?: number
}) {
  const { enterFeatureListView } = useUIStore()
  const [hasNamed, setHasNamed] = useState<boolean | null>(null)
  
  useEffect(() => {
    // Solo verificar si la capa está activa y tiene configuración de features
    if (isActive && hasSelectableFeatures(layerId)) {
      // Verificar de forma asíncrona si hay features con nombres
      hasNamedFeatures(layerId)
        .then(setHasNamed)
        .catch(() => setHasNamed(false))
    } else {
      setHasNamed(null)
    }
  }, [layerId, isActive])
  
  // No mostrar si la capa no está activa o no tiene configuración
  if (!isActive || !hasSelectableFeatures(layerId)) {
    return null
  }
  
  // Si aún está verificando (hasNamed === null), no mostrar el botón
  // Solo mostrar si tiene features con nombres (hasNamed === true)
  if (hasNamed !== true) {
    return null
  }
  
  // Mostrar botón solo si tiene features con nombres válidos
  return (
    <button
      onClick={() => enterFeatureListView(layerId)}
      className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors mt-1"
    >
      <List className="w-3.5 h-3.5" />
      Ver elementos
      {featureCount && (
        <span className="ml-1 px-1.5 py-0.5 bg-emerald-200 text-emerald-800 rounded-full text-[10px] font-semibold">
          {featureCount}
        </span>
      )}
    </button>
  )
}

export function AdvancedLayersView({
  layers,
  activeLayerIds,
  layerOpacities,
  onToggleLayer,
  onOpacityChange,
  onEnterCategory,
}: AdvancedLayersViewProps) {
  const grouped = layers.reduce<Record<LayerCategory, ThematicLayer[]>>((acc, layer) => {
    if (layer.enabled === false) return acc
    acc[layer.category] = acc[layer.category] || []
    acc[layer.category].push(layer)
    return acc
  }, {} as Record<LayerCategory, ThematicLayer[]>)

  const items = Object.entries(grouped).map(([category, categoryLayers]) => {
    const activeCount = categoryLayers.filter(l => activeLayerIds.has(l.id)).length
    const totalCount = categoryLayers.length
    const hasActiveLayers = activeCount > 0

    return {
      id: category,
      title: (
        <div className={clsx(
          "flex items-center justify-between w-full gap-2 transition-colors",
          hasActiveLayers && "bg-emerald-50/50 -mx-3 px-3 py-2 rounded-lg"
        )}>
          <span className="inline-flex items-center gap-2 text-gray-900 font-medium text-sm">
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
          </span>
          <div
            role="button"
            tabIndex={0}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex-shrink-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onEnterCategory(category)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                onEnterCategory(category)
              }
            }}
          >
            Detalles <span aria-hidden>→</span>
          </div>
        </div>
      ),
    content: (
      <div className="space-y-1 pt-2">
        {categoryLayers
          .sort((a, b) => a.order - b.order)
          .map((layer) => {
            const isActive = activeLayerIds.has(layer.id)
            const opacity = layerOpacities[layer.id] ?? layer.opacity
            const hasFeatures = hasSelectableFeatures(layer.id)
            
            return (
              <div key={layer.id} className="space-y-0.5">
                <LayerToggle
                  label={layer.name}
                  description={layer.description}
                  checked={isActive}
                  onChange={() => onToggleLayer(layer.id)}
                  color={layer.color}
                  icon={categoryIcons[layer.category]}
                  opacity={opacity}
                  onOpacityChange={(value) => onOpacityChange(layer.id, value)}
                />
                <FeatureListButton 
                  layerId={layer.id}
                  isActive={isActive}
                  featureCount={layer.featureCount}
                />
              </div>
            )
          })}
      </div>
    ),
      defaultOpen: category === 'ecosistemas',
    }
  })

  return <Accordion items={items} allowMultiple />
}
