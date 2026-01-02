from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser

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
