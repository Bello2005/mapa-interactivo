# Backend - Chocó Biogeográfico

Backend minimalista con MongoDB para gestionar metadata de capas temáticas.

## Requisitos

- Node.js 18+
- MongoDB 7.0+ (local o Atlas)

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Editar `.env` con tus configuraciones:
```env
MONGODB_URI=mongodb://localhost:27017/choco-biogeografico
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## Scripts

### Seed de capas (metadata)
```bash
npm run seed
```

Pobla MongoDB con metadata de capas desde la configuración del frontend.

### Seed forzado (sobrescribir)
```bash
npm run seed:force
```

### Importar GeoJSON
```bash
npm run import-geojson
```

Importa GeoJSON a MongoDB:
- Archivos < 10MB → Guardados como documentos
- Archivos > 10MB → Guardados en GridFS

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/layers` - Listar todas las capas (metadata)
- `GET /api/layers/:id` - Obtener metadata de capa
- `GET /api/layers/:id/geojson` - Obtener GeoJSON de la capa
- `GET /api/layers/categories/list` - Listar categorías

## Estrategia de Almacenamiento

- **< 10MB**: MongoDB documento (geojsonData)
- **> 10MB**: GridFS (gridfsFileId)
- **Filesystem**: Metadata en MongoDB, archivo en `/public/data/`
- **GeoServer**: Metadata en MongoDB, URL del GeoServer

## Notas

- El frontend funciona sin backend (modo estático)
- El backend es opcional pero recomendado para gestión futura
- GridFS se usa automáticamente para archivos grandes



