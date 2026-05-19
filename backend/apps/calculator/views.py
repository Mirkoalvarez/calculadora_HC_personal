from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .constants import (
    APARATOS_ELECTRICOS,
    APARATOS_CALEFACCION,
    APARATOS_REFRIGERACION,
    VEHICULOS,
    TIPOS_LUMINARIA,
    POTENCIAS_POR_TIPO,
    HORAS_USO,
    FACTORES_EMISION,
    FACTORES_LUMINARIAS,
    DIAS_LABORALES,
    DIAS_INVIERNO,
    DIAS_VERANO,
    ARBOLES_FACTOR,
)
from .models import CalculationRecord
from .serializers import (
    CalcularInputSerializer,
    CalculationRecordSerializer,
    CalculationRecordListSerializer,
)
from .services.calculator import calcular_huella_total


class OpcionesView(APIView):
    """
    GET /api/calculator/opciones/
    Retorna todas las opciones válidas para poblar los formularios del frontend.
    Público (no requiere auth).
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(
            {
                "electrodomesticos": APARATOS_ELECTRICOS,
                "calefaccion": APARATOS_CALEFACCION,
                "refrigeracion": APARATOS_REFRIGERACION,
                "vehiculos": VEHICULOS,
                "luminarias": {
                    "tipos": TIPOS_LUMINARIA,
                    "potencias_por_tipo": POTENCIAS_POR_TIPO,
                },
                "horas_uso": list(HORAS_USO.keys()),
                "constantes": {
                    "dias_laborales": DIAS_LABORALES,
                    "dias_invierno": DIAS_INVIERNO,
                    "dias_verano": DIAS_VERANO,
                    "arboles_factor": ARBOLES_FACTOR,
                },
            }
        )


class CalcularView(APIView):
    """
    POST /api/calculator/calcular/
    Ejecuta el cálculo completo de huella de carbono.
    Requiere autenticación JWT.
    Guarda el resultado en el historial del usuario.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Validar input
        serializer = CalcularInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Calcular (service layer — lógica pura)
        resultado = calcular_huella_total(data)

        # Persistir en historial
        record = CalculationRecord.objects.create(
            user=request.user,
            total_kgco2=resultado["total_kgco2"],
            total_arboles=resultado["total_arboles"],
            artefactos_kgco2=resultado["detalle"]["artefactos_kgco2"],
            clima_kgco2=resultado["detalle"]["clima_kgco2"],
            transporte_kgco2=resultado["detalle"]["transporte_kgco2"],
            detalle=resultado["detalle"],
            input_data=data,
            label=data.get("label", ""),
        )

        return Response(
            {
                "id": record.id,
                **resultado,
            },
            status=status.HTTP_201_CREATED,
        )


class HistorialListView(generics.ListAPIView):
    """
    GET /api/calculator/historial/
    Lista de todos los cálculos del usuario autenticado.
    """

    serializer_class = CalculationRecordListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CalculationRecord.objects.filter(user=self.request.user)


class HistorialDetailView(generics.RetrieveDestroyAPIView):
    """
    GET /api/calculator/historial/<id>/
    DELETE /api/calculator/historial/<id>/
    Detalle o eliminación de un cálculo específico.
    Solo accesible por el dueño del registro.
    """

    serializer_class = CalculationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CalculationRecord.objects.filter(user=self.request.user)
