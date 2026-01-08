from unfold.admin import ModelAdmin
from .models import Comment

# Register your models here.

class CommentAdmin(ModelAdmin):
    class Meta:
        model = Comment

    list_per_page = 12

    list_display = ('id', 'user', 'lesson', 'content', 'created_date')
    search_fields = ('user__username', 'lesson__subject', 'content')
    list_filter = ('created_date',)