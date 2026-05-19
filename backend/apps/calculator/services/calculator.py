"""
Servicio orquestador de cálculo de Huella de Carbono.
Combina los 3 módulos y calcula el resultado final.
"""

from ..constants import ARBOLES_FACTOR
from .artefactos import calcular_artefactos
from .clima import calcular_clima
from .transporte import calcular_transporte


def calcular_huella_total(data: dict) -> dict:
    """
    Orquesta todos los módulos de cálculo y retorna el resultado final.

    Args:
        data: diccionario con las claves "artefactos", "clima", "transporte"
              siguiendo el esquema del endpoint POST /api/calculator/calcular/

    Returns:
        dict con total_kgco2, total_arboles y detalle por módulo.
    """
    # Módulo 1: Artefactos eléctricos
    artefactos_data = data.get("artefactos", {})
    artefactos = calcular_artefactos(
        electrodomesticos=artefactos_data.get("electrodomesticos", []),
        luminarias=artefactos_data.get("luminarias", []),
    )

    # Módulo 2: Clima (calefacción + refrigeración)
    clima_data = data.get("clima", {})
    clima = calcular_clima(
        calefaccion=clima_data.get("calefaccion", []),
        refrigeracion=clima_data.get("refrigeracion", []),
    )

    # Módulo 3: Transporte
    transporte_data = data.get("transporte", {})
    transporte = calcular_transporte(
        laboral=transporte_data.get("laboral", []),
        esporadico=transporte_data.get("esporadico", []),
    )

    # Totales
    total_kgco2 = artefactos["total_kgco2"] + clima["total_kgco2"] + transporte["total_kgco2"]
    total_arboles = total_kgco2 / ARBOLES_FACTOR

    return {
        "total_kgco2": round(total_kgco2, 4),
        "total_arboles": round(total_arboles, 4),
        "detalle": {
            "artefactos_kgco2": artefactos["total_kgco2"],
            "electrodomesticos_kgco2": artefactos["electrodomesticos_kgco2"],
            "luminarias_kgco2": artefactos["luminarias_kgco2"],
            "clima_kgco2": clima["total_kgco2"],
            "calefaccion_kgco2": clima["calefaccion_kgco2"],
            "refrigeracion_kgco2": clima["refrigeracion_kgco2"],
            "transporte_kgco2": transporte["total_kgco2"],
            "transporte_laboral_kgco2": transporte["transporte_laboral_kgco2"],
            "transporte_esporadico_kgco2": transporte["transporte_esporadico_kgco2"],
        },
    }
