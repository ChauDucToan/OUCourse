from django.db import models
from ..models import BaseModel

# Create your models here.
class AuthenticationModel(BaseModel):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE
    )
    provider = models.CharField(max_length=50)
    uid = models.CharField(max_length=255)
    access_token = models.TextField()
    refresh_token = models.TextField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('provider', 'uid')

    def __str__(self):
        return f"{self.user.email} - {self.provider}"