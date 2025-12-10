// src/config/layerFeatures.ts
// Configuración de features seleccionables por capa

import type { LayerFeatureConfig } from '../types'

export const layerFeaturesConfig: Record<string, LayerFeatureConfig> = {
  'admin-boundaries': {
    layerId: 'admin-boundaries',
    nameProperty: 'MpNombre',
    idProperty: 'MpCodigo',
    searchableProperties: ['MpNombre', 'DeptoNom', 'Subregion'],
    displayProperties: [
      { key: 'DeptoNom', label: 'Departamento', icon: 'MapPin', format: 'text' },
      { key: 'AreaHa', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'MpAltitud', label: 'Altitud', icon: 'Mountain', format: 'altitude', unit: 'msnm' },
      { key: 'MpCodigo', label: 'Código Municipal', icon: 'Hash', format: 'text' },
      { key: 'Subregion', label: 'Subregión', icon: 'Map', format: 'text' }
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
  'cuencas': {
    layerId: 'cuencas',
    nameProperty: 'NOMBRE',
    idProperty: 'COD_CUENCA',
    searchableProperties: ['NOMBRE', 'SUBZONA', 'COD_CUENCA'],
    displayProperties: [
      { key: 'SUBZONA', label: 'Subzona Hidrográfica', icon: 'Waves', format: 'text' },
      { key: 'AREA_KM2', label: 'Área', icon: 'Ruler', format: 'number', unit: 'km²' },
      { key: 'COD_CUENCA', label: 'Código de Cuenca', icon: 'Hash', format: 'text' }
    ]
  },
  'ecosistemas': {
    layerId: 'ecosistemas',
    nameProperty: 'ECOSISTEMA',
    idProperty: 'OBJECTID',
    searchableProperties: ['ECOSISTEMA', 'BIOMA', 'TIPO'],
    displayProperties: [
      { key: 'BIOMA', label: 'Bioma', icon: 'TreePine', format: 'text' },
      { key: 'TIPO', label: 'Tipo de Ecosistema', icon: 'Leaf', format: 'text' },
      { key: 'AREA_HA', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'ESTADO', label: 'Estado de Conservación', icon: 'ShieldCheck', format: 'text' }
    ]
  },
  'manglares': {
    layerId: 'manglares',
    nameProperty: 'NOMBRE',
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
    nameProperty: 'NOMBRE',
    idProperty: 'OBJECTID',
    searchableProperties: ['NOMBRE', 'CATEGORIA', 'DEPARTAMEN'],
    displayProperties: [
      { key: 'CATEGORIA', label: 'Categoría', icon: 'ShieldCheck', format: 'text' },
      { key: 'DEPARTAMEN', label: 'Departamento', icon: 'MapPin', format: 'text' },
      { key: 'AREA_HA', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'ACTO_ADMIN', label: 'Acto Administrativo', icon: 'FileText', format: 'text' },
      { key: 'FECHA_CREA', label: 'Fecha de Creación', icon: 'Calendar', format: 'date' }
    ]
  },
  'humedales': {
    layerId: 'humedales',
    nameProperty: 'NOMBRE',
    idProperty: 'OBJECTID',
    searchableProperties: ['NOMBRE', 'TIPO', 'MUNICIPIO'],
    displayProperties: [
      { key: 'TIPO', label: 'Tipo de Humedal', icon: 'Waves', format: 'text' },
      { key: 'MUNICIPIO', label: 'Municipio', icon: 'MapPin', format: 'text' },
      { key: 'AREA_HA', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'IMPORTANCI', label: 'Importancia', icon: 'Star', format: 'text' }
    ]
  },
  'paramos': {
    layerId: 'paramos',
    nameProperty: 'NOMBRE',
    idProperty: 'OBJECTID',
    searchableProperties: ['NOMBRE', 'COMPLEJO', 'DEPARTAMEN'],
    displayProperties: [
      { key: 'COMPLEJO', label: 'Complejo de Páramo', icon: 'Mountain', format: 'text' },
      { key: 'DEPARTAMEN', label: 'Departamento', icon: 'MapPin', format: 'text' },
      { key: 'AREA_HA', label: 'Área', icon: 'Ruler', format: 'area', unit: 'ha' },
      { key: 'ALTITUD', label: 'Altitud', icon: 'TrendingUp', format: 'altitude', unit: 'msnm' }
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

