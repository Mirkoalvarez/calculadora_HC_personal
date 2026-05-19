# 🌱 Calculadora de Huella de Carbono Personal

Calculadora web que estima las emisiones de CO₂ equivalente (kgCO₂eq) anuales de una persona, basada en tres categorías: artefactos eléctricos, calefacción/refrigeración y transporte.

## Stack

### Backend
- **Django 6** + Django REST Framework
- **JWT Auth** (djangorestframework-simplejwt)
- **SQLite** (dev) / PostgreSQL (prod)
- **pytest** para testing

### Frontend (en desarrollo)
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + Framer Motion

## Setup

```bash
# 1. Clonar el repo
git clone <url> && cd calculadora_HC_personal

# 2. Crear virtualenv e instalar dependencias
python -m venv venv
.\venv\Scripts\activate    # Windows
source venv/bin/activate   # Linux/Mac
pip install -r backend/requirements.txt

# 3. Aplicar migraciones
cd backend
python manage.py migrate

# 4. Crear superusuario (para admin panel)
python manage.py createsuperuser

# 5. Correr el servidor
python manage.py runserver 8000

# 6. Correr tests
pytest -v
```

## API Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Registrar usuario |
| `POST` | `/api/auth/token/` | Obtener JWT (login) |
| `POST` | `/api/auth/token/refresh/` | Renovar access token |
| `GET` | `/api/auth/profile/` | Perfil del usuario (🔒) |

### Calculator
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/calculator/opciones/` | Opciones válidas para formularios |
| `POST` | `/api/calculator/calcular/` | Ejecutar cálculo (🔒) |
| `GET` | `/api/calculator/historial/` | Historial de cálculos (🔒) |
| `GET/DELETE` | `/api/calculator/historial/<id>/` | Detalle/eliminar cálculo (🔒) |

### Ejemplo de cálculo
```json
POST /api/calculator/calcular/
Authorization: Bearer <token>

{
  "artefactos": {
    "electrodomesticos": [
      {"aparato": "PC Escritorio", "cantidad": 1, "horas_dia": 8}
    ],
    "luminarias": [
      {"tipo": "Led", "potencia": "9W", "cantidad": 10, "uso_diario": "1 Hora"}
    ]
  },
  "clima": {
    "calefaccion": [{"aparato": "Estufa a gas", "horas_dia": 4}],
    "refrigeracion": [{"aparato": "Aire Acondicionado", "horas_dia": 6}]
  },
  "transporte": {
    "laboral": [{"vehiculo": "Auto Nafta", "km_ida": 15, "km_vuelta": 15}],
    "esporadico": [{"vehiculo": "Avión", "km_totales": 2000}]
  },
  "label": "Mi huella 2026"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "total_kgco2": 4042.919,
  "total_arboles": 404.2919,
  "detalle": {
    "artefactos_kgco2": 833.7114,
    "clima_kgco2": 598.8476,
    "transporte_kgco2": 2610.36
  }
}
```

## Arquitectura

```
backend/
├── config/            # Django settings, URLs
├── apps/
│   ├── accounts/      # Auth (User, JWT)
│   └── calculator/    # Lógica de cálculo
│       ├── services/  # Lógica pura (testeada)
│       ├── models.py  # CalculationRecord
│       ├── serializers.py
│       └── views.py   # API endpoints
└── requirements.txt
```
