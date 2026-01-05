from django.db import models
from ..models import BaseModel

# Create your models here.

class Category(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name