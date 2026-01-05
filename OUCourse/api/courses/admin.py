from django.contrib import admin, messages
from .models import Course, Category
from django.utils.safestring import mark_safe
from django.contrib.auth import get_user_model

User = get_user_model()

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

# Register your models here.
class CourseAdmin(ImageVideoViewMixin):
    list_display = ('instructor', 'subject', 'price', 'category', 'active', 'created_date')
    search_fields = ('instructor', 'subject', 'price')

    list_filter = ['category']

    def save_model(self, request, obj, form, change):
        if form.cleaned_data.get('instructor'):
            if not User.objects.get(id=form.cleaned_data['instructor'].id).role.__eq__('INSTRUCTOR'):
                self.message_user(request, "Instructor must have the role of INSTRUCTOR.", level=messages.ERROR)
                return
            if form.cleaned_data.get('price') < 0:
                self.message_user(request, "Price must be a non-negative value.", level=messages.ERROR)
                return

            return super().save_model(request, obj, form, change)
        return

admin.site.register(Course, CourseAdmin)
