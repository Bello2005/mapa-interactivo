// src/components/organisms/MapView.tsx
// Componente principal del mapa interactivo con Leaflet

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import clsx from 'clsx'

import type { GeoJSONFeatureCollection, Species, City } from '../../types'
import { getBounds } from '@utils/geo'
import { MapSidebar } from '@components/organisms/MapSidebar'
import { CityMarker } from '@components/molecules/CityMarker'
import { useUIStore } from '@stores/uiStore'
import { useGameProgress } from '@hooks/useGameProgress'

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
  bioregionData,
  adminData,
  communitiesData,
  activeLayers,
}: {
  bioregionData: GeoJSONFeatureCollection | null
  adminData: GeoJSONFeatureCollection | null
  communitiesData: GeoJSONFeatureCollection | null
  activeLayers: any
}) {
  const map = useMap()
  const [initialFitDone, setInitialFitDone] = useState(false)

  useEffect(() => {
    // Hacer fitBounds inicial cuando se cargan los límites municipales o comunidades negras (capa principal)
    // Priorizar límites municipales si ambas están activas
    if (!initialFitDone && activeLayers.adminBoundaries && adminData) {
      const bounds = getBounds(adminData)
      // Padding más pequeño para un zoom más cercano y atractivo
      map.fitBounds(bounds, { padding: [30, 30], animate: false })
      setInitialFitDone(true)
    } else if (!initialFitDone && activeLayers.blackCommunities && communitiesData) {
      const bounds = getBounds(communitiesData)
      map.fitBounds(bounds, { padding: [30, 30], animate: false })
      setInitialFitDone(true)
    }
    // Código comentado - bioregión desactivada
    // if (!initialFitDone && activeLayers.bioregion && bioregionData) {
    //   const bounds = getBounds(bioregionData)
    //   map.fitBounds(bounds, { padding: [30, 30], animate: false })
    //   setInitialFitDone(true)
    // }
  }, [adminData, communitiesData, activeLayers.adminBoundaries, activeLayers.blackCommunities, map, initialFitDone])

  useEffect(() => {
    // Hacer fitBounds cuando cambian las capas activas (después del fit inicial)
    // Si ambas están activas, combinar los bounds
    if (initialFitDone) {
      if (activeLayers.adminBoundaries && activeLayers.blackCommunities && adminData && communitiesData) {
        // Combinar bounds de ambas capas
        const adminBounds = getBounds(adminData)
        const communitiesBounds = getBounds(communitiesData)
        const adminBoundsArray = adminBounds as [[number, number], [number, number]]
        const communitiesBoundsArray = communitiesBounds as [[number, number], [number, number]]
        
        const combinedBounds = L.latLngBounds(
          [
            Math.min(adminBoundsArray[0][0], communitiesBoundsArray[0][0]),
            Math.min(adminBoundsArray[0][1], communitiesBoundsArray[0][1])
          ],
          [
            Math.max(adminBoundsArray[1][0], communitiesBoundsArray[1][0]),
            Math.max(adminBoundsArray[1][1], communitiesBoundsArray[1][1])
          ]
        )
        map.fitBounds([[combinedBounds.getSouth(), combinedBounds.getWest()], [combinedBounds.getNorth(), combinedBounds.getEast()]], { padding: [50, 50], animate: true })
      } else if (activeLayers.adminBoundaries && adminData) {
        const bounds = getBounds(adminData)
        map.fitBounds(bounds, { padding: [50, 50], animate: true })
      } else if (activeLayers.blackCommunities && communitiesData) {
        const bounds = getBounds(communitiesData)
        map.fitBounds(bounds, { padding: [50, 50], animate: true })
      }
      // Código comentado - bioregión desactivada
      // if (activeLayers.bioregion && bioregionData) {
      //   const bounds = getBounds(bioregionData)
      //   map.fitBounds(bounds, { padding: [50, 50], animate: true })
      // }
    }
  }, [activeLayers.adminBoundaries, activeLayers.blackCommunities, adminData, communitiesData, map, initialFitDone])

  return null
}

