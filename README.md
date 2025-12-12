# 🌿 Chocó Biogeográfico - Plataforma Educativa IIAP

Plataforma educativa e interactiva sobre el Chocó biogeográfico, desarrollada en colaboración con el **Instituto de Investigaciones Ambientales del Pacífico (IIAP) "John Von Neumann"**. Dirigida a jóvenes de 14-25 años para promover el conocimiento y conservación de una de las regiones más biodiversas del planeta.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)](https://vitejs.dev/)

## 🎯 Sobre el Proyecto

### El Chocó Biogeográfico

El Chocó biogeográfico es una región natural que se extiende desde el este de Panamá, a lo largo de toda la costa pacífica de Colombia, hasta el noroccidente de Ecuador. Es reconocida mundialmente como:

- 🦜 **25%** de las especies de aves del mundo
- 🌳 **8,000+** especies de plantas
- 🐆 **200+** especies de mamíferos
- 🐸 **600+** especies de anfibios
- 💧 Uno de los lugares más lluviosos del planeta (hasta 13,000 mm/año)
- 🌍 Uno de los 36 hotspots de biodiversidad mundial

### Sobre el IIAP

El **Instituto de Investigaciones Ambientales del Pacífico** es una institución dedicada a la investigación y generación de conocimiento para el Pacífico y el Chocó biogeográfico. Apoya la toma de decisiones y el desarrollo sostenible en la región.

🔗 **Web oficial:** [https://iiap.org.co](https://iiap.org.co)

---

## ✨ Características

### Funcionalidades Principales

- 🗺️ **Mapa Interactivo**
  - Visualización de la bioregión completa vs. límites administrativos
  - Rangos de distribución de especies
  - Capas alternables (bioregión, límites admin, especies)
  - Heatmap de biodiversidad
  - FitBounds automático a la capa activa
  - Popups informativos con datos de especies

- 📚 **Fichas de Especies**
  - Información científica y educativa
  - Nombres comunes y locales
  - Estado de conservación (IUCN)
  - Datos curiosos y culturales
  - Fotografías de alta calidad
  - Enlaces a fuentes científicas

- 🎮 **Sistema de Trivia Gamificado (Mejorado v2.0)**
  - **Selección múltiple de categorías** - Combina secciones para crear trivias personalizadas
  - **9 categorías disponibles:** Geografía, Fauna, Flora, Conservación, Cultura, Parques Nacionales, Municipios, Resguardos Indígenas, Comunidades Negras
  - **Barra flotante interactiva** - Muestra métricas en tiempo real (preguntas, tiempo estimado, puntos máximos)
  - **Sistema de filtros avanzado** - Filtra por dificultad y estado (nuevas/completadas)
  - **Progressive disclosure** - Muestra 6 secciones iniciales, expandible a todas
  - Tres niveles de dificultad con indicadores visuales
  - Sistema de puntos progresivo con historial personal
  - Explicaciones educativas detalladas
  - **Guardado automático de progreso** por sección (localStorage)
  - **Historial de puntuaciones** con comparación de mejor marca personal
  - Emojis temáticos del Chocó en cada categoría (🦜 🌺 🗺️ 🏞️)
  - Animaciones fluidas con checkmarks y transiciones

- 🏆 **Sistema de Logros (Badges)**
  - Explorador del Chocó
  - Investigador Junior
  - Amante de la Biodiversidad
  - Experto del Pacífico
  - Guardián del Bosque
  - Notificaciones animadas de desbloqueo

- 📱 **Diseño Responsive**
  - Mobile-first approach
  - Optimizado para tablets y desktop
  - Navegación adaptativa
  - Microinteracciones pulidas con Framer Motion

- ♿ **Accesibilidad (WCAG AA/AAA)**
  - Paleta de colores con contraste verificado
  - Focus visible en todos los elementos interactivos
  - ARIA labels y roles
  - Navegación por teclado completa

---

## ✨ Mejoras UI/UX Implementadas (2025)

### Fase 1: Mejoras Críticas
- ✅ **Sistema de Badges rediseñado** - Badges más sutiles con bordes y nuevas variantes (`new`, `featured`)
- ✅ **Espaciado mejorado** - Mayor breathing room con gaps de 1.5rem y padding aumentado en cards
- ✅ **Hover mejorado** - Elevación de -4px para mayor sensación de profundidad

### Fase 2: Mejoras Funcionales
- ✅ **Selección múltiple de secciones** - Sistema de checkboxes visuales con checkmarks animados
- ✅ **FloatingBar interactiva** - Barra flotante responsive con métricas en tiempo real
- ✅ **Iconografía mejorada** - Emojis temáticos del Chocó (🦜 loro, 🌺 flor tropical, 🏞️ parques)
- ✅ **Estados interactivos** - Animaciones CSS personalizadas (scale-in, pulse-subtle)
- ✅ **Transiciones suaves** - Duración aumentada a 300ms con cubic-bezier optimizado

### Fase 3: Optimizaciones Avanzadas
- ✅ **Progressive Disclosure** - Muestra 6 tarjetas iniciales, botón "Ver todas" para expandir
- ✅ **Sistema de filtros** - FilterChip dropdown para dificultad y estado con botón "Limpiar"
- ✅ **Responsive refinement** - FloatingBar adaptativa (bottom-sheet en móvil, flotante en desktop)

### Componentes Nuevos Creados
- `FloatingBar.tsx` - Barra flotante con métricas y botón de inicio
- `FilterChip.tsx` - Componente dropdown para filtros
- `ExitConfirmModal.tsx` - Modal de confirmación para salir
- `ScoreHistory.tsx` - Historial de puntuaciones personales
- `WelcomeModal.tsx` - Modal de bienvenida para capturar nombre

---

## 🎨 Paleta de Colores

Inspirada en la bandera del Chocó con ajustes para accesibilidad:

| Color | Hex | Uso | Contraste |
|-------|-----|-----|-----------|
| 🟢 Forest 500 | `#16a34a` | Principal | AA (4.5:1) |
| 🟢 Forest 600 | `#15803d` | Texto oscuro | AAA (7:1) |
| 🔵 Pacific 500 | `#2563eb` | Secundario | AA (4.5:1) |
| 🔵 Pacific 600 | `#1d4ed8` | Enlaces | AAA (7:1) |
| 🟡 Gold 500 | `#f59e0b` | Acentos | AA |
| 🟡 Gold 700 | `#b45309` | Texto | AAA (7:1) |
| ⚫ Sand 900 | `#1c1917` | Texto principal | AAA |

**Justificación:** Todos los colores cumplen con WCAG AA mínimo, con variantes AAA para texto. Los colores representan:
- Verde: Bosques tropicales
- Azul: Océano Pacífico y ríos
- Dorado: Sol y biodiversidad
- Neutros cálidos: Calidez tropical

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+
- npm 9+ o yarn 1.22+
- Git

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/[TU-USUARIO]/choco-biogeografico-iiap.git
cd choco-biogeografico-iiap

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# La aplicación se abrirá automáticamente en http://localhost:3000
```

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run preview  # Preview del build de producción
npm run lint     # Ejecutar linter
```

---

## 📁 Estructura del Proyecto

```
choco-biogeografico-iiap/
├── public/
│   ├── data/                          # Datos GeoJSON y JSON
│   │   ├── bioregion.geojson         # Polígono del Chocó biogeográfico
│   │   ├── boundaries_admin.geojson  # Límites del Departamento del Chocó
│   │   ├── species_ranges.geojson    # Rangos de distribución de especies
│   │   ├── species.json              # Fichas completas de especies
│   │   └── trivia.json               # Preguntas de trivia
│   │
│   └── media/                         # Imágenes, iconos, sonidos
│       ├── images/
│       ├── icons/
│       └── sounds/
│
├── src/
│   ├── components/                    # Componentes React
│   │   ├── atoms/                    # Componentes básicos (Button, Badge, etc.)
│   │   ├── molecules/                # Componentes intermedios (Card, LayerToggle)
│   │   ├── organisms/                # Componentes complejos (MapView, Navigation)
│   │   └── trivia/                   # Sistema completo de trivia mejorado
│   │       ├── TriviaContainer.tsx   # Contenedor principal
│   │       ├── TriviaSectionSelector.tsx  # Selector con selección múltiple
│   │       ├── TriviaQuestion.tsx    # Componente de pregunta
│   │       ├── TriviaResults.tsx     # Pantalla de resultados
│   │       ├── TriviaProgress.tsx    # Barra de progreso
│   │       ├── FloatingBar.tsx       # Barra flotante con métricas
│   │       ├── FilterChip.tsx        # Filtros dropdown
│   │       ├── ExitConfirmModal.tsx  # Modal de confirmación
│   │       ├── ScoreHistory.tsx      # Historial de puntuaciones
│   │       └── WelcomeModal.tsx      # Modal de bienvenida
│   │
│   ├── pages/                         # Páginas principales
│   │   ├── Home.tsx                  # Página de inicio
│   │   ├── MapOnly.tsx               # Mapa a pantalla completa
│   │   └── Trivia.tsx                # Página de trivia
│   │
│   ├── stores/                        # Estado global con Zustand
│   │   ├── uiStore.ts                # UI y preferencias
│   │   └── triviaStore.ts            # Estado de la trivia
│   │
│   ├── utils/                         # Utilidades
│   │   ├── geo.ts                    # Funciones geoespaciales (Turf.js)
│   │   ├── colors.ts                 # Paleta y utilidades de colores
│   │   └── storage.ts                # LocalStorage y progreso del usuario
│   │
│   ├── hooks/                         # Custom hooks
│   │   ├── useGameProgress.ts
│   │   └── useResponsive.ts
│   │
│   ├── types/                         # Tipos TypeScript
│   │   └── index.ts
│   │
│   ├── App.tsx                        # Componente raíz con routing
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Estilos globales + Tailwind
│
├── for_IIAP/                          # Documentación para el IIAP
│   ├── workshop_plan.md              # Plan de talleres con jóvenes
│   ├── permissions.md                # Guía de permisos y uso de contenido
│   ├── datasources.csv               # Metadatos de fuentes de datos
│   └── content_curator_guide.md      # Guía para curadores de contenido
│
├── package.json
├── vite.config.ts
├── tailwind.config.cjs
├── tsconfig.json
└── README.md                          # Este archivo
```

---

## 🗺️ Reemplazar Datos Placeholders por Datos Reales

### ✅ Bioregión del Chocó - COMPLETADO

**Archivo:** `/public/data/bioregion.geojson`

**Estado:** ✅ **Datos reales implementados**

**Fuente utilizada:**
- **WWF Terrestrial Ecoregions of the World (TEOW) 2017**
  - Ecorregión: "Chocó-Darién Moist Forests"
  - Fuente oficial: [WWF Terrestrial Ecoregions](https://www.worldwildlife.org/publications/terrestrial-ecoregions-of-the-world)
  - Licencia: Public Domain
  - Datos oficiales de ecorregiones terrestres definidas científicamente por WWF
  - Bioma: Tropical & Subtropical Moist Broadleaf Forests
  - Cobertura: Panamá (Darién) y Colombia (Chocó)

**Procesamiento aplicado (siguiendo flujo recomendado):**
1. ✅ Descarga de shapefile TEOW desde Google Cloud Storage
2. ✅ Extracción de ecorregión específica usando `ogr2ogr -where "ECO_NAME = 'Chocó-Darién moist forests'"`
3. ✅ Recorte por límites administrativos (eliminación de áreas marinas y países centroamericanos)
4. ✅ Eliminación de islas y fragmentos dispersos usando criterios de área y distancia
5. ✅ Simplificación de geometría para optimizar tamaño (tolerancia 0.001)
6. ✅ Validación de GeoJSON

**Detalles técnicos:**
- Formato: GeoJSON con geometría MultiPolygon
- Simplificación: Aplicada con tolerancia 0.001 usando ogr2ogr
- Tamaño final: ~144KB (optimizado desde 444KB)
- Coordenadas: WGS84 (EPSG:4326)
- Extensión: 1.20°N a 9.00°N, -79.14°W a -76.19°W
- Puntos: 3,760 (reducidos desde 4,465)

### ⚠️ IMPORTANTE: Otros Datos Aún son Placeholders

Los siguientes archivos GeoJSON y JSON aún son **placeholders funcionales** y **DEBEN** ser reemplazados con datos reales antes del lanzamiento público.

### 2. Límites Administrativos

**Archivo:** `/public/data/boundaries_admin.geojson`

**Fuente recomendada:**
- **GADM (Database of Global Administrative Areas):** https://gadm.org/
  - Seleccionar: Colombia > Level 1 > Chocó
  - Descargar como GeoJSON
  - Licencia: Libre uso con atribución

**Alternativa:**
- **IGAC (Colombia):** Instituto Geográfico Agustín Codazzi - datos oficiales

### 3. Rangos de Especies

**Archivo:** `/public/data/species_ranges.geojson`

**Fuentes recomendadas:**

**A) GBIF (Global Biodiversity Information Facility)**
- URL: https://www.gbif.org/
- Buscar especie por nombre científico
- Descargar ocurrencias como CSV
- Usar QGIS para crear polígono envolvente o kernel density

**B) IUCN Red List**
- URL: https://www.iucnredlist.org/
- Solicitar acceso a mapas de distribución
- Descargar shapefiles
- Convertir a GeoJSON

**C) SiB Colombia**
- URL: https://sibcolombia.net/
- Datos de biodiversidad específicos de Colombia
- API disponible para consultas programáticas

