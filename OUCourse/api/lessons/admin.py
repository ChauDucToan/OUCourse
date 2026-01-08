from unfold.admin import ModelAdmin
from unfold.forms import forms

from api.lessons.models import Lesson
from django.utils.safestring import mark_safe
from django.contrib import admin

# Register your models here.
class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ['course', 'subject', 'content', 'order', 'image', 'video', 'active']

class ImageVideoViewMixin(ModelAdmin):
    readonly_fields = ['image_view', 'video_view']

    @admin.display(description='Image')
    def small_image_view(self, course):
        if course.image:
            return mark_safe(f'<img src="{course.image.url}" width="120" style="object-fit: cover;" />')

    @admin.display(description='Image')
    def image_view(self, course):
        if course.image:
            return mark_safe(f'<img src="{course.image.url}" width="560" style="object-fit: cover;" />')
        
    @admin.display(description='Video')
    def video_view(self, course):
        if course.video:
            video_url = str(course.video)
            
            if "watch?v=" in video_url:
                video_url = video_url.replace("watch?v=", "embed/")
            elif "youtu.be/" in video_url:
                video_url = video_url.replace("youtu.be/", "www.youtube.com/embed/")

            video_url += "?end=120"
            return mark_safe(f'''
                            <iframe width="560" height="315"
                             src="{video_url}"
                             title="YouTube video player"
                             frameborder="0"
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                             referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                            </iframe>
                        ''')
        return ""
    
class LessonAdmin(ImageVideoViewMixin):
    form = LessonForm

    list_display = ('small_image_view','subject', 'course')
    search_fields = ('subject', 'course__subject')

    list_filter = ['course', 'active', 'created_date']

    list_per_page = 12

    fieldsets = (
        ('Thông tin bài học', {
            'fields': (('course', 'subject'), ('order', 'active'))
        }),
        ('Nội dung bài học', {
            'fields': ('content',)
        }),
        ('Media', {
            'fields': (('image', 'image_view'), ('video', 'video_view'))
        })
    )

class TagAdmin(ModelAdmin):
    list_display = ('name', 'active', 'created_date')
    search_fields = ('name',)

    list_per_page = 12

    list_editable = ('active',)
    list_filter = ['active']
