from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonView

r = DefaultRouter()
r.register('', LessonView, basename='lesson')
urlpatterns = [
    path('', include(r.urls)),
]