from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField


class Role(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    TEACHER = 'TEACHER' , "Giang vien"
    STUDENT = 'STUDENT', "Sinh vien"

class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )
    avatar = CloudinaryField(null=True)
    name = models.CharField(max_length=100, null=False)
    phone = models.CharField(max_length=20, blank=True)

    def is_admin(self):
        return self.role == Role.ADMIN

    def is_teacher(self):
        return self.role == Role.TEACHER

    def is_student(self):
        return self.role == Role.STUDENT

    def __str__(self):
        return f"{self.username}-({self.role})"


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
class Course(BaseModel):
    subject = models.CharField(max_length=255)
    description = models.TextField(null=False)
    image = CloudinaryField(null=True) #models.ImageField(upload_to='courses/%Y/%m', null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.subject


class Lesson(BaseModel):
    subject = models.CharField(max_length=255)
    content = RichTextField(null=False)
    image = CloudinaryField(null=True) #models.ImageField(upload_to='lessons/%Y/%m', null=True)
    course = models.ForeignKey(Course, on_delete=models.RESTRICT)
    tags = models.ManyToManyField('Tag')

    def __str__(self):
        return self.subject
