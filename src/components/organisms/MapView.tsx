// src/components/organisms/MapView.tsx
// Componente principal del mapa interactivo con Leaflet

import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, ScaleControl } from 'react-leaflet'
import L from 'leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import clsx from 'clsx'

import type { GeoJSONFeatureCollection, Species, City, ThematicLayer } from '../../types'
import { getBounds } from '@utils/geo'
import { MapSidebar } from '@components/organisms/MapSidebar'
import { FloatingMapControls } from '@components/organisms/FloatingMapControls'
import { useUIStore } from '@stores/uiStore'
import { useGameProgress } from '@hooks/useGameProgress'
import { thematicLayers } from '@config/layers'
import { getLayers as getLayersFromAPI, checkBackendHealth } from '@services/api'
import { getLayerFeatureConfig } from '@config/layerFeatures'
import { hasValidFeatureName } from '@utils/layerFeatures'

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapViewProps {
  fullHeight?: boolean
}

// Componente para controlar el mapa desde dentro
function MapController({
  layerDataMap,
  activeLayerIds,
}: {
  layerDataMap: Map<string, GeoJSONFeatureCollection>
  activeLayerIds: Set<string>
}) {
  const map = useMap()
  const [initialFitDone, setInitialFitDone] = useState(false)

  useEffect(() => {
    // Hacer fitBounds inicial cuando se carga la primera capa activa
    if (!initialFitDone && activeLayerIds.size > 0) {
      const firstActiveLayerId = Array.from(activeLayerIds)[0]
      const firstData = layerDataMap.get(firstActiveLayerId)
      if (firstData) {
        const bounds = getBounds(firstData)
        map.fitBounds(bounds, { padding: [30, 30], animate: false })
        setInitialFitDone(true)
      }
    }
  }, [activeLayerIds, layerDataMap, map, initialFitDone])

  useEffect(() => {
    // Hacer fitBounds cuando cambian las capas activas (después del fit inicial)
    if (initialFitDone && activeLayerIds.size > 0) {
      const activeData = Array.from(activeLayerIds)
        .map(id => layerDataMap.get(id))
        .filter(Boolean) as GeoJSONFeatureCollection[]

      if (activeData.length > 0) {
        try {
          // Combinar bounds de todas las capas activas
          const allBounds = activeData
            .map(data => {
              try {
                return getBounds(data)
              } catch (error) {
                console.warn('Error getting bounds for layer:', error)
                return null
              }
            })
            .filter((bounds): bounds is LatLngBoundsExpression => bounds !== null)

          if (allBounds.length === 0) {
            return
          }

          if (allBounds.length === 1) {
            // Solo una capa, usar sus bounds directamente
            const bounds = allBounds[0] as [[number, number], [number, number]]
            map.fitBounds(bounds, { padding: [50, 50], animate: true })
            return
          }

          // Múltiples capas: combinar bounds
          const firstBounds = allBounds[0] as [[number, number], [number, number]]
          if (!firstBounds || !firstBounds[0] || !firstBounds[1]) {
            return
          }

          const combinedBounds = allBounds.reduce((acc, bounds) => {
            const accArray = acc as [[number, number], [number, number]]
            const boundsArray = bounds as [[number, number], [number, number]]
            
            // Validar formato
            if (!accArray || !accArray[0] || !accArray[1] || 
                !boundsArray || !boundsArray[0] || !boundsArray[1]) {
              return acc
            }

            return L.latLngBounds(
              [
                Math.min(accArray[0][0], boundsArray[0][0]),
                Math.min(accArray[0][1], boundsArray[0][1])
              ],
              [
                Math.max(accArray[1][0], boundsArray[1][0]),
                Math.max(accArray[1][1], boundsArray[1][1])
              ]
            )
          }, L.latLngBounds(firstBounds[0], firstBounds[1]))

          const finalBounds = combinedBounds as L.LatLngBounds
          if (finalBounds && finalBounds.isValid()) {
            map.fitBounds(
              [[finalBounds.getSouth(), finalBounds.getWest()], [finalBounds.getNorth(), finalBounds.getEast()]],
              { padding: [50, 50], animate: true }
            )
          }
        } catch (error) {
          console.error('Error combining bounds:', error)
        }
      }
    }
  }, [activeLayerIds, layerDataMap, map, initialFitDone])

  return null
}

