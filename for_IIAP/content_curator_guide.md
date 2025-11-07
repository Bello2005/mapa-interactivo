# Guía para Curadores de Contenido - IIAP Chocó Biogeográfico

## Introducción

Esta guía está diseñada para investigadores, educadores y personal del IIAP que deseen añadir, actualizar o curar contenido en la plataforma educativa del Chocó Biogeográfico.

---

## 1. Cómo Añadir Nuevas Especies

### Paso 1: Recopilar Información

**Datos científicos obligatorios:**
- Nombre científico (validado en GBIF o Catalogue of Life)
- Nombre común en español
- Familia taxonómica
- Categoría: aves, mamiferos, reptiles, anfibios, plantas
- Estado de conservación IUCN (LC, NT, VU, EN, CR, EW, EX)
- ¿Es endémica del Chocó? (true/false)

**Datos complementarios:**
- Nombre común local (consultar con comunidades)
- Descripción (100-200 palabras, lenguaje claro para jóvenes)
- Hábitat típico
- Dieta (si aplica)
- Datos curiosos (3-5 bullets)
- Información de conservación

### Paso 2: Obtener Imagen

**Opciones (en orden de preferencia):**
1. Fotografía del IIAP con permisos claros
2. Contactar fotógrafo de naturaleza para permiso
3. Buscar en GBIF/iNaturalist con licencia CC
4. Último recurso: bancos de imágenes libres

**Requisitos técnicos:**
- Formato: JPG o PNG
- Resolución mínima: 800x600px
- Tamaño máximo: 2MB
- Nombre de archivo: `especie_nombre-cientifico.jpg`
- Ejemplo: `ave_chlorochrysa-nitidissima.jpg`

### Paso 3: Editar el Archivo JSON

**Ubicación:** `/public/data/species.json`

**Añadir nuevo objeto al array:**

```json
{
  "id": "identificador-unico",
  "scientificName": "Genus species",
  "commonName": "Nombre Común",
  "commonNameLocal": "Nombre local (opcional)",
  "category": "aves|mamiferos|reptiles|anfibios|plantas",
  "family": "Familia Taxonómica",
  "description": "Descripción clara y pedagógica...",
  "habitat": "Tipo de hábitat",
  "diet": "Dieta (opcional para plantas)",
  "threatStatus": "LC|NT|VU|EN|CR|EW|EX",
  "endemic": true,
  "image": "/media/images/especie_nombre.jpg",
  "imageCredit": "Fotógrafo/Fuente",
  "funFacts": [
    "Dato curioso 1",
    "Dato curioso 2",
    "Dato curioso 3"
  ],
  "conservationInfo": "Información sobre conservación",
  "iucnLink": "https://www.iucnredlist.org/species/XXXXX"
}
```

### Paso 4: Añadir Rango Geográfico (Opcional pero recomendado)

**Ubicación:** `/public/data/species_ranges.geojson`

**Obtener datos de rango:**
1. Buscar especie en GBIF: https://www.gbif.org/
2. Descargar ocurrencias como CSV
3. Usar QGIS o similar para crear polígono de rango
4. Exportar como GeoJSON

**O bien crear manualmente:**
```json
{
  "type": "Feature",
  "properties": {
    "speciesId": "identificador-unico",
    "speciesName": "Genus species",
    "commonName": "Nombre Común",
    "category": "aves",
    "threatStatus": "EN",
    "endemic": true
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-77.5, 5.0],
        [-77.0, 5.0],
        [-77.0, 5.5],
        [-77.5, 5.5],
        [-77.5, 5.0]
      ]
    ]
  }
}
```

---

## 2. Cómo Crear Preguntas de Trivia

### Estructura de una Buena Pregunta

**Elementos:**
1. **Pregunta clara:** Directa, sin ambigüedad
2. **4 opciones:** Una correcta, tres plausibles pero incorrectas
3. **Explicación educativa:** Por qué es importante la respuesta
4. **Categorización:** geografia, fauna, flora, conservacion, cultura
5. **Dificultad:** facil, medio, dificil
6. **Puntos:** 10 (fácil), 15 (medio), 20 (difícil)

### Template de Pregunta

