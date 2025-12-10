# Plan de Migración a MongoDB - Chocó Biogeográfico

## Resumen Ejecutivo

**Objetivo:** Migrar datos estáticos (JSON/GeoJSON) a MongoDB con un backend minimalista de solo lectura.

**Alcance:**
- Backend Node.js + Express ultra-simple (solo GET endpoints)
- MongoDB local (el cliente tiene control total)
- Scripts de migración automatizados
- Actualización del frontend para consumir API
- Todo el código y datos entregables al cliente

**Tiempo estimado:** 4-6 horas de implementación

---

## 1. Arquitectura del Sistema

```
┌─────────────────┐
│  Frontend React │
│   (Vite + TS)   │
└────────┬────────┘
         │ HTTP REST
         │ (GET only)
         ▼
┌─────────────────┐
│ Backend Express │
│  (TypeScript)   │
│   4 endpoints   │
└────────┬────────┘
         │ Mongoose
         ▼
┌─────────────────┐
│  MongoDB Local  │
│   4 colecciones │
└─────────────────┘
```

### Stack Tecnológico

**Backend:**
- Node.js 18+
- Express 4.x
- Mongoose 8.x
- TypeScript 5.x
- CORS habilitado

**Base de Datos:**
- MongoDB 7.0+ (local)
- 4 colecciones principales

---

## 2. Estructura del Proyecto

```
botonera-frontend/
├── backend/                    # NUEVO - Backend minimalista
│   ├── src/
│   │   ├── models/            # Schemas de Mongoose
│   │   │   ├── Species.ts
│   │   │   ├── Trivia.ts
│   │   │   ├── Bioregion.ts
│   │   │   └── Boundary.ts
│   │   ├── routes/            # Rutas de la API
│   │   │   └── index.ts
│   │   ├── config/            # Configuración
│   │   │   └── database.ts
│   │   └── server.ts          # Servidor principal
│   ├── scripts/               # Scripts de migración
│   │   └── migrate.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── src/                        # Frontend existente
│   ├── services/              # NUEVO - Servicios API
│   │   └── api.ts
│   └── ...
├── public/data/               # Datos actuales (migrar a MongoDB)
└── ...
```

---

## 3. Schemas de MongoDB

### 3.1 Species Collection

