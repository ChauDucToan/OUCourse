from django.core.exceptions import ValidationError
from django.db import models
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from ..Authentication.models import User

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

def validate_instructor(instructor):
    if instructor.role != User.Role.INSTRUCTOR:
        raise ValidationError({"user": "must be intructor"})

class Course(BaseModel):
    instructor = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='owned_courses', validators=[validate_instructor])
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='courses')

    subject = models.CharField(max_length=255)
    description = models.TextField(null=False)
    image = CloudinaryField(null=True, blank=True)
    video = CloudinaryField(null=True, blank=True) # Introduction Course
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.subject


class Lesson(BaseModel):
    subject = models.CharField(max_length=255)
    content = RichTextField(null=False)
    image = CloudinaryField(null=True)
    course = models.ForeignKey(Course, on_delete=models.RESTRICT)

    def __str__(self):
        return self.subject

class ManageCourse(models.Model):
    class Status(models.TextChoices):
        ENROLLED = "ENROLLED"
        COMPLETED = "COMPLETED"

    student = models.ForeignKey(
        to="User",
        on_delete=models.CASCADE,
        related_name="managed_courses"
    )
    course = models.ForeignKey(
        to="Course",
        on_delete=models.CASCADE,
        related_name="managed_students"
    )
