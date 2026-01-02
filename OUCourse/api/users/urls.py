from django.urls import path, include
from api.users.views import UserView
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('', UserView, basename='user')

urlpatterns = [
    path('', include(r.urls)),
]