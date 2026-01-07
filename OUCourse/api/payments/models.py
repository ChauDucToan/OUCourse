from django.db import models
from ..models import BaseModel
import uuid

# Create your models here.
class Transaction(BaseModel):
    class statuses(models.IntegerChoices):
        PENDING = 1,
        COMPLETED = 2,
        FAILED = 3,
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount = models.DecimalField(max_digits=12)
    currency = models.CharField(max_length=10)
    payment_method = models.CharField(max_length=50)
    status = models.IntegerField(choices=statuses.choices, default=statuses.PENDING)
    provider = models.CharField(max_length=20)

    courses = models.ForeignKey(
        'courses.Course',
        on_delete=models.SET_NULL,
        null=True,
    )

    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='payments'
    )

class TransactionDetail(BaseModel):
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='details'
    )
    description = models.TextField()
# not done yet