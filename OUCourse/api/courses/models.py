from django.conf import settings
from django.db import models
from ..models import BaseModel
from django.contrib.auth import get_user_model
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField

UserModel = get_user_model()

class Course(BaseModel):
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="owned_courses",
    )
    category = models.ForeignKey(
        "categories.Category", 
        on_delete=models.RESTRICT,
        related_name="courses"
    )

    subject = models.CharField(max_length=255)
    description = RichTextField(null=False)
    image = CloudinaryField(null=True, blank=True)
    video = models.URLField(null=True, blank=True)
    duration = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ['id']

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

class Interaction(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=False
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        null=False
    )

    class Meta:
        abstract = True

class Comment(Interaction):
    content = models.TextField(null=False, blank=False)

    def __str__(self):
        return self.content

class Emotion(Interaction):
    class EmotionType(models.TextChoices):
        LIKE = "LIKE"
        LOVE = "LOVE"
        FUNNY = "FUNNY"
        SAD = "SAD"

    type = models.CharField(
        max_length=10,
        choices=EmotionType.choices,
        null=False
    )

    class Meta:
        unique_together = ('user', 'lesson')