export function MapView({ fullHeight = false }: MapViewProps) {
  const { activeLayers, toggleLayer } = useUIStore()
  const { discoverNewSpecies } = useGameProgress()

  const [bioregionData, setBioregionData] = useState<GeoJSONFeatureCollection | null>(null)
  const [adminData, setAdminData] = useState<GeoJSONFeatureCollection | null>(null)
  const [communitiesData, setCommunitiesData] = useState<GeoJSONFeatureCollection | null>(null)
  const [_speciesData, setSpeciesData] = useState<GeoJSONFeatureCollection | null>(null)
  const [species, setSpecies] = useState<Species[]>([])

  const [sidebarOpen, setSidebarOpen] = useState(true) // Panel lateral abierto por defecto
  const [loading, setLoading] = useState(true)
  const [bioregionOpacity, setBioregionOpacity] = useState(0.5) // Control de opacidad - 50% por defecto
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null) // Bounds del Chocó
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain'>('default')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [mouseCoordinates, setMouseCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const mapRef = useRef<L.Map | null>(null)

  // Ciudades principales del Chocó biogeográfico
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

  // Cargar datos GeoJSON
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Cache busting mejorado para forzar recarga del archivo actualizado
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)

        const [bioregion, admin, communities, speciesRanges, speciesList] = await Promise.all([
          fetch(`/data/bioregion.geojson?t=${timestamp}&r=${randomId}`, { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          }).then(r => {
            if (!r.ok) throw new Error(`Failed to load bioregion: ${r.status}`)
            return r.json()
          }),
          fetch(`/data/boundaries_admin.geojson?t=${timestamp}&r=${randomId}`, { 
            cache: 'no-store',
            headers: { 
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }).then(async r => {
            if (!r.ok) throw new Error(`Failed to load admin boundaries: ${r.status}`)
            const data = await r.json()
            console.log('📥 Datos administrativos cargados:', {
              type: data.type,
              featureCount: data.features?.length,
              firstFeature: data.features?.[0]?.properties?.MpNombre || 'N/A'
            })
            return data
          }),
          fetch(`/data/comunidades_negras.geojson?t=${timestamp}&r=${randomId}`, { 
            cache: 'no-store',
            headers: { 
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }).then(async r => {
            if (!r.ok) throw new Error(`Failed to load black communities: ${r.status}`)
            const data = await r.json()
            console.log('📥 Datos de comunidades negras cargados:', {
              type: data.type,
              featureCount: data.features?.length,
              firstFeature: data.features?.[0]?.properties?.NOMBRE || 'N/A'
            })
            return data
          }),
          fetch(`/data/species_ranges.geojson?t=${timestamp}&r=${randomId}`, { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          }).then(r => {
            if (!r.ok) throw new Error(`Failed to load species ranges: ${r.status}`)
            return r.json()
          }),
          fetch(`/data/species.json?t=${timestamp}&r=${randomId}`, { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          }).then(r => {
            if (!r.ok) throw new Error(`Failed to load species: ${r.status}`)
            return r.json()
          }),
        ])

        // Usar directamente los datos administrativos del nuevo GeoJSON (límites municipales del Chocó)
        // No necesitamos filtrar ya que este GeoJSON contiene específicamente los municipios del Chocó biogeográfico
        setBioregionData(bioregion)
        setAdminData(admin)
        setCommunitiesData(communities)
        
        // Log detallado para confirmar la carga
        if (admin && admin.features) {
          console.log(`✅ Cargados ${admin.features.length} municipios del Chocó biogeográfico`)
          console.log('📋 Muestra del primer municipio:', admin.features[0]?.properties)
          console.log('🗺️ Tipo de GeoJSON:', admin.type)
          console.log('📍 Total de features:', admin.features.length)
        } else {
          console.warn('⚠️ No se cargaron features administrativos')
        }
        setSpeciesData(speciesRanges)
        setSpecies(speciesList)
        
        // Calcular bounds usando los límites municipales (capa principal)
        if (admin && admin.features && admin.features.length > 0) {
          const bounds = getBounds(admin)
          // Expandir ligeramente los bounds para permitir un poco de padding
          // bounds es [[minLat, minLng], [maxLat, maxLng]]
          const boundsArray = bounds as [[number, number], [number, number]]
          const leafletBounds = L.latLngBounds(boundsArray[0], boundsArray[1])
          const expandedBounds = leafletBounds.pad(0.1) // 10% de padding
          setMapBounds([
            [expandedBounds.getSouth(), expandedBounds.getWest()],
            [expandedBounds.getNorth(), expandedBounds.getEast()]
          ])
          
          console.log('✅ Límites municipales cargados - bounds calculados:', {
            features: admin.features.length,
            bounds: bounds
          })
        }
        
        // Código comentado - cálculo de bounds usando bioregión (desactivado)
        // if (bioregion && bioregion.features && bioregion.features.length > 0) {
        //   const bounds = getBounds(bioregion)
        //   const boundsArray = bounds as [[number, number], [number, number]]
        //   const leafletBounds = L.latLngBounds(boundsArray[0], boundsArray[1])
        //   const expandedBounds = leafletBounds.pad(0.1)
        //   setMapBounds([
        //     [expandedBounds.getSouth(), expandedBounds.getWest()],
        //     [expandedBounds.getNorth(), expandedBounds.getEast()]
        //   ])
        // }
      } catch (error) {
        console.error('❌ Error loading map data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Estilos para las capas - CAPA PRINCIPAL: Límites municipales (resaltada)
  const adminBoundariesStyle = {
    fillColor: 'rgba(34, 139, 34, 0.45)', // Verde con opacidad - estilo destacado
    fillOpacity: bioregionOpacity, // Opacidad controlable (reutilizando el control existente)
    color: '#083f1a', // Borde verde oscuro para silueta clara
    weight: 2, // Grosor del borde más visible
    opacity: 0.9, // Opacidad del borde
  }

  // Estilos para Comunidades Negras - Color azul/púrpura para diferenciación
  const blackCommunitiesStyle = {
    fillColor: 'rgba(139, 92, 246, 0.5)', // Púrpura/violeta con opacidad
    fillOpacity: bioregionOpacity, // Opacidad controlable
    color: '#5b21b6', // Borde púrpura oscuro para silueta clara
    weight: 2, // Grosor del borde
    opacity: 0.9, // Opacidad del borde
  }

  // Estilos para bioregión - COMENTADA (capa secundaria desactivada)
  // const bioregionStyle = {
  //   fillColor: 'rgba(34, 139, 34, 0.45)', // ForestGreen con opacidad
  //   fillOpacity: bioregionOpacity, // Opacidad controlable por el usuario
  //   color: '#083f1a', // Borde oscuro para silueta clara
  //   weight: 2, // Grosor del borde
  //   opacity: 0.9, // Opacidad del borde
  // }
  

  // Manejo de eventos - Mejorado con hover effects y mejor UX
  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties) {
      const props = feature.properties

      // Popup para Comunidades Negras
      if (props.NOMBRE || props.ULTIMO_NUM) {
        const nombre = props.NOMBRE || 'Comunidad Negra'
        const codigo = props.ULTIMO_NUM || props.CODIGO_DAN || ''
        const municipio = props.MUNICIPIO || ''
        const departamento = props.DEPARTAMEN || '27'
        const areaHa = props.Ha_Total_CC || props.AREA_TOTAL
        const area = areaHa ? `${areaHa.toFixed(2)} ha` : ''
        
        layer.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-base mb-1">${nombre}</h3>
            ${codigo ? `<p class="text-xs text-gray-600 mb-1"><strong>Código:</strong> ${codigo}</p>` : ''}
            ${departamento ? `<p class="text-xs text-gray-600 mb-1"><strong>Departamento:</strong> ${departamento}</p>` : ''}
            ${municipio ? `<p class="text-xs text-gray-600 mb-1"><strong>Municipio:</strong> ${municipio}</p>` : ''}
            ${area ? `<p class="text-xs text-gray-600"><strong>Área:</strong> ${area}</p>` : ''}
          </div>
        `)
      }
      // Popup para municipios (límites administrativos)
      else if (props.MpNombre || props.MpCodigo) {
        const municipio = props.MpNombre || props.NAME || props.name || 'Municipio'
        const codigo = props.MpCodigo || props.CODIGO || ''
        const depto = props.DeptoNom || props.DEPTO || 'Chocó'
        const area = props.AreaHa ? `${(props.AreaHa / 1000).toFixed(2)} km²` : ''
        const altitud = props.MpAltitud ? `${props.MpAltitud} m.s.n.m.` : ''
        const subregion = props.Subregion || ''
        
        layer.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-base mb-1">${municipio}</h3>
            ${codigo ? `<p class="text-xs text-gray-600 mb-1"><strong>Código:</strong> ${codigo}</p>` : ''}
            ${depto ? `<p class="text-xs text-gray-600 mb-1"><strong>Departamento:</strong> ${depto}</p>` : ''}
            ${subregion ? `<p class="text-xs text-gray-600 mb-1"><strong>Subregión:</strong> ${subregion}</p>` : ''}
            ${area ? `<p class="text-xs text-gray-600 mb-1"><strong>Área:</strong> ${area}</p>` : ''}
            ${altitud ? `<p class="text-xs text-gray-600"><strong>Altitud:</strong> ${altitud}</p>` : ''}
          </div>
        `)
      }
      // Popup para bioregión - Simple
      else if (props.name || props.NAME || props.ecoregion) {
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
            discoverNewSpecies(speciesInfo.id)
          })
        }
      }
    }
  }

  // Acciones del mapa
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const handleFitBounds = () => {
    if (!mapRef.current) return
    
    // Si ambas capas están activas, combinar los bounds
    if (activeLayers.adminBoundaries && activeLayers.blackCommunities && adminData && communitiesData) {
      const adminBounds = getBounds(adminData)
      const communitiesBounds = getBounds(communitiesData)
      const adminBoundsArray = adminBounds as [[number, number], [number, number]]
      const communitiesBoundsArray = communitiesBounds as [[number, number], [number, number]]
      
      const combinedBounds = L.latLngBounds(
        [
          Math.min(adminBoundsArray[0][0], communitiesBoundsArray[0][0]),
          Math.min(adminBoundsArray[0][1], communitiesBoundsArray[0][1])
        ],
        [
          Math.max(adminBoundsArray[1][0], communitiesBoundsArray[1][0]),
          Math.max(adminBoundsArray[1][1], communitiesBoundsArray[1][1])
        ]
      )
      mapRef.current.fitBounds(
        [[combinedBounds.getSouth(), combinedBounds.getWest()], [combinedBounds.getNorth(), combinedBounds.getEast()]], 
        { padding: [50, 50], animate: true }
      )
    } else if (activeLayers.blackCommunities && communitiesData) {
      const bounds = getBounds(communitiesData)
      mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true })
    } else if (activeLayers.adminBoundaries && adminData) {
      const bounds = getBounds(adminData)
      mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true })
    }
    // Código comentado - bioregión desactivada
    // if (bioregionData && mapRef.current) {
    //   const bounds = getBounds(bioregionData)
    //   mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true })
    // }
  }

  // Búsqueda de ubicaciones
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
          setSidebarOpen(false)
          setSelectedCity(null)
        }}
        activeLayers={activeLayers}
        toggleLayer={toggleLayer}
        bioregionOpacity={bioregionOpacity}
        onOpacityChange={setBioregionOpacity}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitBounds={handleFitBounds}
        onSearchLocation={handleSearchLocation}
        onToggleMapStyle={handleToggleMapStyle}
        onShareLocation={handleShareLocation}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleCoordinates={handleToggleCoordinates}
        mapStyle={mapStyle}
        isFullscreen={isFullscreen}
        showCoordinates={showCoordinates}
        selectedCity={selectedCity}
        onBackToControls={() => {
          setSelectedCity(null)
          // Ajustar vista a posición inicial
          handleFitBounds()
        }}
      />

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
            'top-20 sm:top-24 md:top-24 lg:top-24',
            'px-3 py-3 sm:px-3.5 sm:py-3.5 md:px-3 md:py-3', // Padding adaptativo
            'rounded-xl',
            'bg-white', // Fondo sólido para mejor visibilidad
            'shadow-2xl shadow-black/20', // Sombra más pronunciada
            'border-2 border-choco-forest-300', // Borde más visible
            'ring-2 ring-choco-forest-100', // Anillo para destacar
            'hover:bg-choco-forest-50 hover:border-choco-forest-400',
            'hover:shadow-2xl hover:shadow-choco-forest-200/50',
            'transition-all duration-200',
            'flex items-center justify-center gap-2', // Gap para texto
            'min-w-[56px] min-h-[48px]', // Tamaño mínimo táctil en móvil
            'md:min-w-[48px] md:min-h-[44px]',
            'active:scale-95' // Feedback táctil
          )}
          aria-label="Abrir panel de controles"
        >
          <Menu className="w-6 h-6 sm:w-5 sm:h-5 text-choco-forest-700 flex-shrink-0" strokeWidth={2.5} />
          <span className="text-xs sm:text-sm font-semibold text-choco-forest-700 hidden sm:inline md:hidden lg:inline">
            Menú
          </span>
        </motion.button>
      )}

      {/* Overlay para móviles cuando el panel está abierto */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-[999]"
        />
      )}

      {/* Mapa */}
      <div className={clsx(
        'flex-1 transition-all duration-300 relative',
        sidebarOpen && 'md:ml-0'
      )}>
        <MapContainer
        center={[5.5, -77]}
        zoom={8} // Zoom inicial más cercano para mejor visualización
        minZoom={7} // Zoom mínimo: vista completa del Chocó
        maxZoom={15} // Zoom máximo: nivel de detalle razonable
        maxBounds={mapBounds || undefined} // Limitar movimiento al área del Chocó
        maxBoundsViscosity={1.0} // Forzar que el mapa permanezca dentro de los bounds
        className="w-full h-full"
        zoomControl={false} // Desactivar controles por defecto de Leaflet para evitar conflictos
        ref={(ref) => {
          if (ref) mapRef.current = ref as unknown as L.Map
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

        {/* Mostrar coordenadas */}
        {showCoordinates && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
            <div className="text-xs font-semibold text-gray-500 mb-1">Coordenadas</div>
            {mouseCoordinates ? (
              <>
                <div className="text-xs font-mono text-gray-700">
                  <div className="text-green-600 font-semibold">Cursor:</div>
                  <div>Lat: {mouseCoordinates.lat.toFixed(6)}</div>
                  <div>Lng: {mouseCoordinates.lng.toFixed(6)}</div>
                </div>
                {currentCoordinates && (
                  <>
                    <div className="text-xs font-mono text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      <div className="text-gray-500 font-semibold">Centro:</div>
                      <div>Lat: {currentCoordinates.lat.toFixed(6)}</div>
                      <div>Lng: {currentCoordinates.lng.toFixed(6)}</div>
                    </div>
                  </>
                )}
              </>
            ) : currentCoordinates ? (
              <div className="text-xs font-mono text-gray-700">
                <div>Lat: {currentCoordinates.lat.toFixed(6)}</div>
                <div>Lng: {currentCoordinates.lng.toFixed(6)}</div>
              </div>
            ) : null}
          </div>
        )}


        {/* CAPA PRINCIPAL: Límites administrativos (municipios) - Resaltada */}
        {activeLayers.adminBoundaries && adminData && adminData.features && adminData.features.length > 0 && (
          <GeoJSON
            key={`admin-boundaries-layer-${adminData.features.length}`}
            data={adminData}
            style={adminBoundariesStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* CAPA: Comunidades Negras - Alternativa a límites municipales */}
        {activeLayers.blackCommunities && communitiesData && communitiesData.features && communitiesData.features.length > 0 && (
          <GeoJSON
            key={`black-communities-layer-${communitiesData.features.length}`}
            data={communitiesData}
            style={blackCommunitiesStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Código comentado - Capa de bioregión desactivada */}
        {/* {activeLayers.bioregion && bioregionData && bioregionData.features && bioregionData.features.length > 0 && (
          <GeoJSON
            key="bioregion-layer"
            data={bioregionData}
            style={bioregionStyle}
            onEachFeature={onEachFeature}
          />
        )} */}

        {/* Marcadores de ciudades */}
        {cities.map((city) => (
          <CityMarker
            key={city.id}
            city={city}
            onClick={(city) => {
              setSelectedCity(city)
              setSidebarOpen(true) // Asegurar que el sidebar esté abierto
            }}
          />
        ))}

        <MapController
          bioregionData={bioregionData}
          adminData={adminData}
          communitiesData={communitiesData}
          activeLayers={activeLayers}
        />
        </MapContainer>
      </div>
    </div>
  )
}
