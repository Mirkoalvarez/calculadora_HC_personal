from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Extensión del modelo User de Django.
    Se usa AbstractUser para facilitar agregar campos extra en el futuro
    (ej: avatar, organización, etc.) sin necesidad de migrar.
    """

    class Meta:
        db_table = "auth_user"
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"

    def __str__(self):
        return self.username
