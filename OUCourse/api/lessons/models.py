from django.db import models
from ..models import BaseModel
from api.courses.models import Course
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField

# Create your models here.
class Tag(BaseModel): 
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Lesson(BaseModel):
    subject = models.CharField(max_length=255)
    content = RichTextField(null=False)
    image = CloudinaryField(null=True)
    video = models.URLField(null=True, blank=True)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )
    tags = models.ManyToManyField(
        Tag,
        related_name="lessons",
        blank=True
    )

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'created_date']
        unique_together = ('course', 'order')

    def __str__(self):
        return self.subject
    
class LessonProgress(BaseModel):
    class Status(models.TextChoices):
        NOT_STARTED = "NOT_STARTED"
        IN_PROGRESS = "IN_PROGRESS"
        COMPLETED = "COMPLETED"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_STARTED,
    )

    student = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name="lesson_progresses",
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="progress",
    )

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f"{self.student.username} - {self.lesson.subject} - {self.status}"