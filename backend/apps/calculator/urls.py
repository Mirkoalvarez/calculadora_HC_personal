from django.urls import path

from . import views

app_name = "calculator"

urlpatterns = [
    path("opciones/", views.OpcionesView.as_view(), name="opciones"),
    path("calcular/", views.CalcularView.as_view(), name="calcular"),
    path("historial/", views.HistorialListView.as_view(), name="historial-list"),
    path("historial/<int:pk>/", views.HistorialDetailView.as_view(), name="historial-detail"),
]
