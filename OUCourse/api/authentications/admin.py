from django.contrib import admin
from .models import AuthenticationModel

# Register your models here.
class AuthenticationModelAdmin(admin.ModelAdmin):
    list_display = ('user', 'provider', 'uid', 'expires_at')
    search_fields = ('user__email', 'provider', 'uid')
    list_filter = ('provider',)

admin.site.register(AuthenticationModel, AuthenticationModelAdmin)