**D) Investigaciones propias del IIAP**
- Inventarios y muestreos de campo
- Registros históricos de especies

**Tutorial rápido con GBIF:**
```
1. Ir a https://www.gbif.org/
2. Buscar especie (ej: "Leopardus tigrinus")
3. Click en "Occurrences" tab
4. Filtrar por ubicación: Colombia, región Chocó
5. Download > "Simple" > CSV
6. Abrir en QGIS > Layer > Add Delimited Text Layer
7. Crear buffer o convex hull: Vector > Geoprocessing Tools
8. Exportar a GeoJSON
```

### 4. Fichas de Especies

**Archivo:** `/public/data/species.json`

**Fuentes científicas:**
- **GBIF:** Datos taxonómicos y distribución
- **IUCN Red List:** Estado de conservación
- **SiB Colombia:** Datos locales
- **Investigaciones del IIAP:** Conocimiento local y validación

**Proceso de validación:**
1. Revisar nombre científico en Catalogue of Life o GBIF
2. Verificar estado IUCN actualizado
3. Validar nombres comunes locales con comunidades
4. Revisar descripción con investigador experto
5. Añadir conocimiento tradicional con consentimiento
6. Ver: `/for_IIAP/content_curator_guide.md`

### 5. Fotografías

**Opciones (en orden de preferencia):**

**A) Colección propia del IIAP**
- Fotografías de investigadores y colaboradores
- Obtener consentimiento de uso
- Creditar fotógrafos

**B) Bancos científicos con licencia**
- **Macaulay Library (Cornell Lab):** https://www.macaulaylibrary.org/ (aves)
- **iNaturalist:** https://www.inaturalist.org/ (todas las especies)
- **GBIF:** Muchas ocurrencias tienen fotos asociadas
- Verificar licencia Creative Commons de cada imagen

**C) Colaboración con fotógrafos locales**
- Contactar fotógrafos de naturaleza del Chocó
- Ofrecer crédito visible y compensación si es posible
- Ver template en `/for_IIAP/permissions.md`

**D) Talleres con jóvenes**
- Crear contenido propio con participantes
- Ver `/for_IIAP/workshop_plan.md`

**⚠️ NUNCA usar imágenes sin permiso o licencia clara**

---

## 🎓 Talleres con Jóvenes

El proyecto incluye un plan completo para co-diseñar contenidos con jóvenes de la región:

- **Taller 1 (Virtual):** Exploración y retroalimentación de UX
- **Taller 2 (Presencial):** Validación de datos y creación de contenido

Ver documentación completa: [for_IIAP/workshop_plan.md](for_IIAP/workshop_plan.md)

