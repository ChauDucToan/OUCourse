from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.ADMIN)

        if extra_fields.get("role") is not User.Role.ADMIN:
            raise ValueError("Superuser must have role=ADMIN.")

        return super().create_superuser(username, email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN'
        INSTRUCTOR = 'INSTRUCTOR'
        STUDENT = 'STUDENT'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )

    avatar = CloudinaryField('User Avatar', null=True)

    def __str__(self):
        return f"{self.username}-({self.role})"
    
    objects = CustomUserManager()

class FireBaseUser(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='firebase_user'
    )

    firebase_uid = models.CharField(max_length=255, unique=True, null=False)

    def __str__(self):
        return f"FirebaseUser: {self.user.username} - {self.firebase_uid}"