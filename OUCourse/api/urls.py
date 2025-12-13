from django.urls import path, include # Nhớ include

urlpatterns = [
    path('auth/', include('api.authentication.urls')),
    path('courses/', include('api.courses.urls')),
]