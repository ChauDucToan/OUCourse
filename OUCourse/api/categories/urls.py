from django.urls import path, include
from .views import CategoryView
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('', CategoryView, basename='category')
urlpatterns = [
    path('', include(r.urls)),
]