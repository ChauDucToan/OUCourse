from django.urls import path, include # Nhớ include
from api import views

urlpatterns = [
    path('users/', include('api.users.urls')),
    path('courses/', include('api.courses.urls')),
    path('lessons/', include('api.lessons.urls')),
    path('comments/', include('api.comments.urls')),
    path('categories/', include('api.categories.urls')),
    path('auth/', include('api.authentications.urls')),
    path('user-info/', views.UserInfoAPI.as_view({'get': 'list'})),
    path('payments/', include('api.payments.urls')),
]