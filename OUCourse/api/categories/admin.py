from django.contrib import admin
from .models import Category

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'active', 'created_date')
    search_fields = ('name',)

admin.site.register(Category, CategoryAdmin)