from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentView

r = DefaultRouter()
r.register('', CommentView, basename='comment')
urlpatterns = [
    path('', include(r.urls)),
]