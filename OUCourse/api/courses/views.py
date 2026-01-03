from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from .models import Category
from . import serializers

# Create your views here.
class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class TagView(viewsets.ViewSet, generics.ListAPIView):
    queryset = serializers.Tag.objects.all()
    serializer_class = serializers.TagSerializer
    permission_classes = [permissions.IsAuthenticated]

class CourseView(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = serializers.Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset()