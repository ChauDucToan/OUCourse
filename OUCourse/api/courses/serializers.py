from rest_framework import serializers
from .models import Course, Category, Lesson, Tag, ManageCourse

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
    
class CourseSerializer(serializers.ModelSerializer):
    instructor = serializers.CharField(source='instructor.username', read_only=True)
    category = serializers.CharField(source='category.name')
    
    class Meta:
        model = Course
        fields = ['id', 'instructor', 'subject', 'created_date', 'image', 'video', 'price', 'category']
    
class LessonSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField('get_tags')

    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'content', 'video', 'image', 'course', 'tags', 'order']
        extra_kwargs = {
            'course': {'read_only': True},
            'image': {'required': False},
        }

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]
    
class ManageCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageCourse
        fields = '__all__'
