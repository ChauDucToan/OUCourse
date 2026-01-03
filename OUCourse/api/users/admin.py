from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.safestring import mark_safe
from .models import User

# Register your models here.
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role')
    search_fields = ('username', 'email', 'role')

    list_filter = ['id', 'role']
    readonly_fields = ['avatar_view']

    def avatar_view(self, user):
        if user.avatar:
            return mark_safe(f'<img src="{user.avatar.url}" width="200" />')

admin.site.register(User, UserAdmin)