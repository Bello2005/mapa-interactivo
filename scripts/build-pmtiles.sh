#!/usr/bin/env bash
# Genera un archivo .pmtiles por cada capa de public/data.
#
# Un .pmtiles por capa (y no un único archivo combinado) porque la UI activa
# y desactiva capas de forma independiente: así activar una capa solo descarga
# los tiles de esa capa.
#
#   ./scripts/build-pmtiles.sh [directorio_salida]
#
# Requiere tippecanoe (brew install tippecanoe).

set -euo pipefail

SRC=public/data
OUT=${1:-public/tiles}

command -v tippecanoe >/dev/null || {
  echo "Falta tippecanoe. Instalar con: brew install tippecanoe" >&2
  exit 1
}

mkdir -p "$OUT"

# z12 es suficiente para escala regional: los tiles vectoriales hacen overzoom
# sin pixelarse, así que acercarse más sigue viéndose nítido.
MAXZOOM=12

total_src=0
total_out=0

printf '%-40s %10s %10s %8s\n' "capa" "geojson" "pmtiles" "cambio"
printf -- '-%.0s' {1..72}; echo

for f in "$SRC"/*.geojson; do
  name=$(basename "$f" .geojson)

  # Se saltan los vacíos (geología.geojson está a 0 bytes).
  [ -s "$f" ] || { printf '%-40s %10s\n' "$name" "(vacío)"; continue; }

  tippecanoe \
    --output="$OUT/$name.pmtiles" \
    --layer="$name" \
    --maximum-zoom=$MAXZOOM \
    --minimum-zoom=0 \
    --drop-densest-as-needed \
    --extend-zooms-if-still-dropping \
    --simplification=4 \
    --force \
    --quiet \
    "$f"

  s=$(stat -f%z "$f")
  o=$(stat -f%z "$OUT/$name.pmtiles")
  total_src=$((total_src + s))
  total_out=$((total_out + o))

  awk -v n="$name" -v s="$s" -v o="$o" 'BEGIN{
    printf "%-40s %9.1fMB %9.1fMB %7.0f%%\n", n, s/1048576, o/1048576, (o/s-1)*100
  }'
done

printf -- '-%.0s' {1..72}; echo
awk -v s="$total_src" -v o="$total_out" 'BEGIN{
  printf "%-40s %9.1fMB %9.1fMB %7.0f%%\n", "TOTAL", s/1048576, o/1048576, (o/s-1)*100
}'
