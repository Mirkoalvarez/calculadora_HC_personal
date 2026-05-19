"""
Servicio de cálculo de emisiones para calefacción y refrigeración.
Módulo 2: Clima.
"""

from ..constants import (
    FACTORES_EMISION,
    DIAS_INVIERNO,
    DIAS_VERANO,
)


def calcular_calefaccion(items: list[dict]) -> float:
    """
    Calcula kgCO₂eq anuales de calefacción.

    Cada item: {"aparato": str, "horas_dia": float}
    Fórmula: factor × horas_dia × DIAS_INVIERNO
    """
    total = 0.0
    for item in items:
        factor = FACTORES_EMISION[item["aparato"]]
        total += factor * item["horas_dia"] * DIAS_INVIERNO
    return total


def calcular_refrigeracion(items: list[dict]) -> float:
    """
    Calcula kgCO₂eq anuales de refrigeración.

    Cada item: {"aparato": str, "horas_dia": float}
    Fórmula: factor × horas_dia × DIAS_VERANO
    """
    total = 0.0
    for item in items:
        factor = FACTORES_EMISION[item["aparato"]]
        total += factor * item["horas_dia"] * DIAS_VERANO
    return total


def calcular_clima(calefaccion: list[dict], refrigeracion: list[dict]) -> dict:
    """
    Calcula el total del Módulo 2 y retorna desglose.
    """
    calef = calcular_calefaccion(calefaccion)
    refrig = calcular_refrigeracion(refrigeracion)
    return {
        "calefaccion_kgco2": round(calef, 4),
        "refrigeracion_kgco2": round(refrig, 4),
        "total_kgco2": round(calef + refrig, 4),
    }
