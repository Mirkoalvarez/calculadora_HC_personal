"""
Tests unitarios para los servicios de cálculo (lógica pura).
Estos tests NO dependen de la base de datos ni de Django.
"""

import pytest

from apps.calculator.constants import (
    DIAS_LABORALES,
    DIAS_INVIERNO,
    DIAS_VERANO,
    ARBOLES_FACTOR,
)
from apps.calculator.services.artefactos import (
    calcular_electrodomesticos,
    calcular_luminarias,
)
from apps.calculator.services.clima import (
    calcular_calefaccion,
    calcular_refrigeracion,
)
from apps.calculator.services.transporte import (
    calcular_transporte_laboral,
    calcular_transporte_esporadico,
)
from apps.calculator.services.calculator import calcular_huella_total


# ──────────────────────────────────────────────
# MÓDULO 1: ARTEFACTOS ELÉCTRICOS
# ──────────────────────────────────────────────

class TestElectrodomesticos:
    def test_single_item(self):
        """PC Escritorio: 0.35 × 1 × 8 × 230 = 644.0"""
        items = [{"aparato": "PC Escritorio", "cantidad": 1, "horas_dia": 8}]
        result = calcular_electrodomesticos(items)
        assert result == pytest.approx(0.35 * 1 * 8 * DIAS_LABORALES, rel=1e-4)

    def test_multiple_items(self):
        items = [
            {"aparato": "PC Escritorio", "cantidad": 2, "horas_dia": 8},
            {"aparato": "Heladera", "cantidad": 1, "horas_dia": 24},
        ]
        expected = (0.35 * 2 * 8 * DIAS_LABORALES) + (0.030618 * 1 * 24 * DIAS_LABORALES)
        result = calcular_electrodomesticos(items)
        assert result == pytest.approx(expected, rel=1e-4)

    def test_empty_list(self):
        assert calcular_electrodomesticos([]) == 0.0

    def test_zero_quantity(self):
        items = [{"aparato": "PC Escritorio", "cantidad": 0, "horas_dia": 8}]
        assert calcular_electrodomesticos(items) == 0.0

    def test_zero_hours(self):
        items = [{"aparato": "PC Escritorio", "cantidad": 1, "horas_dia": 0}]
        assert calcular_electrodomesticos(items) == 0.0


class TestLuminarias:
    def test_single_luminaria(self):
        """Led 9W, 2 unidades, 1 hora: 0.009 × 2 × 1.0 × 230 = 4.14"""
        items = [{"tipo": "Led", "potencia": "9W", "cantidad": 2, "uso_diario": "1 Hora"}]
        result = calcular_luminarias(items)
        expected = 0.009 * 2 * 1.0 * DIAS_LABORALES
        assert result == pytest.approx(expected, rel=1e-4)

    def test_sin_uso(self):
        items = [{"tipo": "Led", "potencia": "9W", "cantidad": 5, "uso_diario": "Sin uso"}]
        assert calcular_luminarias(items) == 0.0

    def test_incandescente(self):
        items = [{"tipo": "Incandescente", "potencia": "60W", "cantidad": 3, "uso_diario": "2 Horas"}]
        expected = 0.060 * 3 * 2.0 * DIAS_LABORALES
        result = calcular_luminarias(items)
        assert result == pytest.approx(expected, rel=1e-4)

    def test_empty_list(self):
        assert calcular_luminarias([]) == 0.0


# ──────────────────────────────────────────────
# MÓDULO 2: CLIMA
# ──────────────────────────────────────────────

class TestCalefaccion:
    def test_estufa_gas(self):
        """Estufa a gas: 0.5265 × 4 × 95 = 200.07"""
        items = [{"aparato": "Estufa a gas", "horas_dia": 4}]
        expected = 0.5265 * 4 * DIAS_INVIERNO
        result = calcular_calefaccion(items)
        assert result == pytest.approx(expected, rel=1e-4)

    def test_empty_list(self):
        assert calcular_calefaccion([]) == 0.0