```typescript
{
  _id: ObjectId,
  id: String (unique, indexed),
  scientificName: String (indexed),
  commonName: String (indexed),
  commonNameLocal: String,
  category: String (indexed), // 'aves' | 'mamiferos' | 'reptiles' | 'anfibios' | 'plantas'
  family: String,
  description: String,
  habitat: String,
  diet: String,
  threatStatus: String (indexed), // 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX'
  endemic: Boolean (indexed),
  image: String,
  imageCredit: String,
  funFacts: [String],
  conservationInfo: String,
  iucnLink: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `id` (unique)
- `category`
- `threatStatus`
- `endemic`
- `scientificName` (text search)
- `commonName` (text search)

### 3.2 Trivia Collection

```typescript
{
  _id: ObjectId,
  id: String (unique, indexed),
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
  category: String (indexed), // 'geografia' | 'fauna' | 'flora' | 'conservacion' | 'cultura'
  difficulty: String (indexed), // 'facil' | 'medio' | 'dificil'
  points: Number,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `id` (unique)
- `category`
- `difficulty`

### 3.3 Bioregion Collection (GeoJSON)

```typescript
{
  _id: ObjectId,
  type: "Feature",
  properties: {
    name: String,
    description: String,
    area_km2: Number,
    countries: [String],
    version: String
  },
  geometry: {
    type: "MultiPolygon" | "Polygon",
    coordinates: [[[Number]]] // GeoJSON coordinates
  }
}
```

**Índices:**
- `geometry` (2dsphere) - Para queries geoespaciales

### 3.4 Boundaries Collection (GeoJSON)

```typescript
{
  _id: ObjectId,
  type: "Feature",
  properties: {
    NAME: String,
    name: String,
    admin_level: Number
  },
  geometry: {
    type: "Polygon" | "MultiPolygon",
    coordinates: [[[Number]]]
  }
}
```

**Índices:**
- `geometry` (2dsphere)
- `properties.NAME`

---

## 4. API Endpoints (Solo GET)

### Base URL: `http://localhost:3001/api`

| Endpoint | Método | Descripción | Query Params |
|----------|--------|-------------|--------------|
| `/species` | GET | Listar todas las especies | `?category=aves&endemic=true&threatStatus=CR` |
| `/species/:id` | GET | Obtener especie por ID | - |
| `/trivia` | GET | Listar preguntas de trivia | `?category=fauna&difficulty=medio` |
| `/bioregion` | GET | GeoJSON del Chocó biogeográfico | - |
| `/boundaries` | GET | Límites administrativos (GeoJSON) | - |
| `/species-ranges` | GET | Rangos de especies (GeoJSON) | `?speciesId=ave-001` |
| `/health` | GET | Health check | - |

### Ejemplos de Respuestas

**GET /api/species?category=aves**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "ave-001",
      "scientificName": "Chlorochrysa nitidissima",
      "commonName": "Tangara Multicolor",
      "category": "aves",
      "endemic": true,
      ...
    }
  ]
}
```

**GET /api/bioregion**
```json
{
  "success": true,
  "data": {
    "type": "FeatureCollection",
    "features": [...]
  }
}
```

---

## 5. Implementación del Backend

### 5.1 Dependencias (package.json)

```json
{
  "name": "choco-biogeografico-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "tsx scripts/migrate.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0"
  }
}
```

### 5.2 Estructura Básica

**backend/src/server.ts** (~50 líneas)
- Inicializar Express
- Configurar CORS
- Conectar a MongoDB
- Montar rutas
- Iniciar servidor

**backend/src/routes/index.ts** (~100 líneas)
- 6 endpoints GET
- Validación simple de query params
- Manejo de errores

**backend/src/models/** (4 archivos, ~40 líneas c/u)
- Schemas de Mongoose
- Validaciones básicas

**backend/src/config/database.ts** (~20 líneas)
- Conexión a MongoDB con Mongoose

---

## 6. Script de Migración

### 6.1 Proceso de Migración

```bash
npm run migrate
```

**Pasos:**
1. Conectar a MongoDB
2. Limpiar colecciones existentes (opcional)
3. Leer archivos JSON/GeoJSON de `../public/data/`
4. Validar estructura de datos
5. Insertar en MongoDB con índices
6. Verificar conteo de documentos
7. Mostrar reporte de migración

### 6.2 Resultado Esperado

```
🚀 Iniciando migración de datos...

📦 Migrando especies...
   ✓ 15 especies insertadas

📦 Migrando preguntas de trivia...
   ✓ 20 preguntas insertadas

📦 Migrando bioregión...
   ✓ 1 feature(s) insertadas

📦 Migrando límites administrativos...
   ✓ 3 features insertadas

✅ Migración completada exitosamente
📊 Total: 39 documentos insertados
```

---

## 7. Actualización del Frontend

### 7.1 Servicio API (src/services/api.ts)

```typescript
// Configuración base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Funciones para consumir API
export async function getSpecies(filters?: {...}) { ... }
export async function getSpeciesById(id: string) { ... }
export async function getTrivia(filters?: {...}) { ... }
export async function getBioregion() { ... }
export async function getBoundaries() { ... }
```

### 7.2 Cambios en Componentes

**MapView.tsx:**
- Línea 127-143: Cambiar `fetch('/data/...')` por `api.getBioregion()`
- Añadir manejo de errores mejorado
- Añadir loading states

**TriviaContainer.tsx:**
- Línea 38: Cambiar `fetch('/data/trivia.json')` por `api.getTrivia()`

### 7.3 Variables de Entorno

**frontend/.env**
```env
VITE_API_URL=http://localhost:3001/api
```

**frontend/.env.production**
```env
VITE_API_URL=https://api-choco.cliente.com/api
```

---

## 8. Setup y Deployment

### 8.1 Instalación Local (Cliente)

**Prerrequisitos:**
```bash
# Instalar MongoDB
# Ubuntu/Debian:
sudo apt install mongodb

