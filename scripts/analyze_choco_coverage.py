#!/usr/bin/env python3
"""
Análisis del GeoJSON del Chocó Biogeográfico
Compara cobertura actual vs. cobertura esperada según fuentes oficiales
"""

import json
import sys
from pathlib import Path

def analyze_geojson(filepath):
    """Analiza el GeoJSON del Chocó Biogeográfico"""

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("=" * 80)
    print("ANÁLISIS DEL CHOCÓ BIOGEOGRÁFICO - GeoJSON")
    print("=" * 80)

    # Metadata
    props = data.get('properties', {})
    print(f"\n📋 METADATA:")
    print(f"   Versión: {props.get('version', 'N/A')}")
    print(f"   Fuente: {props.get('source', 'N/A')}")
    print(f"   Ecorregión: {props.get('ecoregion', 'N/A')}")

    # Features
    features = data.get('features', [])
    print(f"\n📊 FEATURES: {len(features)}")

    if not features:
        print("   ⚠️  No hay features en el GeoJSON")
        return

    feature = features[0]
    geometry = feature.get('geometry', {})
    geom_type = geometry.get('type', 'Unknown')

    print(f"   Tipo de geometría: {geom_type}")

    # Analizar coordenadas
    coords = geometry.get('coordinates', [])
    if geom_type == 'MultiPolygon':
        all_points = []
        for polygon in coords:
            for ring in polygon:
                all_points.extend(ring)

        print(f"   Número de polígonos: {len(coords)}")
        print(f"   Total de puntos: {len(all_points)}")
    elif geom_type == 'Polygon':
        all_points = []
        for ring in coords:
            all_points.extend(ring)
        print(f"   Total de puntos: {len(all_points)}")
    else:
        print(f"   ⚠️  Tipo de geometría no soportado: {geom_type}")
        return

    # Calcular bounds
    lons = [p[0] for p in all_points]
    lats = [p[1] for p in all_points]

    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)

    print(f"\n🗺️  EXTENSIÓN GEOGRÁFICA:")
    print(f"   Latitud:  {min_lat:.6f}° S/N → {max_lat:.6f}° N")
    print(f"   Longitud: {min_lon:.6f}° W → {max_lon:.6f}° W")
    print(f"   Rango lat: {max_lat - min_lat:.6f}°")
    print(f"   Rango lon: {max_lon - min_lon:.6f}°")

    # Verificar cobertura esperada
    print(f"\n✅ VERIFICACIÓN DE COBERTURA ESPERADA:")

    # Ciudades clave que deben estar incluidas
    ciudades = {
        "Necoclí (Golfo de Urabá)": (8.42, -76.78),
        "Turbo (Golfo de Urabá)": (8.09, -76.73),
        "Quibdó (Chocó)": (5.69, -76.66),
        "Buenaventura (Valle)": (3.88, -77.03),
        "Tumaco (Nariño)": (1.80, -78.80),
    }

    for ciudad, (lat, lon) in ciudades.items():
        dentro = min_lat <= lat <= max_lat and min_lon <= lon <= max_lon
        status = "✅" if dentro else "❌"
        print(f"   {status} {ciudad}: ({lat}°N, {lon}°W)")

    # Análisis de cobertura costera
    print(f"\n🌊 ANÁLISIS DE COBERTURA COSTERA:")

    # Costa del Pacífico: longitudes típicas -77 a -79°W
    costa_pacifico = [p for p in all_points if -79.5 < p[0] < -77.0]
    print(f"   Puntos en zona costera del Pacífico (~-77 a -79°W): {len(costa_pacifico)}")

    # Golfo de Urabá: latitudes 8-9°N
    golfo_uraba = [p for p in all_points if 8.0 <= p[1] <= 9.6]
    print(f"   Puntos en zona del Golfo de Urabá (8-9.6°N): {len(golfo_uraba)}")

    # Límite norte
    puntos_norte = [p for p in all_points if p[1] >= 9.0]
    print(f"   Puntos al norte de 9.0°N: {len(puntos_norte)}")

    if max_lat >= 9.5:
        print(f"   ✅ Extensión norte adecuada: {max_lat:.6f}°N")
    else:
        print(f"   ⚠️  Extensión norte insuficiente: {max_lat:.6f}°N (debería llegar a ~9.57°N)")

    # Análisis de densidad
    print(f"\n📐 ANÁLISIS DE DENSIDAD:")
    area_aprox = (max_lat - min_lat) * (max_lon - min_lon)
    densidad = len(all_points) / area_aprox if area_aprox > 0 else 0
    print(f"   Área aproximada: {area_aprox:.2f}° cuadrados")
    print(f"   Densidad de puntos: {densidad:.2f} puntos/° cuadrado")

    if densidad < 200:
        print(f"   ⚠️  Densidad baja - polígono muy simplificado")
    elif densidad < 500:
        print(f"   ✅ Densidad moderada - balance entre precisión y tamaño")
    else:
        print(f"   ✅ Densidad alta - alta precisión")

    # Recomendaciones
    print(f"\n💡 RECOMENDACIONES:")
    if max_lat < 9.5:
        print(f"   🔴 CRÍTICO: Extender límite norte hasta ~9.57°N para incluir todo el Golfo de Urabá")
    if len(golfo_uraba) < 400:
        print(f"   🟡 Aumentar densidad de puntos en zona del Golfo de Urabá")
    if len(costa_pacifico) < 800:
        print(f"   🟡 Aumentar densidad de puntos en costa del Pacífico para eliminar gaps")

    print(f"\n" + "=" * 80)
    print(f"ANÁLISIS COMPLETADO")
    print("=" * 80)

if __name__ == "__main__":
    geojson_path = Path(__file__).parent.parent / "public" / "data" / "bioregion.geojson"

    if not geojson_path.exists():
        print(f"❌ Error: No se encontró el archivo {geojson_path}")
        sys.exit(1)

    analyze_geojson(geojson_path)
