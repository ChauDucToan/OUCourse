from django.urls import path, include
from api.courses.views import CourseView
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('', CourseView, basename='course')
r.register('lessons', CourseView, basename='lesson')
urlpatterns = [
    path('', include(r.urls)),
]