class TestRefrigeracion:
    def test_aire_acondicionado(self):
        """AC: 0.492318 × 6 × 135 = 398.78"""
        items = [{"aparato": "Aire Acondicionado", "horas_dia": 6}]
        expected = 0.492318 * 6 * DIAS_VERANO
        result = calcular_refrigeracion(items)
        assert result == pytest.approx(expected, rel=1e-4)

    def test_empty_list(self):
        assert calcular_refrigeracion([]) == 0.0


# ──────────────────────────────────────────────
# MÓDULO 3: TRANSPORTE
# ──────────────────────────────────────────────

class TestTransporteLaboral:
    def test_auto_nafta(self):
        """Auto Nafta: 0.2844 × (15 + 15) × 230 = 1962.36"""
        items = [{"vehiculo": "Auto Nafta", "km_ida": 15, "km_vuelta": 15}]
        expected = 0.2844 * (15 + 15) * DIAS_LABORALES
        result = calcular_transporte_laboral(items)
        assert result == pytest.approx(expected, rel=1e-4)

    def test_bicicleta(self):
        """Bicicleta: factor 0.0, sin emisiones."""
        items = [{"vehiculo": "Bicicleta", "km_ida": 10, "km_vuelta": 10}]
        assert calcular_transporte_laboral(items) == 0.0

    def test_empty_list(self):
        assert calcular_transporte_laboral([]) == 0.0


class TestTransporteEsporadico:
    def test_avion(self):
        """Avión: 0.324 × 2000 = 648.0"""
        items = [{"vehiculo": "Avión", "km_totales": 2000}]
        expected = 0.324 * 2000
        result = calcular_transporte_esporadico(items)
        assert result == pytest.approx(expected, rel=1e-4)

    def test_empty_list(self):
        assert calcular_transporte_esporadico([]) == 0.0


# ──────────────────────────────────────────────
# ORQUESTADOR COMPLETO
# ──────────────────────────────────────────────

class TestCalcularHuellaTotal:
    def test_full_calculation(self):
        """Test completo con datos en los 3 módulos."""
        data = {
            "artefactos": {
                "electrodomesticos": [
                    {"aparato": "PC Escritorio", "cantidad": 1, "horas_dia": 8},
                ],
                "luminarias": [
                    {"tipo": "Led", "potencia": "9W", "cantidad": 4, "uso_diario": "1 Hora"},
                ],
            },
            "clima": {
                "calefaccion": [
                    {"aparato": "Estufa a gas", "horas_dia": 3},
                ],
                "refrigeracion": [
                    {"aparato": "Ventilador", "horas_dia": 4},
                ],
            },
            "transporte": {
                "laboral": [
                    {"vehiculo": "Colectivo", "km_ida": 10, "km_vuelta": 10},
                ],
                "esporadico": [
                    {"vehiculo": "Avión", "km_totales": 1000},
                ],
            },
        }

        result = calcular_huella_total(data)

        # Verificar estructura
        assert "total_kgco2" in result
        assert "total_arboles" in result
        assert "detalle" in result

        # Verificar que total = suma de módulos
        detalle = result["detalle"]
        total_modulos = (
            detalle["artefactos_kgco2"]
            + detalle["clima_kgco2"]
            + detalle["transporte_kgco2"]
        )
        assert result["total_kgco2"] == pytest.approx(total_modulos, rel=1e-4)

        # Verificar árboles
        assert result["total_arboles"] == pytest.approx(
            result["total_kgco2"] / ARBOLES_FACTOR, rel=1e-4
        )

        # Verificar que los valores son positivos
        assert result["total_kgco2"] > 0
        assert result["total_arboles"] > 0

    def test_empty_input(self):
        """Sin datos, todo debe ser 0."""
        result = calcular_huella_total({})
        assert result["total_kgco2"] == 0.0
        assert result["total_arboles"] == 0.0

    def test_partial_input(self):
        """Solo un módulo con datos."""
        data = {
            "transporte": {
                "esporadico": [
                    {"vehiculo": "Avión", "km_totales": 500},
                ],
            },
        }
        result = calcular_huella_total(data)
        expected = 0.324 * 500
        assert result["total_kgco2"] == pytest.approx(expected, rel=1e-4)
        assert result["detalle"]["artefactos_kgco2"] == 0.0
        assert result["detalle"]["clima_kgco2"] == 0.0