```json
{
  "id": "qXX",
  "question": "¿Pregunta clara y concisa?",
  "options": [
    "Opción A",
    "Opción B",
    "Opción C (correcta)",
    "Opción D"
  ],
  "correctAnswer": 2,
  "explanation": "Explicación de 1-2 frases sobre por qué esta respuesta es correcta y por qué es importante saberlo.",
  "category": "fauna",
  "difficulty": "medio",
  "points": 15,
  "imageUrl": "/media/images/pregunta_XX.jpg"
}
```

### Tips para Buenas Preguntas

**DO ✅:**
- Usar lenguaje claro para jóvenes 14-25 años
- Hacer preguntas que enseñen algo importante
- Incluir contexto local del Chocó
- Variar dificultades

**DON'T ❌:**
- Preguntas de trampa o muy ambiguas
- Datos excesivamente técnicos
- Preguntas con respuesta obvia
- Copiar directamente de fuentes sin adaptar

### Categorías y Balance

**Distribución sugerida para 20 preguntas:**
- Geografia: 4 preguntas
- Fauna: 6 preguntas
- Flora: 3 preguntas
- Conservación: 4 preguntas
- Cultura: 3 preguntas

**Dificultad:**
- Fácil: 6 preguntas (30%)
- Medio: 10 preguntas (50%)
- Difícil: 4 preguntas (20%)

---

## 3. Actualizar Datos Geoespaciales

### Actualizar Bioregión

**Archivo:** `/public/data/bioregion.geojson`

**Fuentes recomendadas:**
1. WWF Ecoregions (Chocó-Darién Moist Forests)
2. Mapa de ecorregiones del IDEAM (Colombia)
3. Investigaciones propias del IIAP

**Herramientas:**
- QGIS (gratuito): https://qgis.org/
- geojson.io (online): https://geojson.io/

**Proceso:**
1. Abrir shapefile en QGIS
2. Simplificar geometría si es muy compleja: Vector → Geometry Tools → Simplify
3. Exportar como GeoJSON: Layer → Save As → GeoJSON
4. Verificar que propiedades incluyan: name, description, area_km2

### Actualizar Límites Administrativos

**Archivo:** `/public/data/boundaries_admin.geojson`

**Fuente oficial:**
- GADM: https://gadm.org/data.html
- Seleccionar: Colombia → Level 1 → Chocó
- Descargar como GeoJSON

### Añadir Puntos de Ocurrencia

Si quieres mostrar ocurrencias puntuales en lugar de rangos:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "speciesId": "ave-001",
        "date": "2024-01-15",
        "observer": "Investigador IIAP"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.5, 5.7]
      }
    }
  ]
}
```

**IMPORTANTE:** No incluir coordenadas exactas de especies EN PELIGRO CRÍTICO para evitar caza furtiva.

---

## 4. Actualizar Textos e Información

### Home Page

**Archivo:** `/src/pages/Home.tsx`

**Secciones editables:**
- Estadísticas en HeroSection (línea ~85)
- Textos descriptivos del Chocó (línea ~150)
- Información sobre el IIAP (línea ~200)

**Buscar y modificar:**
```tsx
const facts = [
  {
    icon: Trees,
    title: "Tu título aquí",
    description: "Tu descripción aquí",
  },
  // ...
]
```

### Footer

**Archivo:** `/src/components/organisms/Footer.tsx`

**Actualizar contactos del IIAP:**
```tsx
<span>
  Quibdó, Chocó, Colombia
  <br />
  [Dirección real del IIAP]
</span>
```

---

## 5. Añadir Nuevas Imágenes

### Directorio

**Ubicación:** `/public/media/images/`

**Organización sugerida:**
```
/media/
  /images/
    /species/
      - aves/
      - mamiferos/
      - reptiles/
      - anfibios/
      - plantas/
    /landscapes/
    /people/ (con consentimientos)
```

### Optimización

**Antes de subir:**
1. Redimensionar a máximo 1920px de ancho
2. Comprimir con TinyPNG.com o similar
3. Convertir a formato moderno (WebP) si es posible
4. Nombrar descriptivamente: `categoria_nombre-especie.jpg`

### Atribución

**Crear archivo:** `/public/media/images/CREDITS.txt`

```
CRÉDITOS DE IMÁGENES

