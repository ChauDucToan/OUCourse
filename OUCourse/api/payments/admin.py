from unfold.admin import ModelAdmin
from .models import Transaction

# Register your models here.

class TransactionAdmin(ModelAdmin):
    class Meta:
        model = Transaction

    list_per_page = 12

    list_display = ('id', 'user', 'total_amount', 'status', 'created_date')
    search_fields = ('user__username', 'total_amount', 'status')
    list_filter = ('status', 'created_date')
