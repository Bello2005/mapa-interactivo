// backend/src/models/Layer.ts
// Modelo de Mongoose para capas temáticas

import { Schema, model, type Document } from 'mongoose'

export interface ILayer extends Document {
  id: string
  name: string
  description: string
  category: 'ecosistemas' | 'social' | 'hidrografia' | 'conservacion' | 'fisico'
  source: 'geojson' | 'geoserver' | 'static'
  storageType: 'mongodb' | 'gridfs' | 'filesystem' | 'geoserver'
  geojsonData?: object // GeoJSON embebido para archivos pequeños
  geojsonPath?: string // Ruta en filesystem
  gridfsFileId?: Schema.Types.ObjectId // ID en GridFS
  geoserverLayer?: string // Nombre de capa en GeoServer
  fileSize?: number // bytes
  featureCount?: number
  color: string
  opacity: number
  order: number
  metadata?: {
    source: string
    year?: number
    resolution?: string
  }
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

const LayerSchema = new Schema<ILayer>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['ecosistemas', 'social', 'hidrografia', 'conservacion', 'fisico'],
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ['geojson', 'geoserver', 'static'],
      required: true,
    },
    storageType: {
      type: String,
      enum: ['mongodb', 'gridfs', 'filesystem', 'geoserver'],
      required: true,
    },
    geojsonData: {
      type: Schema.Types.Mixed,
    },
    geojsonPath: {
      type: String,
    },
    gridfsFileId: {
      type: Schema.Types.ObjectId,
    },
    geoserverLayer: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    featureCount: {
      type: Number,
    },
    color: {
      type: String,
      required: true,
    },
    opacity: {
      type: Number,
      required: true,
      default: 0.5,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    metadata: {
      source: String,
      year: Number,
      resolution: String,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Índices
LayerSchema.index({ category: 1, order: 1 })
LayerSchema.index({ enabled: 1 })

export const Layer = model<ILayer>('Layer', LayerSchema)

