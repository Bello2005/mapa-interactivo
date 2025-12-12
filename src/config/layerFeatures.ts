// src/config/layerFeatures.ts
// Configuración de features seleccionables por capa

import type { LayerFeatureConfig } from '../types'

export const layerFeaturesConfig: Record<string, LayerFeatureConfig> = {
  'admin-boundaries': {
    layerId: 'admin-boundaries',
    nameProperty: 'name', // El GeoJSON usa 'name' en minúscula
    idProperty: 'name', // Usar 'name' como ID también ya que es único
    searchableProperties: ['name', 'country', 'capital'],
    displayProperties: [
      { key: 'country', label: 'País', icon: 'MapPin', format: 'text' },
      { key: 'area_km2', label: 'Área', icon: 'Ruler', format: 'number', unit: 'km²' },
      { key: 'population', label: 'Población', icon: 'Users', format: 'number' },
      { key: 'capital', label: 'Capital', icon: 'MapPin', format: 'text' },
      { key: 'admin_level', label: 'Nivel Administrativo', icon: 'Hash', format: 'text' }
    ]
  },
  'comunidades-negras': {
    layerId: 'comunidades-negras',
    nameProperty: 'NOMBRE',
    idProperty: 'OBJECTID',
    searchableProperties: ['NOMBRE', 'ULTIMO_NUM'],
    displayProperties: [
      { key: 'ULTIMO_NUM', label: 'Resolución', icon: 'FileText', format: 'text' },
      { key: 'Ha_Total_CC', label: 'Área Total', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'CODIGO_DAN', label: 'Código DANE', icon: 'Hash', format: 'text' },
      { key: 'ID', label: 'ID Consejo', icon: 'Users', format: 'text' }
    ]
  },
  'resguardos-indigenas': {
    layerId: 'resguardos-indigenas',
    nameProperty: 'NOMBRE',
    idProperty: 'OBJECTID',
    searchableProperties: ['NOMBRE', 'PUEBLO', 'DEPARTAMEN'],
    displayProperties: [
      { key: 'PUEBLO', label: 'Pueblo Indígena', icon: 'Users', format: 'text' },
      { key: 'DEPARTAMEN', label: 'Departamento', icon: 'MapPin', format: 'text' },
      { key: 'AREA_HA', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'ACTO_ADMIN', label: 'Acto Administrativo', icon: 'FileText', format: 'text' }
    ]
  },
  // 'cuencas': {
  //   layerId: 'cuencas',
  //   nameProperty: 'NOMBRE',
  //   idProperty: 'COD_CUENCA',
  //   searchableProperties: ['NOMBRE', 'SUBZONA', 'COD_CUENCA'],
  //   displayProperties: [
  //     { key: 'SUBZONA', label: 'Subzona Hidrográfica', icon: 'Waves', format: 'text' },
  //     { key: 'AREA_KM2', label: 'Área', icon: 'Ruler', format: 'number', unit: 'km²' },
  //     { key: 'COD_CUENCA', label: 'Código de Cuenca', icon: 'Hash', format: 'text' }
  //   ]
  // },
  // Nota: Comentado porque no existe el archivo GeoJSON correspondiente
  'ecosistemas': {
    layerId: 'ecosistemas',
    nameProperty: 'ecos_general', // El GeoJSON usa 'ecos_general' para nombres descriptivos
    idProperty: 'OBJECTID',
    searchableProperties: ['ecos_general', 'ecos_sintesis', 'bioma_IAvH', 'tipo_ecos'],
    displayProperties: [
      { key: 'bioma_IAvH', label: 'Bioma', icon: 'TreePine', format: 'text' },
      { key: 'tipo_ecos', label: 'Tipo de Ecosistema', icon: 'Leaf', format: 'text' },
      { key: 'area_ha', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'ecos_sintesis', label: 'Ecosistema Síntesis', icon: 'Leaf', format: 'text' }
    ]
  },
  'manglares': {
    layerId: 'manglares',
    nameProperty: 'NOMBRE', // Esta propiedad no existe en el GeoJSON, por lo que todos serán "Sin nombre" y se filtrarán
    idProperty: 'OBJECTID',
    searchableProperties: ['NOMBRE', 'MUNICIPIO', 'TIPO'],
    displayProperties: [
      { key: 'MUNICIPIO', label: 'Municipio', icon: 'MapPin', format: 'text' },
      { key: 'TIPO', label: 'Tipo de Manglar', icon: 'TreePine', format: 'text' },
      { key: 'AREA_HA', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'ESTADO', label: 'Estado', icon: 'Info', format: 'text' }
    ]
  },
  'runap': {
    layerId: 'runap',
    nameProperty: 'ap_nombre', // El GeoJSON usa 'ap_nombre', no 'NOMBRE'
    idProperty: 'OBJECTID',
    searchableProperties: ['ap_nombre', 'ap_categor', 'condicion'],
    displayProperties: [
      { key: 'ap_categor', label: 'Categoría', icon: 'ShieldCheck', format: 'text' },
      { key: 'condicion', label: 'Condición', icon: 'Info', format: 'text' },
      { key: 'area_ha_to', label: 'Área Total', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'organizaci', label: 'Organización', icon: 'Building', format: 'text' },
      { key: 'fecha_regi', label: 'Fecha de Registro', icon: 'Calendar', format: 'date' }
    ]
  },
  'humedales': {
    layerId: 'humedales',
    nameProperty: 'humedales', // El GeoJSON usa 'humedales' para el nombre del tipo
    idProperty: 'OBJECTID',
    searchableProperties: ['humedales', 'id', 'gridcode'],
    displayProperties: [
      { key: 'id', label: 'ID', icon: 'Hash', format: 'text' },
      { key: 'gridcode', label: 'Código Grid', icon: 'Hash', format: 'text' },
      { key: 'AreaHa', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' }
    ]
  },
  'paramos': {
    layerId: 'paramos',
    nameProperty: 'Nombre', // El GeoJSON usa 'Nombre' con mayúscula inicial
    idProperty: 'OBJECTID',
    searchableProperties: ['Nombre', 'Id', 'Acto_Admin', 'Fuente'],
    displayProperties: [
      { key: 'Id', label: 'ID', icon: 'Hash', format: 'text' },
      { key: 'Area_Ha', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'Acto_Admin', label: 'Acto Administrativo', icon: 'FileText', format: 'text' },
      { key: 'Fecha_Acto', label: 'Fecha del Acto', icon: 'Calendar', format: 'date' },
      { key: 'Fuente', label: 'Fuente', icon: 'Info', format: 'text' }
    ]
  },
  'sedes-iiap': {
    layerId: 'sedes-iiap',
    nameProperty: 'Sede',
    idProperty: 'OBJECTID',
    searchableProperties: ['Sede', 'Municipio', 'TipoSede'],
    displayProperties: [
      { key: 'Municipio', label: 'Municipio', icon: 'MapPin', format: 'text' },
      { key: 'TipoSede', label: 'Tipo de Sede', icon: 'Building', format: 'text' }
    ]
  }
}

// Helper para verificar si una capa tiene features seleccionables
export function hasSelectableFeatures(layerId: string): boolean {
  return layerId in layerFeaturesConfig
}

// Helper para obtener config de una capa
export function getLayerFeatureConfig(layerId: string): LayerFeatureConfig | null {
  return layerFeaturesConfig[layerId] || null
}

// Helper para obtener el número de capas configuradas
export function getConfiguredLayersCount(): number {
  return Object.keys(layerFeaturesConfig).length
}

