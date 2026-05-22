"""
Django settings for Calculadora HC Personal.

Configuración para desarrollo local con SQLite.
Para producción: cambiar SECRET_KEY, DEBUG, ALLOWED_HOSTS, y DATABASE.
"""

from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-ps89zcr5+*h6)j21d^@t=lj7-*!u%$@z(p$y6kg!d5xb909p3b"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]


# ──────────────────────────────────────────────
# APPLICATION DEFINITION
# ──────────────────────────────────────────────

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    # Local apps
    "apps.accounts",
    "apps.calculator",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS — debe ir antes de CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ──────────────────────────────────────────────
# DATABASE
# ──────────────────────────────────────────────

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ──────────────────────────────────────────────
# CUSTOM USER MODEL
# ──────────────────────────────────────────────

AUTH_USER_MODEL = "accounts.User"


# ──────────────────────────────────────────────
# PASSWORD VALIDATION
# ──────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ──────────────────────────────────────────────
# INTERNATIONALIZATION
# ──────────────────────────────────────────────

LANGUAGE_CODE = "es-ar"
TIME_ZONE = "America/Argentina/Buenos_Aires"
USE_I18N = True
USE_TZ = True


# ──────────────────────────────────────────────
# STATIC FILES
# ──────────────────────────────────────────────

STATIC_URL = "static/"


# ──────────────────────────────────────────────
# DEFAULT PRIMARY KEY
# ──────────────────────────────────────────────

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ──────────────────────────────────────────────
# DJANGO REST FRAMEWORK
# ──────────────────────────────────────────────

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        # Browsable API solo en debug
        *(("rest_framework.renderers.BrowsableAPIRenderer",) if DEBUG else ()),
    ),
}


# ──────────────────────────────────────────────
# JWT CONFIGURATION
# ──────────────────────────────────────────────

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ──────────────────────────────────────────────
# CORS (para el frontend React en otro puerto)
# ──────────────────────────────────────────────

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5180",  # Vite dev server
    "http://127.0.0.1:5180",
]
CORS_ALLOW_CREDENTIALS = True
