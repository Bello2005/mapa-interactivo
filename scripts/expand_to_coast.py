#!/usr/bin/env python3
"""
Expande el polígono del Chocó Biogeográfico hacia la costa del Pacífico
para reducir gaps visuales.

ADVERTENCIA: Este script modifica el polígono científico para mejorar
la representación visual, pero puede incluir áreas que no son 100% Chocó Biogeográfico.
"""

import json
import sys
from pathlib import Path

def expand_to_coast(geojson_path, output_path, coast_lon=-79.3, expansion_zone=(-79.0, -77.5)):
    """
    Expande puntos hacia la costa del Pacífico.

    Args:
        geojson_path: Ruta del GeoJSON de entrada
        output_path: Ruta del GeoJSON de salida
        coast_lon: Longitud objetivo de la costa del Pacífico (default: -79.3°W)
        expansion_zone: Rango de longitudes donde aplicar la expansión
    """

    with open(geojson_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"📂 Procesando: {geojson_path}")
    print(f"🌊 Costa objetivo: {coast_lon}°W")
    print(f"📍 Zona de expansión: {expansion_zone[0]}°W a {expansion_zone[1]}°W")
    print()

    points_expanded = 0
    total_points = 0

    for feature in data['features']:
        geometry = feature['geometry']
        geom_type = geometry['type']

        if geom_type == 'MultiPolygon':
            for polygon in geometry['coordinates']:
                for ring in polygon:
                    for point in ring:
                        total_points += 1
                        lon, lat = point[0], point[1]

                        # Si el punto está en la zona de expansión y al oeste
                        # (cerca de la costa), expandirlo hacia la costa
                        if expansion_zone[0] <= lon <= expansion_zone[1]:
                            # Calcular qué tan cerca está del límite este de la zona
                            # y expandirlo proporcionalmente hacia la costa
                            distance_from_east = (lon - expansion_zone[1]) / (expansion_zone[0] - expansion_zone[1])

                            if distance_from_east > 0.7:  # Solo expandir puntos muy al oeste
                                # Expandir hacia la costa, pero no pasarse
                                new_lon = min(coast_lon, lon - 0.05)  # Pequeño ajuste
                                if new_lon != lon:
                                    point[0] = new_lon
                                    points_expanded += 1

        elif geom_type == 'Polygon':
            for ring in geometry['coordinates']:
                for point in ring:
                    total_points += 1
                    lon, lat = point[0], point[1]

                    if expansion_zone[0] <= lon <= expansion_zone[1]:
                        distance_from_east = (lon - expansion_zone[1]) / (expansion_zone[0] - expansion_zone[1])

                        if distance_from_east > 0.7:
                            new_lon = min(coast_lon, lon - 0.05)
                            if new_lon != lon:
                                point[0] = new_lon
                                points_expanded += 1

    # Actualizar metadatos
    if 'properties' not in data:
        data['properties'] = {}

    data['properties']['version'] = "4.2-expanded-to-coast"
    data['properties']['processing_steps'] = "Expanded western points towards Pacific coast"
    data['properties']['coast_target_lon'] = coast_lon
    data['properties']['points_modified'] = points_expanded
    data['properties']['warning'] = "This version has been visually adjusted and may include non-ecoregion areas"

    # Guardar
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    print(f"✅ Procesamiento completado")
    print(f"   Total de puntos: {total_points:,}")
    print(f"   Puntos expandidos: {points_expanded:,} ({(points_expanded/total_points*100):.1f}%)")
    print(f"   Archivo guardado: {output_path}")

    # Tamaño del archivo
    input_size = Path(geojson_path).stat().st_size / 1024
    output_size = Path(output_path).stat().st_size / 1024
    print(f"   Tamaño: {input_size:.0f} KB → {output_size:.0f} KB")
    print()
    print("⚠️  ADVERTENCIA: Esta versión está ajustada visualmente.")
    print("    Para precisión científica, usa la versión v4.0-resolve original.")

if __name__ == "__main__":
    base_path = Path(__file__).parent.parent / "public" / "data"
    input_file = base_path / "bioregion.geojson"
    output_file = base_path / "bioregion_expanded.geojson"

    if not input_file.exists():
        print(f"❌ Error: No se encontró {input_file}")
        sys.exit(1)

    print("=" * 80)
    print("EXPANSIÓN HACIA LA COSTA DEL PACÍFICO")
    print("=" * 80)
    print()
    print("Este script expande el polígono hacia la costa del Pacífico")
    print("para reducir gaps visuales.")
    print()
    print("⚠️  IMPORTANTE: Esto modifica el polígono científico original.")
    print()

    # Expandir hacia la costa del Pacífico
    # Costa del Pacífico de Colombia: aproximadamente -79.3°W
    # Zona de expansión: puntos entre -79.0°W y -77.5°W
    expand_to_coast(input_file, output_file, coast_lon=-79.3, expansion_zone=(-79.0, -77.5))

    print()
    print("=" * 80)
    print("COMPLETADO")
    print("=" * 80)
    print()
    print("Para usar la versión expandida:")
    print(f"  cp {output_file} {input_file}")
    print()
    print("O compara ambas versiones primero en tu aplicación.")