tigrillo.jpg
- Autor: Juan Pérez
- Licencia: CC BY-SA 4.0
- Fuente: Colección IIAP
- Fecha: 2024-01-15

ave_tangara-multicolor.jpg
- Autor: María González
- Licencia: CC BY 4.0
- Fuente: iNaturalist
- URL: https://www.inaturalist.org/observations/XXXXX
```

---

## 6. Proceso de Validación Científica

### Checklist de Validación

Antes de publicar nuevas especies:

- [ ] Nombre científico verificado en GBIF o Catalogue of Life
- [ ] Estado IUCN actualizado (verificar en iucnredlist.org)
- [ ] Descripción revisada por investigador experto
- [ ] Rango geográfico coherente con literatura científica
- [ ] Datos de endemismo verificados
- [ ] Referencias científicas archivadas

### Comité de Validación (Sugerido)

**Crear equipo de 3-5 personas:**
1. Biólogo/ecólogo senior (IIAP)
2. Especialista en taxonomía
3. Educador/comunicador científico
4. Representante de comunidades locales
5. Joven del grupo objetivo (14-25 años)

**Reunión trimestral para:**
- Revisar nuevas fichas de especies
- Aprobar preguntas de trivia
- Validar información cultural

---

## 7. Control de Versiones y Cambios

### Buenas Prácticas

**Antes de editar archivos importantes:**
1. Hacer copia de respaldo
2. Documentar cambios en archivo CHANGELOG.md
3. Probar localmente antes de publicar
4. Si es posible, usar Git para control de versiones

### Template CHANGELOG.md

```markdown
# Changelog - Contenido IIAP Chocó

## [2024-03-15]
### Añadido
- 5 nuevas especies de aves endémicas
- 10 preguntas de trivia sobre conservación

### Modificado
- Actualizado rango de Leopardus tigrinus según datos 2024
- Mejorada descripción de Tangara multicolor

### Corregido
- Nombre común local de Grallaria alleni
- Coordenadas de bioregión (límite con Ecuador)
```

---

## 8. Solución de Problemas Comunes

### Las imágenes no se muestran

**Verificar:**
1. Archivo está en `/public/media/images/`
2. Ruta en JSON comienza con `/media/images/...`
3. Nombre de archivo coincide exactamente (case-sensitive)
4. Formato es JPG, PNG o WebP

### El mapa no carga los datos

**Verificar:**
1. GeoJSON es válido: https://geojsonlint.com/
2. Coordenadas están en formato [longitud, latitud]
3. Archivo está en `/public/data/`
4. No hay errores de sintaxis JSON (comas, corchetes)

### La trivia muestra respuestas incorrectas

**Verificar:**
1. `correctAnswer` usa índice correcto (0, 1, 2, 3)
2. El índice corresponde a la posición en el array `options`
3. Índice comienza en 0, no en 1

---

## 9. Recursos y Enlaces Útiles

### Bases de Datos Científicas
- GBIF: https://www.gbif.org/
- IUCN Red List: https://www.iucnredlist.org/
- SiB Colombia: https://sibcolombia.net/
- Catalogue of Life: https://www.catalogueoflife.org/

### Herramientas GIS
- QGIS (gratuito): https://qgis.org/
- geojson.io (online): https://geojson.io/
- Mapshaper (simplificar geometrías): https://mapshaper.org/

### Validación de Datos
- GeoJSON Lint: https://geojsonlint.com/
- JSON Formatter: https://jsonformatter.org/

### Optimización de Imágenes
- TinyPNG: https://tinypng.com/
- Squoosh (Google): https://squoosh.app/

---

## 10. Contacto y Soporte

**Dudas sobre curación de contenido:**
- Email: [curador@iiap.org.co - Placeholder]
- Tel: [Placeholder]

**Soporte técnico:**
- Ver: `/for_IIAP/README_tecnico.md`
- Issues: GitHub repository

**Capacitación:**
- Solicitar taller presencial con el equipo técnico
- Sesiones virtuales mensuales (a programar)

---

*Última actualización: 2024*
*Mantener esta guía actualizada con cada cambio significativo en la estructura de datos.*
