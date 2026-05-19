from rest_framework import serializers

from .constants import (
    FACTORES_EMISION,
    FACTORES_LUMINARIAS,
    HORAS_USO,
    APARATOS_ELECTRICOS,
    APARATOS_CALEFACCION,
    APARATOS_REFRIGERACION,
    VEHICULOS,
)
from .models import CalculationRecord


# ──────────────────────────────────────────────
# INPUT SERIALIZERS (validación)
# ──────────────────────────────────────────────

class ElectrodomesticoSerializer(serializers.Serializer):
    aparato = serializers.ChoiceField(choices=[(a, a) for a in APARATOS_ELECTRICOS])
    cantidad = serializers.IntegerField(min_value=0)
    horas_dia = serializers.FloatField(min_value=0)


class LuminariaSerializer(serializers.Serializer):
    tipo = serializers.CharField()
    potencia = serializers.CharField()
    cantidad = serializers.IntegerField(min_value=0)
    uso_diario = serializers.ChoiceField(choices=[(k, k) for k in HORAS_USO])

    def validate(self, attrs):
        clave = f"{attrs['tipo']} {attrs['potencia']}"
        if clave not in FACTORES_LUMINARIAS:
            raise serializers.ValidationError(
                f"La combinación '{clave}' no existe en los factores de luminarias. "
                f"Valores válidos: {list(FACTORES_LUMINARIAS.keys())}"
            )
        return attrs


class CalefaccionSerializer(serializers.Serializer):
    aparato = serializers.ChoiceField(choices=[(a, a) for a in APARATOS_CALEFACCION])
    horas_dia = serializers.FloatField(min_value=0)


class RefrigeracionSerializer(serializers.Serializer):
    aparato = serializers.ChoiceField(choices=[(a, a) for a in APARATOS_REFRIGERACION])
    horas_dia = serializers.FloatField(min_value=0)


class TransporteLaboralSerializer(serializers.Serializer):
    vehiculo = serializers.ChoiceField(choices=[(v, v) for v in VEHICULOS])
    km_ida = serializers.FloatField(min_value=0)
    km_vuelta = serializers.FloatField(min_value=0)


class TransporteEsporadicoSerializer(serializers.Serializer):
    vehiculo = serializers.ChoiceField(choices=[(v, v) for v in VEHICULOS])
    km_totales = serializers.FloatField(min_value=0)


# ──────────────────────────────────────────────
# SUB-SECCIONES
# ──────────────────────────────────────────────

class ArtefactosInputSerializer(serializers.Serializer):
    electrodomesticos = ElectrodomesticoSerializer(many=True, required=False, default=[])
    luminarias = LuminariaSerializer(many=True, required=False, default=[])


class ClimaInputSerializer(serializers.Serializer):
    calefaccion = CalefaccionSerializer(many=True, required=False, default=[])
    refrigeracion = RefrigeracionSerializer(many=True, required=False, default=[])


class TransporteInputSerializer(serializers.Serializer):
    laboral = TransporteLaboralSerializer(many=True, required=False, default=[])
    esporadico = TransporteEsporadicoSerializer(many=True, required=False, default=[])


# ──────────────────────────────────────────────
# SERIALIZER PRINCIPAL DE CÁLCULO
# ──────────────────────────────────────────────

class CalcularInputSerializer(serializers.Serializer):
    """Valida el input completo para el endpoint POST /calcular/."""

    artefactos = ArtefactosInputSerializer(required=False, default={})
    clima = ClimaInputSerializer(required=False, default={})
    transporte = TransporteInputSerializer(required=False, default={})
    label = serializers.CharField(max_length=100, required=False, default="")


# ──────────────────────────────────────────────
# OUTPUT SERIALIZERS
# ──────────────────────────────────────────────

class CalculationRecordSerializer(serializers.ModelSerializer):
    """Serializer para historial de cálculos (lectura)."""

    class Meta:
        model = CalculationRecord
        fields = (
            "id",
            "total_kgco2",
            "total_arboles",
            "artefactos_kgco2",
            "clima_kgco2",
            "transporte_kgco2",
            "detalle",
            "input_data",
            "label",
            "created_at",
        )
        read_only_fields = fields


class CalculationRecordListSerializer(serializers.ModelSerializer):
    """Serializer compacto para listado de historial."""

    class Meta:
        model = CalculationRecord
        fields = (
            "id",
            "total_kgco2",
            "total_arboles",
            "label",
            "created_at",
        )
        read_only_fields = fields
