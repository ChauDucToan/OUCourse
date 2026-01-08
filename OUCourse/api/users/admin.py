from unfold.admin import ModelAdmin
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
    list_display = ('username', 'email', 'role')
    search_fields = ('username', 'email', 'role')

    list_filter = ['role']
    readonly_fields = ['avatar_view']

    fieldsets = (
        ('Thông tin tài khoản', {
            'fields': (('username', 'password'), ('email', 'role'))
        }),
        ('Thông tin cá nhân', {
            'fields': (('first_name', 'last_name'), ('avatar', 'avatar_view'))
        })
    )
        
    def avatar_view(self, user):
        if user.avatar:
            return mark_safe(f'<img src="{user.avatar.url}.png" width="200" />')