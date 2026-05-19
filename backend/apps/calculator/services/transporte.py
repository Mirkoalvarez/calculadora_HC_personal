"""
Servicio de cálculo de emisiones para transporte.
Módulo 3: Transporte laboral + esporádico.
"""

from ..constants import FACTORES_EMISION, DIAS_LABORALES


def calcular_transporte_laboral(items: list[dict]) -> float:
    """
    Calcula kgCO₂eq anuales de transporte laboral (ida y vuelta diario).

    Cada item: {"vehiculo": str, "km_ida": float, "km_vuelta": float}
    Fórmula: factor × (km_ida + km_vuelta) × DIAS_LABORALES
    """
    total = 0.0
    for item in items:
        factor = FACTORES_EMISION[item["vehiculo"]]
        total += factor * (item["km_ida"] + item["km_vuelta"]) * DIAS_LABORALES
    return total


def calcular_transporte_esporadico(items: list[dict]) -> float:
    """
    Calcula kgCO₂eq de viajes esporádicos (sin multiplicar por días).

    Cada item: {"vehiculo": str, "km_totales": float}
    Fórmula: factor × km_totales
    """
    total = 0.0
    for item in items:
        factor = FACTORES_EMISION[item["vehiculo"]]
        total += factor * item["km_totales"]
    return total


def calcular_transporte(laboral: list[dict], esporadico: list[dict]) -> dict:
    """
    Calcula el total del Módulo 3 y retorna desglose.
    """
    lab = calcular_transporte_laboral(laboral)
    espor = calcular_transporte_esporadico(esporadico)
    return {
        "transporte_laboral_kgco2": round(lab, 4),
        "transporte_esporadico_kgco2": round(espor, 4),
        "total_kgco2": round(lab + espor, 4),
    }
