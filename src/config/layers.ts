// src/config/layers.ts
// Configuración de capas temáticas del mapa

import type { ThematicLayer } from '../types'

// Capas rápidas (modo "Rápido") inspiradas en las 6 sugeridas
export const quickLayers = [
  'admin-boundaries',
  'comunidades-negras',
  'resguardos-indigenas',
  'runap',
  'manglares',
  'sedes-iiap',
]

export const thematicLayers: ThematicLayer[] = [
  // Ecosistemas
  {
    id: 'paramos',
    name: 'Páramos',
    description: 'Ecosistemas de alta montaña únicos de los Andes',
    category: 'ecosistemas',
    source: 'geojson',
    storageType: 'filesystem',
    geojsonPath: '/data/paramos.geojson',
    color: '#8B7355',
    opacity: 0.6,
    visible: false,
    order: 1,
    enabled: true,
    metadata: {
      source: 'MADS 2012',
      year: 2012,
      resolution: '100k'
    }
  },
  {
    id: 'ecosistemas',
    name: 'Ecosistemas',
    description: 'Clasificación de ecosistemas según IDEAM',
    category: 'ecosistemas',
    source: 'geojson',
    storageType: 'gridfs',
    geojsonPath: '/data/ecosistemas.geojson',
    color: '#228B22',
    opacity: 0.5,
    visible: false,
    order: 2,
    enabled: true,
    metadata: {
      source: 'IDEAM 2024',
      year: 2024,
      resolution: '100k'
    }
  },
  {
    id: 'manglares',
    name: 'Manglares',
    description: 'Ecosistemas de manglar en la costa del Pacífico',
    category: 'ecosistemas',
    source: 'geojson',
    storageType: 'gridfs',
    geojsonPath: '/data/manglares.geojson',
    color: '#2F4F2F',
    opacity: 0.7,
    visible: false,
    order: 3,
    enabled: true,
    metadata: {
      source: 'INVEMAR SIGMA V8',
      year: 2022,
      resolution: '25k'
    }
  },
  {
    id: 'humedales',
    name: 'Humedales',
    description: 'Áreas de humedales del Chocó biogeográfico',
    category: 'ecosistemas',
    source: 'geojson',
    storageType: 'gridfs',
    geojsonPath: '/data/humedales.geojson',
    color: '#4682B4',
    opacity: 0.5,
    visible: false,
    order: 4,
    enabled: true,
    metadata: {
      source: 'IvAH 2015',
      year: 2015,
      resolution: '100k'
    }
  },
  {
    id: 'bosque-seco',
    name: 'Bosque Seco Tropical',
    description: 'Ecosistemas de bosque seco tropical',
    category: 'ecosistemas',
    source: 'geojson',
    storageType: 'filesystem',
    geojsonPath: '/data/bosque_seco_tropical.geojson',
    color: '#CD853F',
    opacity: 0.6,
    visible: false,
    order: 5,
    enabled: true,
    metadata: {
      source: 'IvAH 2014',
      year: 2014,
      resolution: '100k'
    }
  },
  {
    id: 'cienagas',
    name: 'Ciénagas',
    description: 'Ciénagas del Chocó biogeográfico',
    category: 'ecosistemas',
    source: 'geojson',
    storageType: 'gridfs',
    geojsonPath: '/data/cienagas.geojson',
    color: '#5F9EA0',
    opacity: 0.5,
    visible: false,
    order: 6,
    enabled: true,
    metadata: {
      source: 'CTM12 ChBio 2019',
      year: 2019,
      resolution: '100k'
    }
  },

  // Social
  {
    id: 'comunidades-negras',
    name: 'Comunidades Negras',
    description: 'Territorios colectivos de comunidades afrocolombianas',
    category: 'social',
    source: 'geojson',
    storageType: 'gridfs',
    geojsonPath: '/data/comunidades_negras.geojson',
    color: '#8B4513',
    opacity: 0.6,
    visible: false,
    order: 10,
    enabled: true,
    metadata: {
      source: 'ANT 2025',
      year: 2025,
      resolution: '100k'
    }
  },
  {
    id: 'resguardos-indigenas',
    name: 'Resguardos Indígenas',
    description: 'Territorios indígenas del Chocó biogeográfico',
    category: 'social',
    source: 'geojson',
    storageType: 'filesystem',
    geojsonPath: '/data/resguardos_indigenas.geojson',
    color: '#A0522D',
    opacity: 0.6,
    visible: false,
    order: 11,
    enabled: true,
    metadata: {
      source: 'ANT 2025',
      year: 2025,
      resolution: '100k'
    }
  },
  {
    id: 'consejos-comunitarios',
    name: 'Consejos Comunitarios',
    description: 'Organizaciones comunitarias del Chocó',
    category: 'social',
    source: 'geoserver',
    storageType: 'geoserver',
    geoserverLayer: 'IIAP:Consejos_comunitario',
    color: '#8B4513',
    opacity: 0.5,
    visible: false,
    order: 12,
    enabled: true,
    metadata: {
      source: 'IIAP GeoServer',
      resolution: '100k'
    }
  },

  // Hidrografía
  // Capa 'cuencas' eliminada - requiere GeoServer del backend y no muestra datos
  {
    id: 'drenaje',
    name: 'Drenaje',
    description: 'Sistema de drenaje doble',
    category: 'hidrografia',
    source: 'geojson',
    storageType: 'gridfs',
    geojsonPath: '/data/drenaje_doble.geojson',
    color: '#1E90FF',
    opacity: 0.4,
    visible: false,
    order: 21,
    enabled: true,
    metadata: {
      source: 'CTM12 ChBio 2019',
      year: 2019,
      resolution: '100k'
    }
  },

  // Conservación
  {
    id: 'runap',
    name: 'Parques Nacionales (RUNAP)',
    description: 'Áreas protegidas del Sistema de Parques Nacionales',
    category: 'conservacion',
    source: 'geojson',
    storageType: 'filesystem',
    geojsonPath: '/data/runap.geojson',
    color: '#32CD32',
    opacity: 0.65,
    visible: false,
    order: 30,
    enabled: true,
    metadata: {
      source: 'SPNN Jul 2025',
      year: 2025,
      resolution: '100k'
    }
  },

  // Institucional
  {
    id: 'sedes-iiap',
    name: 'Sedes IIAP',
    description: 'Ubicación de las sedes técnicas y administrativas del IIAP',
    category: 'fisico',
    source: 'geojson',
    storageType: 'filesystem',
    geojsonPath: '/data/sedes_iiap.geojson',
    color: '#DC2626',
    opacity: 0.8,
    visible: false,
    order: 50,
    enabled: true,
    metadata: {
      source: 'IIAP',
      resolution: 'point'
    }
  },

  // Físico
  // Capa bioregion deshabilitada por solicitud del usuario
  // {
  //   id: 'bioregion',
  //   name: 'Chocó Biogeográfico',
  //   description: 'Límite del Chocó biogeográfico',
  //   category: 'fisico',
  //   source: 'geojson',
  //   storageType: 'filesystem',
  //   geojsonPath: '/data/bioregion.geojson',
  //   color: '#228B22',
  //   opacity: 0.3,
  //   visible: false,
  //   order: 40,
  //   enabled: false,
  //   metadata: {
  //     source: 'WWF TEOW 2017',
  //     year: 2017,
  //     resolution: '100k'
  //   }
  // },
  {
    id: 'geologia',
    name: 'Geología',
    description: 'Formaciones geológicas del Chocó biogeográfico',
    category: 'fisico',
    source: 'geojson',
    storageType: 'gridfs',
    geojsonPath: '/data/geologia.geojson',
    color: '#8B4513',
    opacity: 0.5,
    visible: false,
    order: 40,
    enabled: true,
    metadata: {
      source: 'IIAP',
      resolution: '100k'
    }
  },
  {
    id: 'geomorfologia',
    name: 'Geomorfología',
    description: 'Formas del terreno del Chocó biogeográfico',
    category: 'fisico',
    source: 'geojson',
    storageType: 'filesystem',
    geojsonPath: '/data/geomorfologia.geojson',
    color: '#A0522D',
    opacity: 0.5,
    visible: false,
    order: 40.5,
    enabled: true,
    metadata: {
      source: 'IIAP',
      resolution: '100k'
    }
  },
  {
    id: 'climas',
    name: 'Climas',
    description: 'Clasificación climática del Chocó biogeográfico',
    category: 'fisico',
    source: 'geoserver',
    storageType: 'geoserver',
    geoserverLayer: 'IIAP:Climas',
    color: '#4169E1',
    opacity: 0.5,
    visible: false,
    order: 40.7,
    enabled: true,
    metadata: {
      source: 'IIAP GeoServer',
      resolution: '100k'
    }
  },
  {
    id: 'suelos',
    name: 'Suelos',
    description: 'Tipos de suelo del Chocó biogeográfico',
    category: 'fisico',
    source: 'geoserver',
    storageType: 'geoserver',
    geoserverLayer: 'IIAP:suelos',
    color: '#CD853F',
    opacity: 0.5,
    visible: false,
    order: 40.8,
    enabled: true,
    metadata: {
      source: 'IIAP GeoServer',
      resolution: '100k'
    }
  },
  {
    id: 'fisiografia',
    name: 'Fisiografía IDEAM 2017',
    description: 'Características físicas del terreno según IDEAM 2017',
    category: 'fisico',
    source: 'geoserver',
    storageType: 'geoserver',
    geoserverLayer: 'IIAP:Fisiografia_IDEAM_2017',
    color: '#708090',
    opacity: 0.5,
    visible: false,
    order: 40.9,
    enabled: true,
    metadata: {
      source: 'IDEAM 2017',
      year: 2017,
      resolution: '100k'
    }
  },
  {
    id: 'admin-boundaries',
    name: 'Límites Municipales',
    description: 'Límites municipales del Chocó Biogeográfico (93 municipios)',
    category: 'fisico',
    source: 'geojson',
    storageType: 'filesystem',
    geojsonPath: '/data/Limite_Mpal_ChBio_2019_CMT12_v3.geojson',
    color: '#10B981', // Verde esmeralda moderno (Tailwind emerald-500)
    opacity: 0.45, // Opacidad mejorada para mejor visibilidad
    visible: true,
    order: 41,
    enabled: true,
    metadata: {
      source: 'CMT12 ChBio 2019',
      year: 2019,
      resolution: '100k'
    }
  }
]

// Función helper para obtener capas por categoría
export function getLayersByCategory(category: ThematicLayer['category']): ThematicLayer[] {
  return thematicLayers.filter(layer => layer.category === category && layer.enabled !== false)
}

// Función helper para obtener todas las categorías
export function getLayerCategories(): ThematicLayer['category'][] {
  return Array.from(new Set(thematicLayers.map(layer => layer.category)))
}

// Función helper para obtener capa por ID
export function getLayerById(id: string): ThematicLayer | undefined {
  return thematicLayers.find(layer => layer.id === id)
}
