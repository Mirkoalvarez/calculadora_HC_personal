from django.contrib import admin
from .models import CalculationRecord


@admin.register(CalculationRecord)
class CalculationRecordAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "total_kgco2",
        "total_arboles",
        "label",
        "created_at",
    )
    list_filter = ("created_at", "user")
    search_fields = ("user__username", "label")
    readonly_fields = ("input_data", "detalle", "created_at")
    list_per_page = 25
