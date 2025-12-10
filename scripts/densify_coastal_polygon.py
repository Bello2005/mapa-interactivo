#!/usr/bin/env python3
"""
Densifica el polígono del Chocó Biogeográfico en zonas costeras
Agrega puntos intermedios para reducir gaps visuales
"""

import json
import math
from pathlib import Path

def distance(p1, p2):
    """Calcula la distancia euclidiana entre dos puntos [lon, lat]"""
    return math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2)

def interpolate_points(p1, p2, num_points):
    """Interpola num_points entre p1 y p2"""
    points = []
    for i in range(1, num_points):
        t = i / num_points
        lon = p1[0] + t * (p2[0] - p1[0])
        lat = p1[1] + t * (p2[1] - p1[1])
        points.append([lon, lat])
    return points

def is_coastal_zone(p1, p2, coastal_lon_range=(-79.5, -77.0)):
    """Determina si un segmento está en zona costera del Pacífico"""
    min_lon, max_lon = coastal_lon_range
    return (min_lon <= p1[0] <= max_lon or min_lon <= p2[0] <= max_lon)

def densify_ring(ring, threshold_distance=0.1, coastal_threshold=0.05):
    """
    Densifica un anillo de polígono
    - threshold_distance: distancia máxima entre puntos (en grados)
    - coastal_threshold: distancia máxima en zona costera (más estricto)
    """
    densified = []

    for i in range(len(ring) - 1):
        p1 = ring[i]
        p2 = ring[i + 1]

        densified.append(p1)

        dist = distance(p1, p2)
        threshold = coastal_threshold if is_coastal_zone(p1, p2) else threshold_distance

        if dist > threshold:
            # Calcular cuántos puntos intermedios necesitamos
            num_points = int(dist / threshold) + 1
            interpolated = interpolate_points(p1, p2, num_points)
            densified.extend(interpolated)

    # Agregar el último punto
    densified.append(ring[-1])

    return densified

def densify_geojson(input_path, output_path, threshold=0.1, coastal_threshold=0.05):
    """Densifica un GeoJSON"""

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"📂 Procesando: {input_path}")

    original_points = 0
    densified_points = 0

    for feature in data['features']:
        geometry = feature['geometry']
        geom_type = geometry['type']

        if geom_type == 'MultiPolygon':
            new_coords = []
            for polygon in geometry['coordinates']:
                new_polygon = []
                for ring in polygon:
                    original_points += len(ring)
                    densified_ring = densify_ring(ring, threshold, coastal_threshold)
                    densified_points += len(densified_ring)
                    new_polygon.append(densified_ring)
                new_coords.append(new_polygon)
            geometry['coordinates'] = new_coords

        elif geom_type == 'Polygon':
            new_coords = []
            for ring in geometry['coordinates']:
                original_points += len(ring)
                densified_ring = densify_ring(ring, threshold, coastal_threshold)
                densified_points += len(densified_ring)
                new_coords.append(densified_ring)
            geometry['coordinates'] = new_coords

    # Actualizar metadatos
    if 'properties' not in data:
        data['properties'] = {}

    data['properties']['version'] = "4.1-densified-coastal"
    data['properties']['processing_steps'] = "Densified coastal zones to reduce gaps"
    data['properties']['original_points'] = original_points
    data['properties']['densified_points'] = densified_points
    data['properties']['threshold_distance'] = threshold
    data['properties']['coastal_threshold'] = coastal_threshold

    # Guardar
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    print(f"✅ Procesamiento completado")
    print(f"   Puntos originales: {original_points:,}")
    print(f"   Puntos densificados: {densified_points:,}")
    print(f"   Incremento: +{densified_points - original_points:,} puntos ({((densified_points/original_points - 1) * 100):.1f}%)")
    print(f"   Archivo guardado: {output_path}")

    # Tamaño del archivo
    input_size = Path(input_path).stat().st_size / 1024
    output_size = Path(output_path).stat().st_size / 1024
    print(f"   Tamaño: {input_size:.0f} KB → {output_size:.0f} KB")

if __name__ == "__main__":
    base_path = Path(__file__).parent.parent / "public" / "data"
    input_file = base_path / "bioregion.geojson"
    output_file = base_path / "bioregion_densified.geojson"

    if not input_file.exists():
        print(f"❌ Error: No se encontró {input_file}")
        exit(1)

    print("=" * 80)
    print("DENSIFICACIÓN DEL CHOCÓ BIOGEOGRÁFICO")
    print("=" * 80)
    print()
    print("Este script agrega puntos intermedios en zonas costeras")
    print("para reducir los 'gaps' visuales del polígono.")
    print()

    # Densificar con umbrales diferentes:
    # - Zona costera: máximo 0.05° entre puntos (~5.5 km)
    # - Otras zonas: máximo 0.1° entre puntos (~11 km)
    densify_geojson(input_file, output_file, threshold=0.1, coastal_threshold=0.05)

    print()
    print("=" * 80)
    print("COMPLETADO")
    print("=" * 80)
    print()
    print("Para usar la versión densificada, ejecuta:")
    print(f"  cp {output_file} {input_file}")
