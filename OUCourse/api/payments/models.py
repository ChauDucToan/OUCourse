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

    order_code = models.CharField(max_length=100, unique=True, null=True, blank=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    payment_method = models.CharField(max_length=50)

    status = models.IntegerField(choices=statuses.choices, default=statuses.PENDING)

    provider = models.CharField(max_length=20)
    provider_transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='payments'
    )

    def __str__(self):
        return f"Order {self.id} - {self.total_amount}"

class TransactionDetail(BaseModel):
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    courses = models.ForeignKey(
        'courses.Course',
        on_delete=models.SET_NULL,
        null=True,
    )

    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.transaction.order_code} - {self.course_name_snapshot}"