from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField

UserModel = get_user_model()

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Category(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
class Tag(BaseModel): 
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
    description = models.TextField(null=False)
    image = CloudinaryField(null=True, blank=True)
    video = models.URLField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def clean(self):
        super().clean()
        if self.instructor and getattr(self.instructor, "role", None) != UserModel.Role.INSTRUCTOR:
            raise ValidationError({"instructor": "must be instructor"})

    def __str__(self):
        return self.subject

class Lesson(BaseModel):
    subject = models.CharField(max_length=255)
    content = RichTextField(null=False)
    image = CloudinaryField(null=True)
    video = models.URLField(null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, related_name="lessons", blank=True)

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'created_date']
        unique_together = ('course', 'order')

    def __str__(self):
        return self.subject

class ManageCourse(models.Model):
    class Status(models.TextChoices):
        ENROLLED = "ENROLLED"
        COMPLETED = "COMPLETED"

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
