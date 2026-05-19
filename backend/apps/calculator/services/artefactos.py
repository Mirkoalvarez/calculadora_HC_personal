"""
Servicio de cálculo de emisiones para artefactos eléctricos.
Módulo 1: Electrodomésticos + Luminarias.
"""

from ..constants import (
    FACTORES_EMISION,
    FACTORES_LUMINARIAS,
    HORAS_USO,
    DIAS_LABORALES,
)


def calcular_electrodomesticos(items: list[dict]) -> float:
    """
    Calcula kgCO₂eq anuales de electrodomésticos y equipos de oficina.

    Cada item: {"aparato": str, "cantidad": int, "horas_dia": float}
    Fórmula: factor × cantidad × horas_dia × DIAS_LABORALES
    """
    total = 0.0
    for item in items:
        factor = FACTORES_EMISION[item["aparato"]]
        total += factor * item["cantidad"] * item["horas_dia"] * DIAS_LABORALES
    return total


def calcular_luminarias(items: list[dict]) -> float:
    """
    Calcula kgCO₂eq anuales de luminarias.

    Cada item: {"tipo": str, "potencia": str, "cantidad": int, "uso_diario": str}
    Fórmula: factor × cantidad × horas × DIAS_LABORALES
    """
    total = 0.0
    for item in items:
        clave = f"{item['tipo']} {item['potencia']}"
        factor = FACTORES_LUMINARIAS[clave]
        horas = HORAS_USO[item["uso_diario"]]
        total += factor * item["cantidad"] * horas * DIAS_LABORALES
    return total


def calcular_artefactos(electrodomesticos: list[dict], luminarias: list[dict]) -> dict:
    """
    Calcula el total del Módulo 1 y retorna desglose.
    """
    electro = calcular_electrodomesticos(electrodomesticos)
    lumin = calcular_luminarias(luminarias)
    return {
        "electrodomesticos_kgco2": round(electro, 4),
        "luminarias_kgco2": round(lumin, 4),
        "total_kgco2": round(electro + lumin, 4),
    }
