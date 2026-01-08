from django.db import models
from ..models import BaseModel
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings

# Create your models here.

class Interaction(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=False
    )

    lesson = models.ForeignKey(
        'lessons.Lesson',
        on_delete=models.CASCADE,
        null=False
    )

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Comment(Interaction):
    content = models.TextField(null=False, blank=False)

    def __str__(self):
        return self.content

class Emotion(BaseModel):
    class EmotionType(models.IntegerChoices):
        LIKE = 1
        LOVE = 2
        FUNNY = 3
        SAD = 4

    type = models.SmallIntegerField(
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