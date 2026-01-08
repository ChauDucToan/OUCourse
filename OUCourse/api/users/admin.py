from unfold.admin import ModelAdmin
from django.contrib import admin
from unfold.forms import forms
from django.utils.safestring import mark_safe
from api.users.models import User

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'password', 'email', 'role', 'avatar']

# Register your models here.
class UserAdmin(ModelAdmin):
    form = UserForm
    list_display = ('small_avatar_view', 'username', 'email', 'role')
    search_fields = ('username', 'email', 'role')

    list_filter = ['role']
    readonly_fields = ['avatar_view']

    list_per_page = 16

    fieldsets = (
        ('Thông tin tài khoản', {
            'fields': (('username', 'password'), ('email', 'role'))
        }),
        ('Thông tin cá nhân', {
            'fields': (('first_name', 'last_name'), ('avatar', 'avatar_view'))
        })
    )

    class Media:
        css = {
            'all': ('/static/css/admin_user.css',)
        }

    @admin.display(description='Avatar')
    def small_avatar_view(self, user):
        if user.avatar:
            return mark_safe(f'<img src="{user.avatar.url}" width="50" class="class="w-12 h-12 rounded object-cover border border-gray-200" />')
        
    def avatar_view(self, user):
        if user.avatar:
            return mark_safe(f'<img src="{user.avatar.url}" width="200" />')