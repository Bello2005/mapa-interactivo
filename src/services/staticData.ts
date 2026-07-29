// src/services/staticData.ts
// Carga de los JSON/GeoJSON estáticos de /public/data con deduplicación.
//
// Las capas del Chocó pesan entre 2 y 100 MB, y varias partes de la app piden
// el mismo archivo casi a la vez (el mapa al arrancar, el efecto de capas
// visibles, el listado de features del panel, la trivia). Sin un punto único de
// entrada, cada una abría su propia descarga del mismo archivo.
//
// Se deduplica por URL, que es lo que identifica al recurso: dos capas que
// apunten al mismo archivo lo comparten, y si una capa cambia de ruta se pide
// de nuevo. Hay dos niveles:
//   - `inFlight`: mientras una petición está en curso, quien vuelva a pedir el
//     mismo recurso recibe esa misma promesa en vez de abrir otra conexión.
//   - `cache`: una vez resuelta, se reutiliza el objeto ya parseado; ahorra la
//     descarga y también el parseo, que en un GeoJSON de 18 MB no es gratis.
//
// Sin cache-busting a propósito: son archivos estáticos que solo cambian al
// desplegar, así que la revalidación por ETag/Last-Modified del servidor basta
// para detectarlo (ver `location /data/` en docker/nginx.conf).

const cache = new Map<string, unknown>()
const inFlight = new Map<string, Promise<unknown>>()

/**
 * Descarga y parsea un JSON estático, reutilizando la petición en curso o el
 * resultado ya cacheado.
 *
 * @param path Ruta del recurso (p. ej. `/data/runap.geojson`).
 */
export function fetchStaticJson<T>(path: string): Promise<T> {
  if (cache.has(path)) {
    return Promise.resolve(cache.get(path) as T)
  }

  const pending = inFlight.get(path)
  if (pending) {
    return pending as Promise<T>
  }

  const request = fetch(path)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} al cargar ${path}`)
      }
      const data = await response.json()
      cache.set(path, data)
      return data
    })
    .finally(() => {
      // Se libera siempre: si falló, el próximo intento vuelve a pedirlo.
      inFlight.delete(path)
    })

  inFlight.set(path, request)
  return request as Promise<T>
}

/** Rutas ya cacheadas en memoria (diagnóstico) */
export function getCachedStaticPaths(): string[] {
  return Array.from(cache.keys())
}

/**
 * Descarta lo cacheado para forzar una recarga. Sin argumento, vacía todo.
 * No afecta a las peticiones en vuelo, que resolverán con su propio resultado.
 */
export function clearStaticJson(path?: string) {
  if (path) {
    cache.delete(path)
  } else {
    cache.clear()
  }
}
