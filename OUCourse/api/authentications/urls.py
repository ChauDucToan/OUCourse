from django.urls import path, include
from .views import AuthViewSet
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('', AuthViewSet, basename='authentication')
urlpatterns = [
    path('', include(r.urls)),
]