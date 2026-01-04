from django.db import models
from ..courses.models import BaseModel
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings
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
        'courses.Course',
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

class Emotion(BaseModel):
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

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=False
    )

    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE,
        null=False,
    )

    object_id = models.PositiveIntegerField(null=False)

    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')

    def __str__(self):
        return f"{self.user.username} {self.type} {self.content_object}"