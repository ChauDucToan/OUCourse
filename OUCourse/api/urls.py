from django.urls import path, include # Nhớ include

urlpatterns = [
    path('users/', include('api.users.urls')),
    path('courses/', include('api.courses.urls')),
    path('lessons/', include('api.lessons.urls')),
    path('comments/', include('api.comments.urls')),
]