export function MapView({ fullHeight = false }: MapViewProps) {
  const { 
    activeLayerIds, 
    layerOpacities, 
    availableLayers,
    floatingControlsVisible,
    featureDrillDown,
    sidebarOpen,
    setSidebarOpen,
    exitFeatureDrillDown,
    exitFeatureListView,
  } = useUIStore()
  const { discoverNewSpecies } = useGameProgress()

  // Mapa de datos GeoJSON por ID de capa
  const [layerDataMap, setLayerDataMap] = useState<Map<string, GeoJSONFeatureCollection>>(new Map())
  const [loadingLayers, setLoadingLayers] = useState<Set<string>>(new Set())
  const [species, setSpecies] = useState<Species[]>([])
  const loadingRef = useRef<Set<string>>(new Set()) // Ref para evitar cargas duplicadas
  const loadedRef = useRef<Set<string>>(new Set()) // Ref para trackear capas ya cargadas
  const [loading, setLoading] = useState(true)
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null) // Bounds del Chocó
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain'>('default')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [mouseCoordinates, setMouseCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const mapRef = useRef<L.Map | null>(null)
  const userLocationMarkerRef = useRef<L.CircleMarker | null>(null)
  // Ref para almacenar las capas por featureId para poder aplicar estilos dinámicamente
  const featureLayersRef = useRef<Map<string, L.Layer>>(new Map())

  const activeLayersList = useMemo(
    () =>
      availableLayers
        .filter((layer) => activeLayerIds.has(layer.id) && layer.enabled !== false)
        .sort((a, b) => a.order - b.order),
    [availableLayers, activeLayerIds]
  )

  // Ciudades principales del Chocó biogeográfico (deshabilitado - ahora se usa interacción con municipios)
  /*
  const cities: City[] = [
    {
      id: 'quibdo',
      name: 'Quibdó',
      country: 'Colombia',
      lat: 5.6911,
      lng: -76.6584,
      population: 116000,
      description: 'Capital del departamento del Chocó, ubicada a orillas del río Atrato, uno de los ríos más caudalosos de Colombia. Quibdó es el corazón del Chocó biogeográfico, una región reconocida mundialmente como uno de los 36 hotspots de biodiversidad del planeta. La ciudad se encuentra en medio de selvas tropicales que albergan más del 25% de las especies de aves del mundo, muchas de ellas endémicas. El Chocó biogeográfico es una de las regiones más lluviosas del planeta, con precipitaciones que pueden superar los 13,000 mm anuales, creando ecosistemas únicos de bosques húmedos tropicales.',
      importance: 'Capital del departamento del Chocó y puerta de entrada a una de las regiones más biodiversas del mundo, reconocida como hotspot de biodiversidad global.',
      imageUrl: '/media/images/quibdó.avif',
    },
    {
      id: 'buenaventura',
      name: 'Buenaventura',
      country: 'Colombia',
      lat: 3.8801,
      lng: -77.0197,
      population: 407000,
      description: 'El puerto más importante de Colombia en el Pacífico y uno de los principales puertos del continente. Buenaventura se encuentra estratégicamente ubicada en el extremo sur del Chocó biogeográfico, donde la región se extiende desde Panamá hasta Ecuador. La ciudad es un punto crucial de conexión entre el Chocó biogeográfico y el resto del país, facilitando el comercio y el intercambio cultural. La región circundante forma parte del Chocó biogeográfico, caracterizado por sus bosques húmedos tropicales, manglares costeros y una biodiversidad excepcional que incluye miles de especies de plantas, aves, mamíferos y anfibios, muchas de las cuales son endémicas y no se encuentran en ningún otro lugar del mundo.',
      importance: 'Principal puerto del Pacífico colombiano, centro económico estratégico y punto de conexión del Chocó biogeográfico con el resto del país y el mundo.',
      imageUrl: '/media/images/buenaventura.avif',
    },
  ]
  */

  // Cargar especies (una sola vez)
  useEffect(() => {
    async function loadSpecies() {
      try {
        const timestamp = Date.now()
        const response = await fetch(`/data/species.json?t=${timestamp}`, { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (!response.ok) throw new Error(`Failed to load species: ${response.status}`)
        const data = await response.json()
        setSpecies(data)
      } catch (error) {
        console.error('❌ Error loading species:', error)
      }
    }
    loadSpecies()
  }, [])

  // Cargar capas dinámicamente cuando se activan
  useEffect(() => {
    const layersToLoad = availableLayers.filter(
      layer => 
        activeLayerIds.has(layer.id) && 
        layer.enabled !== false &&
        layer.source === 'geojson' &&
        layer.geojsonPath &&
        (layer.storageType === 'gridfs' || layer.storageType === 'filesystem') &&
        !loadedRef.current.has(layer.id) && // No cargar si ya está cargado
        !loadingRef.current.has(layer.id) // No cargar si ya está en proceso
    )

    layersToLoad.forEach(layer => {
      // Marcar como en proceso de carga
      loadingRef.current.add(layer.id)
      setLoadingLayers(prev => new Set(prev).add(layer.id))
      
      const timestamp = Date.now()
      fetch(`${layer.geojsonPath}?t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
        .then(async response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          setLayerDataMap(prev => {
            const newMap = new Map(prev)
            if (!newMap.has(layer.id)) {
              newMap.set(layer.id, data)
              loadedRef.current.add(layer.id) // Marcar como cargado
              console.log(`✅ Capa ${layer.name} cargada:`, {
                features: data.features?.length || 0,
                type: data.type
              })
            }
            return newMap
          })
        })
        .catch(error => {
          console.error(`❌ Error loading layer ${layer.name}:`, error)
        })
        .finally(() => {
          loadingRef.current.delete(layer.id) // Remover de en proceso
          setLoadingLayers(prev => {
            const newSet = new Set(prev)
            newSet.delete(layer.id)
            return newSet
          })
        })
    })
  }, [activeLayerIds, availableLayers])

  // Cargar capas desde API o configuración estática
  useEffect(() => {
    let mounted = true
    
    async function loadLayers() {
      try {
        // Intentar cargar desde API (solo una vez)
        const isBackendAvailable = await checkBackendHealth()
        if (isBackendAvailable && mounted) {
          console.log('✅ Backend disponible, cargando capas desde API...')
          const apiLayers = await getLayersFromAPI({ enabled: true })
          if (apiLayers.length > 0 && mounted) {
            // Reemplazar admin-boundaries con la configuración del frontend para evitar conflictos
            const frontendAdminBoundaries = thematicLayers.find(l => l.id === 'admin-boundaries')
            const filteredApiLayers = apiLayers.filter(l => l.id !== 'admin-boundaries')
            const finalLayers = frontendAdminBoundaries 
              ? [...filteredApiLayers, frontendAdminBoundaries]
              : filteredApiLayers
            
            useUIStore.getState().setAvailableLayers(finalLayers)
            return
          }
        }
        
        // Fallback: usar configuración estática (solo loguear una vez)
        if (mounted) {
          console.log('📦 Usando configuración estática de capas')
          useUIStore.getState().setAvailableLayers(thematicLayers)
        }
      } catch (error) {
        if (mounted) {
          console.warn('⚠️ Error cargando capas desde API, usando estáticas:', error)
          useUIStore.getState().setAvailableLayers(thematicLayers)
        }
      }
    }

    loadLayers()
    
    return () => {
      mounted = false
    }
  }, [])

  // Cargar capas iniciales (admin-boundaries por defecto)
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        const timestamp = Date.now()

        // Cargar límites administrativos por defecto
        const adminLayer = availableLayers.find(l => l.id === 'admin-boundaries')
        if (adminLayer?.geojsonPath) {
          const response = await fetch(`${adminLayer.geojsonPath}?t=${timestamp}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
          
          if (response.ok) {
            const data = await response.json()
            setLayerDataMap(prev => {
              const newMap = new Map(prev)
              newMap.set('admin-boundaries', data)
              loadedRef.current.add('admin-boundaries') // Marcar como cargado
              return newMap
            })

            // Calcular bounds iniciales
            if (data.features && data.features.length > 0) {
              const bounds = getBounds(data)
              const boundsArray = bounds as [[number, number], [number, number]]
              const leafletBounds = L.latLngBounds(boundsArray[0], boundsArray[1])
              const expandedBounds = leafletBounds.pad(0.1)
              setMapBounds([
                [expandedBounds.getSouth(), expandedBounds.getWest()],
                [expandedBounds.getNorth(), expandedBounds.getEast()]
              ])
            }
          }
        }
      } catch (error) {
        console.error('❌ Error loading initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (availableLayers.length > 0) {
      loadInitialData()
    }
  }, [availableLayers])

  // Colapsar panel en mobile al cargar (solo una vez al montar)
  useEffect(() => {
    if (window.innerWidth < 768 && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, []) // Solo ejecutar al montar

  // Manejo de eventos - Sistema genérico con configuración
  const onEachFeature = (feature: any, layer: L.Layer, layerId?: string) => {
    if (!feature.properties) return

    const props = feature.properties
    const { enterFeatureDrillDown } = useUIStore.getState()

    // Si la capa tiene configuración de features, usar sistema genérico
    if (layerId) {
      const config = getLayerFeatureConfig(layerId)
      
        if (config) {
          const featureId = props[config.idProperty]?.toString()
          const featureName = props[config.nameProperty] || 'Sin nombre'
          
          // Verificar si el feature tiene nombre válido
          const isValid = hasValidFeatureName(props, config)

          // Solo agregar interactividad si tiene nombre válido
          if (isValid && featureId && featureName !== 'Sin nombre') {
            // Almacenar la capa usando el nombre como clave principal (más único)
            // Normalizar el nombre para evitar problemas con espacios/acentos/mayúsculas
            // Usar la misma normalización que cuando se busca
            const normalizedName = featureName.toLowerCase().trim().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            
            // Clave principal: usar nombre normalizado (más único)
            const layerKeyByName = `${layerId}-${normalizedName}`
            featureLayersRef.current.set(layerKeyByName, layer)
            
            // Clave secundaria: ID + nombre normalizado (para búsqueda alternativa)
            const layerKeyByIdAndName = `${layerId}-${featureId}-${normalizedName}`
            featureLayersRef.current.set(layerKeyByIdAndName, layer)
            
            // Debug: verificar qué se está almacenando
            console.log('📦 Almacenando capa:', { layerId, featureId, featureName, normalizedName, layerKeyByName })

          // Hover effect - solo si no está seleccionado
          layer.on('mouseover', function(this: L.Path) {
            // No aplicar hover si este feature está seleccionado
            const currentFeature = useUIStore.getState().featureDrillDown
            if (currentFeature?.layerId === layerId && currentFeature?.featureId === featureId) {
              return
            }
            
            this.setStyle({
              fillOpacity: 0.7,
              weight: 3
            })
            const container = (this as any)._path
            if (container) {
              container.style.cursor = 'pointer'
            }
          })

          layer.on('mouseout', function(this: L.Path) {
            // No restaurar estilo si este feature está seleccionado
            const currentFeature = useUIStore.getState().featureDrillDown
            if (currentFeature?.layerId === layerId && currentFeature?.featureId === featureId) {
              return
            }
            
            const currentLayer = availableLayers.find(l => l.id === layerId)
            const currentOpacity = layerOpacities[layerId] ?? currentLayer?.opacity ?? 0.5
            this.setStyle({
              fillOpacity: currentOpacity,
              weight: 2
            })
            const container = (this as any)._path
            if (container) {
              container.style.cursor = ''
            }
          })

          // Click handler - solo si tiene nombre válido
          layer.on('click', (e) => {
            if (featureId && isValid) {
              // Obtener el nombre directamente del feature clickeado para asegurar que sea correcto
              const clickedFeatureName = props[config.nameProperty] || 'Sin nombre'
              
              // Debug: verificar que estamos seleccionando el feature correcto
              console.log('🔵 Click en feature:', { 
                layerId, 
                featureId, 
                featureName: clickedFeatureName, 
                originalFeatureName: featureName,
                props: props[config.nameProperty],
                allProps: props
              })
              
              // Abrir sidebar primero para asegurar que esté visible
              setSidebarOpen(true)
              // Usar el nombre del feature clickeado, no el que se capturó en el closure
              enterFeatureDrillDown(layerId, featureId, clickedFeatureName)

              // Hacer zoom al feature
              const bounds = (layer as any).getBounds()
              if (bounds && mapRef.current) {
                mapRef.current.fitBounds(bounds, { 
                  padding: [50, 50],
                  maxZoom: 12 
                })
              }
            }
            L.DomEvent.stopPropagation(e as any)
          })
        } else {
          // Features sin nombre: no interactivos, cursor normal
          layer.on('mouseover', function(this: L.Path) {
            const container = (this as any)._path
            if (container) {
              container.style.cursor = 'not-allowed'
            }
          })

          layer.on('mouseout', function(this: L.Path) {
            const container = (this as any)._path
            if (container) {
              container.style.cursor = ''
            }
          })
        }

        return
      }
    }

    // Fallback: comportamiento legacy para capas sin configuración
    // Popup para bioregión
    if (props.name || props.NAME || props.ecoregion) {
      const ecoregion = props.ecoregion || props.eco_name || props.name || props.NAME
      const description = props.description || ''
      const countries = props.countries ? props.countries.join(', ') : ''
      
      layer.bindPopup(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-base mb-1">${ecoregion}</h3>
          ${description ? `<p class="text-sm text-gray-700 mb-1">${description}</p>` : ''}
          ${countries ? `<p class="text-xs text-gray-600">${countries}</p>` : ''}
        </div>
      `)
      
      // Abrir sidebar cuando se hace click en estos features también
      layer.on('click', () => {
        setSidebarOpen(true)
      })
    }

    // Popup para especies
    if (props.speciesId) {
      const speciesInfo = species.find(s => s.id === props.speciesId)

      if (speciesInfo) {
        layer.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-base mb-1">${speciesInfo.commonName}</h3>
            <p class="text-sm italic text-gray-600 mb-2">${speciesInfo.scientificName}</p>
            <p class="text-sm mb-2">${speciesInfo.description.substring(0, 100)}...</p>
            <div class="text-xs text-gray-500">
              ${speciesInfo.category} • ${speciesInfo.threatStatus}
            </div>
          </div>
        `)

        layer.on('click', () => {
          setSidebarOpen(true) // Abrir sidebar cuando se hace click en especies
          discoverNewSpecies(speciesInfo.id)
        })
      }
    }
  }

  // Acciones del mapa
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom()
      const minZoom = 6 // Zoom mínimo: vista principal
      // Solo hacer zoom out si no estamos en el zoom mínimo
      if (currentZoom > minZoom) {
        mapRef.current.zoomOut()
      }
    }
  }, [])

  const handleFitBounds = useCallback(() => {
    if (!mapRef.current) return
    
    const activeData = Array.from(activeLayerIds)
      .map(id => {
        const layer = availableLayers.find(l => l.id === id)
        const data = layerDataMap.get(id)
        return data ? { layer, data } : null
      })
      .filter(Boolean) as Array<{ layer: ThematicLayer; data: GeoJSONFeatureCollection }>

    if (activeData.length === 0) return

    if (activeData.length === 1) {
      const bounds = getBounds(activeData[0].data)
      mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true })
    } else {
      // Combinar bounds de todas las capas activas
      const allBounds = activeData.map(({ data }) => getBounds(data))
      const combinedBounds = allBounds.reduce((acc, bounds) => {
        const accArray = acc as [[number, number], [number, number]]
        const boundsArray = bounds as [[number, number], [number, number]]
        return L.latLngBounds(
          [
            Math.min(accArray[0][0], boundsArray[0][0]),
            Math.min(accArray[0][1], boundsArray[0][1])
          ],
          [
            Math.max(accArray[1][0], boundsArray[1][0]),
            Math.max(accArray[1][1], boundsArray[1][1])
          ]
        )
      }, L.latLngBounds(allBounds[0] as [[number, number], [number, number]]))

      const finalBounds = combinedBounds as L.LatLngBounds
      mapRef.current.fitBounds(
        [[finalBounds.getSouth(), finalBounds.getWest()], [finalBounds.getNorth(), finalBounds.getEast()]],
        { padding: [50, 50], animate: true }
      )
    }
  }, [activeLayerIds, availableLayers, layerDataMap])

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en tu navegador.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude, accuracy } = coords
        if (!mapRef.current) return

        const map = mapRef.current
        if (userLocationMarkerRef.current) {
          map.removeLayer(userLocationMarkerRef.current)
        }

        const marker = L.circleMarker([latitude, longitude], {
          radius: 10,
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 0.35,
          weight: 2,
        }).addTo(map)

        if (accuracy && accuracy > 0) {
          marker.bindPopup(`Precisión: ${Math.round(accuracy)} m`).openPopup()
        }

        userLocationMarkerRef.current = marker
        map.setView([latitude, longitude], Math.max(map.getZoom(), 12), { animate: true })
      },
      () => {
        alert('No pudimos obtener tu ubicación. Activa los permisos de geolocalización.')
      },
      { enableHighAccuracy: true, timeout: 7000 }
    )
  }, [])

  // Búsqueda de ubicaciones (deshabilitado temporalmente)
  /*
  const handleSearchLocation = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&bounded=1&viewbox=-79.5,-2.0,-75.0,9.0`
      )
      const data = await response.json()
      if (data.length > 0 && mapRef.current) {
        const { lat, lon } = data[0]
        mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 12, { animate: true })
        // Crear marcador temporal
        L.marker([parseFloat(lat), parseFloat(lon)])
          .addTo(mapRef.current)
          .bindPopup(`<b>${data[0].display_name}</b>`)
          .openPopup()
      } else {
        alert('Ubicación no encontrada. Intenta con otro término de búsqueda.')
      }
    } catch (error) {
      console.error('Error buscando ubicación:', error)
      alert('Error al buscar la ubicación. Intenta más tarde.')
    }
  }
  */

  // Cambiar estilo del mapa
  const handleToggleMapStyle = (style: 'default' | 'satellite' | 'terrain') => {
    setMapStyle(style)
  }

  // Pantalla completa
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // Mostrar coordenadas
  const handleToggleCoordinates = () => {
    setShowCoordinates(!showCoordinates)
  }

  // Atajos de teclado accesibles
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isFormField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true'

      if (isFormField) return

      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        handleZoomIn()
      }
      if (event.key === '-') {
        event.preventDefault()
        handleZoomOut()
      }
      if (event.key.toLowerCase() === 'b') {
        event.preventDefault()
        setSidebarOpen(!sidebarOpen)
      }
      if (event.key.toLowerCase() === 'l') {
        event.preventDefault()
        handleLocate()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [handleZoomIn, handleZoomOut, handleLocate])


  // Compartir ubicación
  const handleShareLocation = () => {
    if (mapRef.current && currentCoordinates) {
      const { lat, lng } = currentCoordinates
      const url = `${window.location.origin}${window.location.pathname}?lat=${lat}&lng=${lng}&zoom=${mapRef.current.getZoom()}`
      if (navigator.share) {
        navigator.share({
          title: 'Ubicación en el Chocó Biogeográfico',
          text: `Mira esta ubicación en el mapa del Chocó Biogeográfico`,
          url: url,
        })
      } else {
        navigator.clipboard.writeText(url).then(() => {
          alert('URL copiada al portapapeles')
        })
      }
    } else {
      alert('No hay ubicación actual para compartir')
    }
  }

  // Actualizar coordenadas cuando se mueve el mapa
  useEffect(() => {
    if (mapRef.current && showCoordinates) {
      const updateCoordinates = () => {
        const center = mapRef.current!.getCenter()
        setCurrentCoordinates({ lat: center.lat, lng: center.lng })
      }
      mapRef.current.on('move', updateCoordinates)
      updateCoordinates()
      
      // También inicializar coordenadas del mouse si no hay handler
      if (!(mapRef.current as any)._coordinateHandler) {
        const handleMouseMove = (e: L.LeafletMouseEvent) => {
          setMouseCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng })
        }
        mapRef.current.on('mousemove', handleMouseMove)
        ;(mapRef.current as any)._coordinateHandler = handleMouseMove
      }
      
      return () => {
        mapRef.current?.off('move', updateCoordinates)
        const handler = (mapRef.current as any)?._coordinateHandler
        if (handler) {
          mapRef.current?.off('mousemove', handler)
          delete (mapRef.current as any)._coordinateHandler
        }
      }
    } else if (mapRef.current && !showCoordinates) {
      // Limpiar handler cuando se desactiva
      const handler = (mapRef.current as any)?._coordinateHandler
      if (handler) {
        mapRef.current.off('mousemove', handler)
        delete (mapRef.current as any)._coordinateHandler
      }
      setMouseCoordinates(null)
    }
  }, [showCoordinates])


  // Escuchar cambios de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Escuchar evento de selección de feature desde FeatureListView
  useEffect(() => {
    const handleFeatureSelected = (event: CustomEvent) => {
      const { bounds } = event.detail
      if (bounds && mapRef.current) {
        mapRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 12 
        })
      }
    }
    window.addEventListener('feature-selected', handleFeatureSelected as EventListener)
    return () => window.removeEventListener('feature-selected', handleFeatureSelected as EventListener)
  }, [])

  // Aplicar estilo destacado al feature seleccionado
  useEffect(() => {
    // Validar que availableLayers sea un array antes de usar
    if (!availableLayers || !Array.isArray(availableLayers) || availableLayers.length === 0) {
      return
    }

    // Capturar availableLayers al inicio para evitar cambios durante la ejecución
    const layers = [...availableLayers] // Crear copia para evitar mutaciones
    
    const currentLayer = layers.find(l => l?.id === featureDrillDown?.layerId)
    const currentOpacity = featureDrillDown?.layerId 
      ? (layerOpacities[featureDrillDown.layerId] ?? currentLayer?.opacity ?? 0.5)
      : 0.5

    // Restaurar estilo de todas las capas primero
    featureLayersRef.current.forEach((layer, key) => {
      if (!layer || typeof (layer as any).setStyle !== 'function') return
      
      const [layerId] = key.split('-')
      const layerConfig = Array.isArray(layers) ? layers.find(l => l?.id === layerId) : null
      const layerOpacity = layerOpacities[layerId] ?? layerConfig?.opacity ?? 0.5
      
      // Restaurar estilo normal
      try {
        (layer as L.Path).setStyle({
          fillOpacity: layerOpacity,
          weight: 2,
          color: layerConfig?.color || '#059669',
          opacity: 0.9,
        })
      } catch (error) {
        console.warn('Error setting layer style:', error)
      }
    })

    // Aplicar estilo destacado al feature seleccionado
    if (featureDrillDown?.layerId && featureDrillDown?.featureId && featureDrillDown?.featureName) {
      // Normalizar el nombre para buscar la clave correcta (igual que cuando se almacena)
      const normalizedName = featureDrillDown.featureName.toLowerCase().trim().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      
      // Buscar usando el nombre normalizado como clave principal (más único)
      const selectedKeyByName = `${featureDrillDown.layerId}-${normalizedName}`
      const selectedKeyByIdAndName = `${featureDrillDown.layerId}-${featureDrillDown.featureId}-${normalizedName}`
      
      let selectedLayer = featureLayersRef.current.get(selectedKeyByName) || featureLayersRef.current.get(selectedKeyByIdAndName)
      
      // Debug: verificar qué se está seleccionando
      if (!selectedLayer) {
        console.warn('⚠️ No se encontró la capa para:', { 
          layerId: featureDrillDown.layerId, 
          featureId: featureDrillDown.featureId,
          featureName: featureDrillDown.featureName,
          normalizedName,
          searchedKeys: [selectedKeyByName, selectedKeyByIdAndName],
          availableKeys: Array.from(featureLayersRef.current.keys()).filter(k => 
            k.startsWith(`${featureDrillDown.layerId}-`) && 
            (k.includes(normalizedName) || k.includes(featureDrillDown.featureId))
          )
        })
      } else {
        const foundKey = selectedLayer === featureLayersRef.current.get(selectedKeyByName) ? selectedKeyByName : selectedKeyByIdAndName
        console.log('✅ Aplicando estilo a:', { 
          layerId: featureDrillDown.layerId, 
          featureId: featureDrillDown.featureId,
          featureName: featureDrillDown.featureName,
          normalizedName,
          foundWithKey: foundKey
        })
      }
      
      if (selectedLayer && typeof (selectedLayer as any).setStyle === 'function') {
        const layerConfig = Array.isArray(layers) ? layers.find(l => l?.id === featureDrillDown.layerId) : null
        // Estilo destacado: contorno grueso, color vibrante, relleno más claro
        try {
          (selectedLayer as L.Path).setStyle({
            fillColor: layerConfig?.color || '#059669',
            fillOpacity: Math.max(0.2, currentOpacity * 0.4), // Relleno más transparente
            color: '#3b82f6', // Azul vibrante para el contorno
            weight: 4, // Contorno más grueso
            opacity: 1, // Contorno completamente opaco
          })
        } catch (error) {
          console.warn('Error setting selected layer style:', error)
        }
      }
    }
  }, [featureDrillDown, availableLayers, layerOpacities])

  // Resetear vista del mapa cuando se presiona "volver" (featureDrillDown se vuelve null)
  const prevFeatureDrillDownRef = useRef<typeof featureDrillDown>(null)
  useEffect(() => {
    // Solo resetear si había un feature seleccionado (prevFeatureDrillDownRef.current !== null) 
    // y ahora es null (featureDrillDown === null)
    if (prevFeatureDrillDownRef.current !== null && featureDrillDown === null && mapRef.current) {
      // Pequeño delay para asegurar que el estado se haya actualizado
      const timeoutId = setTimeout(() => {
        handleFitBounds()
      }, 100)
      // Actualizar la referencia
      prevFeatureDrillDownRef.current = null
      return () => clearTimeout(timeoutId)
    } else {
      // Actualizar la referencia en cada render
      prevFeatureDrillDownRef.current = featureDrillDown
    }
  }, [featureDrillDown, handleFitBounds])

  if (loading) {
    return (
      <div className={clsx(
        'flex items-center justify-center bg-choco-sand-50',
        fullHeight ? 'h-screen' : 'h-[600px]'
      )}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-choco-forest-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-choco-sand-700 font-medium">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('relative flex h-full', fullHeight ? 'h-screen' : 'h-[600px]')}>
      {/* Panel lateral izquierdo - Componente aislado */}
      <MapSidebar
        isOpen={sidebarOpen}
        onClose={() => {
          // Limpiar estado de features
          exitFeatureDrillDown()
          exitFeatureListView()
          // Resetear vista del mapa
          handleFitBounds()
          // Cerrar sidebar y limpiar ciudad seleccionada
          setSidebarOpen(false)
          setSelectedCity(null)
        }}
        selectedCity={selectedCity}
      />

      {floatingControlsVisible && (
        <div className={clsx(
          sidebarOpen && 'hidden md:flex'
        )}>
          <FloatingMapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitBounds={handleFitBounds}
            onLocate={handleLocate}
            onToggleMapStyle={handleToggleMapStyle}
            mapStyle={mapStyle}
            onShareLocation={handleShareLocation}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            onToggleCoordinates={handleToggleCoordinates}
            showCoordinates={showCoordinates}
          />
        </div>
      )}

      {/* Botón para abrir panel (cuando está cerrado) - Estilo tarjeta flotante - Responsive mejorado */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: [1, 1.02, 1],
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(true)}
          className={clsx(
            'fixed z-[1001]', // Por encima del sidebar y del mapa
            'left-3 sm:left-4 md:left-6 lg:left-8 xl:left-24',
            'top-20 sm:top-20 md:top-20',
            'px-4 py-3 sm:px-3.5 sm:py-3.5 md:px-3 md:py-3', // Padding adaptativo
            'rounded-xl',
            'bg-white', // Fondo sólido para mejor visibilidad
            'shadow-2xl shadow-black/20', // Sombra más pronunciada
            'border-2 border-choco-forest-300', // Borde más visible
            'ring-2 ring-choco-forest-100', // Anillo para destacar
            'hover:bg-choco-forest-50 hover:border-choco-forest-400',
            'hover:shadow-2xl hover:shadow-choco-forest-200/50',
            'transition-all duration-200',
            'flex items-center justify-center gap-2', // Gap para texto
            'min-w-[56px] min-h-[56px]', // Tamaño mínimo táctil en móvil (más grande)
            'sm:min-w-[52px] sm:min-h-[52px]',
            'md:min-w-[48px] md:min-h-[44px]',
            'active:scale-95', // Feedback táctil
            'touch-manipulation' // Mejor rendimiento touch
          )}
          aria-label="Abrir panel de controles"
        >
          <Menu className="w-6 h-6 sm:w-5 sm:h-5 text-choco-forest-700 flex-shrink-0" strokeWidth={2.5} />
          <span className="text-sm font-semibold text-choco-forest-700 hidden xs:inline sm:hidden lg:inline">
            Capas
          </span>
        </motion.button>
      )}

      {/* Overlay movido a MapSidebar/index.tsx (z-[1150]) para cubrir header correctamente en móvil */}

      {/* Mapa */}
      <div className={clsx(
        'flex-1 transition-all duration-300 relative',
        sidebarOpen && 'md:ml-0'
      )}>
        <MapContainer
        center={[5.5, -77]}
        zoom={6} // Zoom inicial más amplio para ver mejor la región completa
        minZoom={6} // Zoom mínimo: vista completa del Chocó
        maxZoom={15} // Zoom máximo: nivel de detalle razonable
        maxBounds={mapBounds || undefined} // Limitar movimiento al área del Chocó
        maxBoundsViscosity={1.0} // Forzar que el mapa permanezca dentro de los bounds
        className="w-full h-full touch-pan-x touch-pan-y touch-pinch-zoom"
        zoomControl={false} // Desactivar controles por defecto de Leaflet para evitar conflictos
        zoomSnap={0.5} // Permitir zoom más suave
        zoomDelta={0.5} // Delta de zoom más gradual
        wheelPxPerZoomLevel={120} // Mejor control de zoom con rueda/pinch
        ref={(ref) => {
          if (ref) {
            mapRef.current = ref as unknown as L.Map
            // Configurar opciones de touch para móviles
            const map = ref as unknown as L.Map
            if (map && (map as any)._handlers) {
              // Habilitar tap y mejorar tolerancia táctil
              if ((map as any).tap) (map as any).tap.enable()
              if ((map as any).touchZoom) (map as any).touchZoom.enable()
              
              // Prevenir zoom out más allá del mínimo (vista principal)
              const minZoom = 6 // Zoom mínimo: vista principal
              map.on('zoomend', () => {
                const currentZoom = map.getZoom()
                if (currentZoom < minZoom) {
                  map.setZoom(minZoom)
                }
              })
            }
          }
        }}
      >
        <TileLayer
          key={mapStyle}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={
            mapStyle === 'satellite'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : mapStyle === 'terrain'
              ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        <ScaleControl position="bottomleft" />

        {/* Mostrar coordenadas - Responsive */}
        {showCoordinates && (
          <div className={clsx(
            'absolute z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200',
            // Posicionamiento responsive
            'bottom-4 right-4',
            'max-w-[calc(100vw-2rem)] sm:max-w-[220px]',
            'px-3 py-2 sm:px-4 sm:py-3'
          )}>
            <div className="text-xs font-semibold text-gray-500 mb-1">Coordenadas</div>
            {mouseCoordinates ? (
              <>
                <div className="text-xs font-mono text-gray-700">
                  <div className="text-green-600 font-semibold">Cursor:</div>
                  <div className="truncate">Lat: {mouseCoordinates.lat.toFixed(6)}</div>
                  <div className="truncate">Lng: {mouseCoordinates.lng.toFixed(6)}</div>
                </div>
                {currentCoordinates && (
                  <>
                    <div className="text-xs font-mono text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      <div className="text-gray-500 font-semibold">Centro:</div>
                      <div className="truncate">Lat: {currentCoordinates.lat.toFixed(6)}</div>
                      <div className="truncate">Lng: {currentCoordinates.lng.toFixed(6)}</div>
                    </div>
                  </>
                )}
              </>
            ) : currentCoordinates ? (
              <div className="text-xs font-mono text-gray-700">
                <div className="truncate">Lat: {currentCoordinates.lat.toFixed(6)}</div>
                <div className="truncate">Lng: {currentCoordinates.lng.toFixed(6)}</div>
              </div>
            ) : null}
          </div>
        )}


        {/* Indicador de carga para capas */}
        {loadingLayers.size > 0 && (
          <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-choco-forest-500 border-t-transparent rounded-full" />
              <span className="text-sm text-choco-sand-700">
                Cargando {loadingLayers.size} capa{loadingLayers.size > 1 ? 's' : ''}...
              </span>
            </div>
          </div>
        )}

        {/* Renderizar capas dinámicamente */}
        {Array.from(activeLayerIds).map(layerId => {
          const layer = availableLayers.find(l => l.id === layerId)
          const data = layerDataMap.get(layerId)
          
          if (!layer || !data || layer.source !== 'geojson' || !data.features || data.features.length === 0) {
            // Mostrar indicador de carga si la capa está en proceso
            if (loadingLayers.has(layerId)) {
              return null // El indicador global ya muestra el estado
            }
            return null
          }

          const opacity = layerOpacities[layerId] ?? layer.opacity

          // Para límites municipales, usar estilo especial con bordes más marcados
          const isBoundaryLayer = layerId === 'admin-boundaries'

          // Función de estilo para mejor control con react-leaflet
          const getStyle = (_feature: any) => {
            if (isBoundaryLayer) {
              return {
                fillColor: layer.color, // Verde esmeralda
                fillOpacity: opacity, // Opacidad configurable
                color: '#059669', // Borde verde esmeralda oscuro (emerald-600)
                weight: 1.5,
                opacity: 0.85,
                dashArray: undefined, // Sin líneas punteadas
              }
            }

            return {
              fillColor: layer.color,
              fillOpacity: opacity,
              color: layer.color,
              weight: 2,
              opacity: 0.9,
            }
          }

          // Función onEachFeature para todas las capas con layerId
          const onEachFeatureLayer = (feature: any, leafletLayer: L.Layer) => {
            onEachFeature(feature, leafletLayer, layerId)
          }

          return (
            <GeoJSON
              key={`${layerId}-layer-${data.features.length}`}
              data={data}
              style={getStyle}
              onEachFeature={onEachFeatureLayer}
            />
          )
        })}

        {/* Marcadores de ciudades - Deshabilitados: ahora se usa la interacción directa con municipios */}
        {/* {cities.map((city) => (
          <CityMarker
            key={city.id}
            city={city}
            onClick={(city) => {
              setSelectedCity(city)
              setSidebarOpen(true) // Asegurar que el sidebar esté abierto
            }}
          />
        ))} */}

        <MapController
          layerDataMap={layerDataMap}
          activeLayerIds={activeLayerIds}
        />
        </MapContainer>

        {/* Leyenda de capas activas - Responsive */}
        {activeLayersList.length > 0 && (
          <div className={clsx(
            'absolute z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200',
            // Posicionamiento responsive
            'bottom-4 left-4',
            'sm:bottom-4',
            sidebarOpen ? 'sm:left-[calc(100vw-20rem)] md:left-[420px]' : 'sm:left-4',
            // Tamaño responsive
            'max-w-[calc(100vw-2rem)] sm:max-w-[260px]',
            'px-3 py-2 sm:px-4 sm:py-3',
            // Esconder en móvil si sidebar está abierto
            sidebarOpen && 'hidden sm:block'
          )}>
            <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center justify-between">
              <span className="truncate">Capas activas</span>
              <span className="text-emerald-600 flex-shrink-0 ml-2">{activeLayersList.length} de {availableLayers.length}</span>
            </div>
            <div className="space-y-2 max-h-32 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {activeLayersList.map((layer) => {
                const opacity = layerOpacities[layer.id] ?? layer.opacity
                return (
                  <div key={layer.id} className="flex items-center gap-2 text-xs sm:text-sm text-gray-800">
                    <span
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: layer.color, opacity }}
                    />
                    <span className="truncate flex-1 min-w-0">{layer.name}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">{Math.round(opacity * 100)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapView
