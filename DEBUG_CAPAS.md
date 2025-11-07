# Script de Diagnóstico para Consola del Navegador

## 🔍 Para diagnosticar conflictos de capas

Abre la consola del navegador (F12 > Console) y ejecuta estos comandos:

### 1. Verificar capas SVG renderizadas

```javascript
// Ver cuántas capas SVG hay en el mapa
const mapElement = document.querySelector('.leaflet-container');
const svgLayers = mapElement.querySelectorAll('svg');
console.log(`Capas SVG encontradas: ${svgLayers.length}`);

svgLayers.forEach((svg, idx) => {
  const paths = svg.querySelectorAll('path');
  console.log(`SVG ${idx + 1}: ${paths.length} paths`);
  
  // Ver estilos de los primeros paths
  paths.forEach((path, pIdx) => {
    if (pIdx < 3) {
      const fill = window.getComputedStyle(path).fill;
      const stroke = window.getComputedStyle(path).stroke;
      console.log(`  Path ${pIdx + 1}: fill=${fill}, stroke=${stroke}`);
    }
  });
});
```

### 2. Verificar datos cargados

```javascript
// Verificar qué datos tiene el GeoJSON
fetch('/data/bioregion.geojson')
  .then(r => r.json())
  .then(d => {
    console.log('Features:', d.features.length);
    d.features.forEach((f, i) => {
      const geom = f.geometry;
      console.log(`Feature ${i}:`, {
        type: geom.type,
        polygons: geom.coordinates.length,
        holes: geom.coordinates.reduce((acc, pg) => acc + (pg.length > 1 ? pg.length - 1 : 0), 0)
      });
    });
  });
```

### 3. Verificar capas activas (React DevTools)

1. Instala React DevTools si no lo tienes
2. Abre DevTools > pestaña "Components"
3. Busca el componente `MapView`
4. Verifica las props:
   - `activeLayers.bioregion` debería ser `true`
   - `activeLayers.adminBoundaries` debería ser `false`
   - `activeLayers.speciesRanges` debería ser `false`

### 4. Verificar si hay múltiples instancias

```javascript
// Ver si hay múltiples mapas renderizados
const maps = document.querySelectorAll('.leaflet-container');
console.log(`Mapas encontrados: ${maps.length}`);

// Ver todas las capas Leaflet
const layers = document.querySelectorAll('.leaflet-layer');
console.log(`Capas Leaflet: ${layers.length}`);
layers.forEach((layer, idx) => {
  console.log(`Capa ${idx + 1}:`, layer.className, layer.children.length, 'children');
});
```

### 5. Verificar z-index y superposición

```javascript
// Verificar z-index de las capas
const svgLayers = document.querySelectorAll('.leaflet-container svg');
svgLayers.forEach((svg, idx) => {
  const zIndex = window.getComputedStyle(svg).zIndex;
  console.log(`SVG ${idx + 1}: z-index=${zIndex}`);
});
```

## ✅ Solución aplicada

He eliminado todos los **huecos (anillos internos)** de los polígonos. Estos huecos eran los "espaciecitos" que veías.

- **Huecos eliminados:** 9 (del polígono 6)
- **Resultado:** Todos los polígonos ahora solo tienen anillos exteriores (sin huecos)
- **Efecto visual:** Todos los espacios deberían estar rellenos de verde

Recarga la página (Ctrl+Shift+R) y los espacios deberían desaparecer.

