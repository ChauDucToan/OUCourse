from django.db import models
from ..models import BaseModel
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