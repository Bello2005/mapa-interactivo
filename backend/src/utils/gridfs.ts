// backend/src/utils/gridfs.ts
// Utilidades para GridFS

import { GridFSBucket } from 'mongodb'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUCKET_NAME = 'geojson'

export function getGridFSBucket(): GridFSBucket {
  return new GridFSBucket(mongoose.connection.db, {
    bucketName: BUCKET_NAME,
  })
}

export async function uploadToGridFS(
  filePath: string,
  filename: string
): Promise<mongoose.Types.ObjectId> {
  const bucket = getGridFSBucket()
  const readStream = fs.createReadStream(filePath)

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'application/json',
    })

    readStream.pipe(uploadStream)

    uploadStream.on('finish', () => {
      resolve(uploadStream.id as mongoose.Types.ObjectId)
    })

    uploadStream.on('error', (error) => {
      reject(error)
    })
  })
}

export async function downloadFromGridFS(
  fileId: mongoose.Types.ObjectId,
  outputPath: string
): Promise<void> {
  const bucket = getGridFSBucket()
  const downloadStream = bucket.openDownloadStream(fileId)
  const writeStream = fs.createWriteStream(outputPath)

  return new Promise((resolve, reject) => {
    downloadStream.pipe(writeStream)

    writeStream.on('finish', () => {
      resolve()
    })

    writeStream.on('error', (error) => {
      reject(error)
    })

    downloadStream.on('error', (error) => {
      reject(error)
    })
  })
}

export async function deleteFromGridFS(fileId: mongoose.Types.ObjectId): Promise<void> {
  const bucket = getGridFSBucket()
  await bucket.delete(fileId)
}