# macOS:
brew install mongodb-community

# Windows: Descargar de mongodb.com
```

**Setup:**
```bash
# 1. Clonar proyecto
cd botonera-frontend

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar MongoDB
cp .env.example .env
# Editar .env con URL de MongoDB local

# 4. Migrar datos
npm run migrate

# 5. Iniciar backend
npm run dev
# Backend corriendo en http://localhost:3001

# 6. En otra terminal: Iniciar frontend
cd ..
npm run dev
# Frontend corriendo en http://localhost:5173
```

### 8.2 Estructura de .env

**backend/.env**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/choco-biogeografico

# Server
PORT=3001
NODE_ENV=development

# CORS (origen del frontend)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 8.3 Scripts Útiles

**backend/package.json scripts:**
```json
{
  "dev": "tsx watch src/server.ts",           // Desarrollo con hot-reload
  "build": "tsc",                             // Compilar TypeScript
  "start": "node dist/server.js",             // Producción
  "migrate": "tsx scripts/migrate.ts",        // Migrar datos
  "migrate:force": "tsx scripts/migrate.ts --force", // Sobrescribir datos
  "db:seed": "tsx scripts/seed.ts",           // Añadir datos de prueba
  "db:clear": "tsx scripts/clear.ts"          // Limpiar base de datos
}
```

---

## 9. Ventajas de esta Arquitectura

✅ **Control total del cliente:**
- MongoDB local en su infraestructura
- Código fuente completo (sin dependencias cloud)
- Pueden modificar/extender fácilmente

✅ **Simplicidad:**
- Backend de ~250 líneas totales
- Solo lectura (sin complejidad de auth/permisos)
- Sin frameworks pesados

✅ **Performance:**
- Índices geoespaciales (queries rápidas)
- Cacheable con headers HTTP
- Paginación lista para escalar

✅ **Escalabilidad:**
- Fácil añadir más endpoints GET
- Índices optimizados para búsquedas
- Estructura preparada para millones de registros

✅ **Entregable:**
- Documentación completa
- Scripts de setup automatizados
- README para el cliente

---

## 10. Plan de Implementación

### Fase 1: Setup Backend (1h)
- [ ] Crear estructura de carpetas `/backend`
- [ ] Configurar TypeScript + Express
- [ ] Crear schemas de Mongoose
- [ ] Implementar conexión a MongoDB

### Fase 2: API Endpoints (1.5h)
- [ ] Implementar 6 endpoints GET
- [ ] Añadir validaciones y filtros
- [ ] Configurar CORS
- [ ] Testing manual con Postman/Thunder Client

### Fase 3: Migración de Datos (1h)
- [ ] Crear script de migración
- [ ] Migrar datos existentes
- [ ] Validar integridad
- [ ] Crear índices

### Fase 4: Frontend (1h)
- [ ] Crear servicio API
- [ ] Actualizar MapView.tsx
- [ ] Actualizar TriviaContainer.tsx
- [ ] Testing integración

### Fase 5: Documentación (0.5h)
- [ ] README del backend
- [ ] Guía de setup para cliente
- [ ] Scripts de deployment

---

## 11. Próximos Pasos

1. ✅ **Revisar este plan** - Confirmar que cumple requisitos
2. ⏳ **Implementar** - Seguir el plan paso a paso
3. ⏳ **Testing** - Verificar todo funciona localmente
4. ⏳ **Entregar** - Documentar para el cliente

---

## Notas Importantes

⚠️ **Datos GeoJSON grandes:**
- `bioregion.geojson` (291KB) se beneficiará de índices 2dsphere
- Considerar compresión gzip en Express para respuestas

⚠️ **CORS:**
- Configurar correctamente para producción
- Añadir dominio del cliente en `ALLOWED_ORIGINS`

⚠️ **MongoDB local vs Atlas:**
- Este plan asume MongoDB local
- Si el cliente prefiere cloud: MongoDB Atlas gratis hasta 512MB

---

**¿Preguntas antes de empezar la implementación?**
