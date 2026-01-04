from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from ..models import BaseModel
from django.contrib.auth import get_user_model
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField

UserModel = get_user_model()

class Category(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Course(BaseModel):
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="owned_courses",
    )
    category = models.ForeignKey(Category, on_delete=models.RESTRICT, related_name="courses")

    subject = models.CharField(max_length=255)
    description = RichTextField(null=False)
    image = CloudinaryField(null=True, blank=True)
    video = models.URLField(null=True, blank=True)
    duration = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def clean(self):
        super().clean()
        if self.instructor and getattr(self.instructor, "role", None) != UserModel.Role.INSTRUCTOR:
            raise ValidationError({"instructor": "must be instructor"})

    def __str__(self):
        return self.subject

class ManageCourse(models.Model):
    class Status(models.TextChoices):
        UNENROLLED = "UNENROLLED"
        ENROLLED = "ENROLLED"
        COMPLETED = "COMPLETED"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UNENROLLED,
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="managed_courses",
    )

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="managed_students",
    )