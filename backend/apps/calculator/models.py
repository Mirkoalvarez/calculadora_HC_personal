from django.db import models
from django.conf import settings


class CalculationRecord(models.Model):
    """
    Registro de un cálculo de huella de carbono.
    Guarda el resultado y el input original para poder reproducirlo.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="calculations",
        verbose_name="usuario",
    )

    # Resultados
    total_kgco2 = models.FloatField(verbose_name="Total kgCO₂eq")
    total_arboles = models.FloatField(verbose_name="Árboles equivalentes")
    artefactos_kgco2 = models.FloatField(verbose_name="Artefactos kgCO₂eq")
    clima_kgco2 = models.FloatField(verbose_name="Clima kgCO₂eq")
    transporte_kgco2 = models.FloatField(verbose_name="Transporte kgCO₂eq")

    # Input original (JSON para poder reproducir el cálculo)
    input_data = models.JSONField(verbose_name="Datos de entrada")

    # Detalle completo del cálculo
    detalle = models.JSONField(
        verbose_name="Detalle del cálculo",
        default=dict,
        blank=True,
    )

    # Metadata
    label = models.CharField(
        max_length=100,
        blank=True,
        default="",
        verbose_name="Etiqueta",
        help_text="Nombre descriptivo opcional para identificar este cálculo.",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "registro de cálculo"
        verbose_name_plural = "registros de cálculos"

    def __str__(self):
        return (
            f"{self.user.username} — {self.total_kgco2:.1f} kgCO₂eq "
            f"({self.created_at:%Y-%m-%d %H:%M})"
        )
