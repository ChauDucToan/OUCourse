from rest_framework import serializers
from .models import Course, Category, ManageCourse

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
    
class CourseSerializer(serializers.ModelSerializer):
    instructor = serializers.CharField(source='instructor.username', read_only=True)
    category = serializers.CharField(source='category.name')
    image = serializers.ImageField(required=False)
    video = serializers.FileField(required=False)
    
    class Meta:
        model = Course
        fields = ['id', 'instructor', 'subject', 'created_date', 'image', 'video', 'price', 'category']
    
class ManageCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageCourse
        fields = '__all__'