**Objetivos:**
- Validar datos científicos con conocimiento local
- Crear contenido multimedia (fotos, videos, audios)
- Documentar nombres comunes y usos tradicionales
- Fortalecer apropiación comunitaria del proyecto

---

## 📜 Permisos y Licencias

### Estado de Placeholders

⚠️ **CRÍTICO:** Antes de publicar, reemplazar:

- [ ] Logo del IIAP (archivo actual es placeholder)
- [ ] Fotografías de especies (usar con licencia apropiada)
- [ ] Datos GeoJSON (reemplazar con fuentes oficiales)
- [ ] Verificar contactos del IIAP en Footer

Ver guía completa: [for_IIAP/permissions.md](for_IIAP/permissions.md)

### Licencia del Proyecto

**Código:** MIT License
**Contenido:** CC BY-NC-SA 4.0 (Reconocimiento-NoComercial-CompartirIgual)

---

## 🚀 Despliegue (Deployment)

### Opción 1: Vercel (Recomendado - Gratuito)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel
```

O conectar repositorio GitHub directamente en [vercel.com](https://vercel.com)

### Opción 2: Netlify

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod
```

O arrastrar carpeta `dist` en [netlify.com/drop](https://app.netlify.com/drop)

### Opción 3: GitHub Pages

```bash
# 1. Añadir a vite.config.ts:
base: '/nombre-del-repo/'

# 2. Build
npm run build

# 3. Deploy con gh-pages
npm i -g gh-pages
gh-pages -d dist
```

### Configuraciones Importantes

**Variables de Entorno (si usas APIs futuras):**
```bash
# .env
VITE_IIAP_API_URL=https://api.iiap.org.co
VITE_GBIF_API_KEY=tu_key_aqui
```

---

## 🛠️ Stack Tecnológico

### Core
- **React 19.1** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.1** - Build tool y dev server

### Estilos
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion 12** - Animaciones fluidas

### Mapas
- **Leaflet 1.9** - Mapas interactivos
- **React-Leaflet 4.2** - Integración con React
- **Turf.js 7.2** - Análisis geoespacial

### Estado
- **Zustand 5.0** - Estado global ligero
- **localStorage** - Persistencia del progreso

### Utilidades
- **Lucide React** - Iconos
- **clsx** - Conditional classnames
- **Howler.js** - Audio (opcional)

---

## 🤝 Contribuir

### Para Investigadores del IIAP

Si eres parte del equipo del IIAP y quieres contribuir contenido:

1. **Leer la guía:** [for_IIAP/content_curator_guide.md](for_IIAP/content_curator_guide.md)
2. **Añadir especies:** Editar `/public/data/species.json`
3. **Crear preguntas:** Editar `/public/data/trivia.json`
4. **Validar datos:** Verificar con fuentes científicas
5. **Documentar fuentes:** Actualizar `/for_IIAP/datasources.csv`

### Para Desarrolladores

1. Fork el repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

**Convenciones de código:**
- TypeScript strict mode
- ESLint + Prettier
- Componentes funcionales con hooks
- Props tipadas
- Comentarios en español

---

## 📊 Checklist de Lanzamiento

### Pre-Lanzamiento

- [ ] Reemplazar logo del IIAP con versión oficial
- [ ] Obtener autorización escrita del IIAP para uso del logo
- [ ] Reemplazar datos GeoJSON con fuentes oficiales
- [ ] Verificar licencias de todas las fotografías
- [ ] Actualizar contactos reales del IIAP en Footer
- [ ] Añadir mínimo 15 especies con datos validados
- [ ] Crear al menos 20 preguntas de trivia
- [ ] Verificar todas las URLs externas funcionan
- [ ] Probar en móviles (iOS y Android)
- [ ] Probar en navegadores principales (Chrome, Firefox, Safari, Edge)
- [ ] Verificar accesibilidad con Lighthouse (score >90)
- [ ] Optimizar imágenes (comprimir, formatos modernos)
- [ ] Configurar analytics (opcional: Google Analytics, Plausible)
- [ ] Crear página de términos de uso
- [ ] Añadir política de privacidad (si recopilan datos)

### Post-Lanzamiento

- [ ] Monitorear errores con Sentry o similar
- [ ] Recopilar feedback de usuarios
- [ ] Iterar basado en datos de uso
- [ ] Organizar talleres con jóvenes
- [ ] Publicar en redes sociales del IIAP
- [ ] Crear materiales de comunicación (videos, infografías)

---

## 🐛 Solución de Problemas

### El mapa no se muestra

**Causa común:** Leaflet CSS no cargado

**Solución:**
1. Verificar que `index.html` incluye el CSS de Leaflet
2. Comprobar console del navegador por errores
3. Verificar que archivos GeoJSON están en `/public/data/`

### Las imágenes no cargan

**Causa común:** Rutas incorrectas

**Solución:**
- Rutas en JSON deben comenzar con `/media/images/...`
- Archivos deben estar en `/public/media/images/`
- Nombres son case-sensitive

### Build falla

**Causa común:** Errores de TypeScript

**Solución:**
```bash
npm run lint  # Ver errores
```

Verificar que todos los imports usan alias correctos (@components, @utils, etc.)

---

## 📞 Contacto y Soporte

### IIAP
- **Web:** https://iiap.org.co
- **Email:** [contacto@iiap.org.co - Verificar]
- **Teléfono:** [Placeholder - Actualizar]
- **Dirección:** Quibdó, Chocó, Colombia

### Proyecto
- **Issues:** [GitHub Issues](https://github.com/[TU-USUARIO]/choco-biogeografico-iiap/issues)
- **Documentación:** Ver carpeta `/for_IIAP/`

---

## 📚 Referencias y Fuentes

### Datos Científicos
- **GBIF:** https://www.gbif.org/
- **IUCN Red List:** https://www.iucnredlist.org/
- **SiB Colombia:** https://sibcolombia.net/
- **WWF Ecoregions:** https://www.worldwildlife.org/ecoregions
- **GADM:** https://gadm.org/

### Sobre el Chocó
- Myers, N., et al. (2000). *Biodiversity hotspots for conservation priorities.* Nature 403:853-858
- Rangel-Ch, J. O. (2004). *Colombia Diversidad Biótica IV. El Chocó Biogeográfico/Costa Pacífica.*
- IIAP: https://iiap.org.co/investigaciones

---

## 📝 Changelog

### [2.0.0] - 2025-01-XX (Mejoras UI/UX Trivia)
- ✅ **Sistema de selección múltiple** de categorías con checkboxes visuales
- ✅ **FloatingBar interactiva** con métricas en tiempo real (preguntas, tiempo, puntos)
- ✅ **Sistema de filtros** por dificultad y estado (nuevas/completadas)
- ✅ **Progressive disclosure** - 6 tarjetas iniciales, expandible a 9 categorías
- ✅ **Emojis temáticos** del Chocó en cada categoría (🦜 🌺 🗺️ 🏞️)
- ✅ **Historial de puntuaciones** por sección con mejor marca personal
- ✅ **4 nuevas categorías:** Parques Nacionales, Municipios, Resguardos Indígenas, Comunidades Negras
- ✅ **Animaciones mejoradas** - checkmarks, transiciones suaves, hover effects
- ✅ **Responsive refinement** - FloatingBar adaptativa móvil/desktop
- ✅ **Badges rediseñados** - Estilo más sutil con bordes
- ✅ **Espaciado optimizado** - Mayor breathing room en toda la interfaz

### [1.0.0] - 2024-XX-XX (Lanzamiento inicial)
- ✅ Mapa interactivo con capas alternables
- ✅ Sistema de trivia gamificado básico
- ✅ Fichas de 5 especies placeholder
- ✅ Sistema de badges y progreso
- ✅ Diseño responsive mobile-first
- ✅ Documentación completa para IIAP

---

## 🙏 Agradecimientos

- **IIAP** - Por su invaluable trabajo en investigación y conservación del Chocó biogeográfico
- **Comunidades locales** - Por compartir su conocimiento tradicional
- **Fotógrafos de naturaleza** - Por documentar la biodiversidad de la región
- **Jóvenes participantes** - Por su feedback y creatividad

---

## 📄 Licencia

**Código:** MIT License - Ver [LICENSE](LICENSE)
**Contenido:** CC BY-NC-SA 4.0

Copyright © 2024 Instituto de Investigaciones Ambientales del Pacífico (IIAP)

---

<div align="center">

**Hecho con 💚 para el Chocó biogeográfico**

*Si este proyecto te ayudó a aprender sobre el Chocó, ⭐ dale una estrella al repositorio*

[🏠 IIAP](https://iiap.org.co) • [🗺️ Explorar](/) • [🎮 Trivia](/trivia)

</div>
