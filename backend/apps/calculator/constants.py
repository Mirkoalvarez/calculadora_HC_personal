"""
Constantes de la calculadora de Huella de Carbono Personal.

Todos los factores de emisión provienen de la planilla Excel original.
Unidades: kgCO₂eq por hora de uso (artefactos/clima) o por km (transporte).
"""

# ──────────────────────────────────────────────
# CONSTANTES GENERALES
# ──────────────────────────────────────────────
DIAS_LABORALES = 230   # días al año con uso laboral
DIAS_INVIERNO = 95     # días de temporada de calefacción
DIAS_VERANO = 135      # días de temporada de refrigeración
ARBOLES_FACTOR = 10    # kgCO2eq secuestrados por árbol por año


# ──────────────────────────────────────────────
# FACTORES DE EMISIÓN (kgCO₂eq por unidad)
# ──────────────────────────────────────────────
FACTORES_EMISION = {
    # Artefactos eléctricos (kgCO2eq por hora de uso)
    "PC Escritorio":       0.35,
    "PC Portátil":         0.010692,
    "Multifunción":        0.4374,
    "Fotocopiadora":       0.4374,
    "Impresora":           0.3645,
    "Freezer":             0.04374,
    "Heladera":            0.030618,
    "Microondas":          0.31104,
    "Dispenser":           0.1215,
    "Pava eléctrica":      1.1664,
    "Radio":               0.02916,
    # Calefacción (kgCO2eq por hora)
    "Estufa a gas":        0.5265,
    "Caloventor":          0.972,
    "Radiador eléctrico":  0.46656,
    "Estufa Infrarroja":   0.7776,
    "Estufa de Cuarzo":    0.5832,
    # Refrigeración (kgCO2eq por hora)
    "Ventilador":          0.04374,
    "Aire Acondicionado":  0.492318,
    # Transporte (kgCO2eq por km)
    "Pie":                 0.0,
    "Bicicleta":           0.0,
    "Moto":                0.0711,
    "Auto Nafta":          0.2844,
    "Auto Diesel":         0.3047,
    "Auto GNC":            0.195,
    "Camioneta Nafta":     0.1422,
    "Camioneta Diesel":    0.1939,
    "Colectivo":           0.026592,
    "Combi":               0.3047,
    "Avión":               0.324,
}


# ──────────────────────────────────────────────
# FACTORES PARA LUMINARIAS (kgCO₂eq por hora)
# Clave: "{tipo} {potencia}" (ej: "Led 9W")
# ──────────────────────────────────────────────
FACTORES_LUMINARIAS = {
    "Incandescente 20W":         0.020,
    "Incandescente 40W":         0.040,
    "Incandescente 60W":         0.060,
    "Incandescente 75W":         0.075,
    "Incandescente 100W":        0.100,
    "Fluorescente compacta 8W":  0.008,
    "Fluorescente compacta 12W": 0.012,
    "Fluorescente compacta 15W": 0.015,
    "Fluorescente compacta 20W": 0.020,
    "Fluorescente compacta 23W": 0.023,
    "Led 4W":                    0.004,
    "Led 6W":                    0.006,
    "Led 9W":                    0.009,
    "Led 11W":                   0.011,
    "Led 15W":                   0.015,
    "Tubo fluorescente 18W":     0.018,
    "Tubo fluorescente 30W":     0.030,
    "Tubo fluorescente 36W":     0.036,
    "Tubo fluorescente 58W":     0.058,
    "Tubo Led 9W":               0.009,
    "Tubo Led 14W":              0.014,
    "Tubo Led 18W":              0.018,
    "Tubo Led 25W":              0.025,
}


# ──────────────────────────────────────────────
# LOOKUP HORAS SEGÚN DESCRIPCIÓN DE USO DIARIO
# ──────────────────────────────────────────────
HORAS_USO = {
    "Sin uso":      0.0,
    "5 Minutos":    0.083,
    "10 Minutos":   0.17,
    "15 Minutos":   0.25,
    "30 Minutos":   0.5,
    "1 Hora":       1.0,
    "2 Horas":      2.0,
}


# ──────────────────────────────────────────────
# CATEGORÍAS (para validación y endpoint /opciones)
# ──────────────────────────────────────────────
APARATOS_ELECTRICOS = [
    "PC Escritorio", "PC Portátil", "Multifunción", "Fotocopiadora",
    "Impresora", "Freezer", "Heladera", "Microondas", "Dispenser",
    "Pava eléctrica", "Radio",
]

APARATOS_CALEFACCION = [
    "Estufa a gas", "Caloventor", "Radiador eléctrico",
    "Estufa Infrarroja", "Estufa de Cuarzo",
]

APARATOS_REFRIGERACION = [
    "Ventilador", "Aire Acondicionado",
]

VEHICULOS = [
    "Pie", "Bicicleta", "Moto", "Auto Nafta", "Auto Diesel",
    "Auto GNC", "Camioneta Nafta", "Camioneta Diesel",
    "Colectivo", "Combi", "Avión",
]

TIPOS_LUMINARIA = [
    "Incandescente", "Fluorescente compacta", "Led",
    "Tubo fluorescente", "Tubo Led",
]

POTENCIAS_POR_TIPO = {
    "Incandescente":        ["20W", "40W", "60W", "75W", "100W"],
    "Fluorescente compacta": ["8W", "12W", "15W", "20W", "23W"],
    "Led":                  ["4W", "6W", "9W", "11W", "15W"],
    "Tubo fluorescente":    ["18W", "30W", "36W", "58W"],
    "Tubo Led":             ["9W", "14W", "18W", "25W"],
}
