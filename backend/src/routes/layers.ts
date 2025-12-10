// backend/src/routes/layers.ts
// Rutas API para capas temáticas

import { Router, type Request, type Response } from 'express'
import { Layer } from '../models/Layer.js'
import { GridFSBucket } from 'mongodb'
import mongoose from 'mongoose'

const router = Router()

// GET /api/layers - Listar todas las capas (solo metadata)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, enabled } = req.query

    const filter: any = {}
    if (category) filter.category = category
    if (enabled !== undefined) filter.enabled = enabled === 'true'

    const layers = await Layer.find(filter)
      .select('-geojsonData') // Excluir GeoJSON de la lista
      .sort({ order: 1, category: 1 })
      .lean()

    res.json({
      success: true,
      count: layers.length,
      data: layers,
    })
  } catch (error) {
    console.error('Error fetching layers:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener capas',
    })
  }
})

// GET /api/layers/:id - Obtener metadata de capa específica
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const layer = await Layer.findOne({ id: req.params.id })
      .select('-geojsonData') // Excluir GeoJSON por defecto
      .lean()

    if (!layer) {
      return res.status(404).json({
        success: false,
        error: 'Capa no encontrada',
      })
    }

    res.json({
      success: true,
      data: layer,
    })
  } catch (error) {
    console.error('Error fetching layer:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener capa',
    })
  }
})

// GET /api/layers/:id/geojson - Obtener GeoJSON de la capa
router.get('/:id/geojson', async (req: Request, res: Response) => {
  try {
    const layer = await Layer.findOne({ id: req.params.id }).lean()

    if (!layer) {
      return res.status(404).json({
        success: false,
        error: 'Capa no encontrada',
      })
    }

    let geojson: any = null

    // Estrategia según storageType
    if (layer.storageType === 'mongodb' && layer.geojsonData) {
      // GeoJSON embebido en documento
      geojson = layer.geojsonData
    } else if (layer.storageType === 'gridfs' && layer.gridfsFileId) {
      // GeoJSON en GridFS
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'geojson',
      })

      const files = await bucket.find({ _id: layer.gridfsFileId }).toArray()
      if (files.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Archivo GeoJSON no encontrado en GridFS',
        })
      }

      const downloadStream = bucket.openDownloadStream(layer.gridfsFileId)
      const chunks: Buffer[] = []

      downloadStream.on('data', (chunk) => chunks.push(chunk))
      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks)
        geojson = JSON.parse(buffer.toString('utf-8'))
        res.json({
          success: true,
          data: geojson,
        })
      })
      downloadStream.on('error', (error) => {
        console.error('Error reading from GridFS:', error)
        res.status(500).json({
          success: false,
          error: 'Error al leer GeoJSON desde GridFS',
        })
      })
      return
    } else if (layer.storageType === 'filesystem' && layer.geojsonPath) {
      // GeoJSON en filesystem - redirigir al frontend
      return res.json({
        success: true,
        redirect: layer.geojsonPath,
      })
    } else if (layer.storageType === 'geoserver' && layer.geoserverLayer) {
      // GeoJSON desde GeoServer - devolver URL
      return res.json({
        success: true,
        geoserverUrl: `https://www1.siatpc.co/geoserver/IIAP/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=IIAP:${layer.geoserverLayer}&outputFormat=application/json`,
      })
    }

    if (!geojson) {
      return res.status(404).json({
        success: false,
        error: 'GeoJSON no disponible para esta capa',
      })
    }

    res.json({
      success: true,
      data: geojson,
    })
  } catch (error) {
    console.error('Error fetching layer GeoJSON:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener GeoJSON',
    })
  }
})

// GET /api/layers/categories - Listar categorías disponibles
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const categories = await Layer.distinct('category', { enabled: true })
    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener categorías',
    })
  }
})

export default router

