from django.contrib import admin
from .models import Tag, Lesson
from django.utils.safestring import mark_safe

# Register your models here.
class ImageVideoViewMixin(admin.ModelAdmin):
    readonly_fields = ['image_view', 'video_view']

    def image_view(self, course):
        if course.image:
            return mark_safe(f'<img src="{course.image.url}" width="200" />')
        
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
    list_display = ('subject', 'course', 'order', 'active', 'video', 'created_date')
    search_fields = ('subject', 'course__subject')

    list_filter = ['course']

class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'active', 'created_date')
    search_fields = ('name',)

admin.site.register(Tag, TagAdmin)
admin.site.register(Lesson, LessonAdmin)