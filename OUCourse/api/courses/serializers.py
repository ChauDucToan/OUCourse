from rest_framework import serializers
from .models import Course, ManageCourse
    
class CourseSerializer(serializers.ModelSerializer):
    instructor = serializers.CharField(source='instructor.username', read_only=True)
    category = serializers.CharField(source='category.name')
    image = serializers.ImageField(required=False)
    video = serializers.FileField(required=False)

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be a non-negative value.")
        return value
    
    def validate_instructor(self, value):
        if getattr(value, "role", None) != 'INSTRUCTOR':
            raise serializers.ValidationError("Instructor must have the role of INSTRUCTOR.")
        return value
    
    class Meta:
        model = Course
        fields = ['id', 'instructor', 'subject', 'duration', 'image', 'video', 'price', 'category']
    
class CourseDetailSerializer(CourseSerializer):
    class Meta:
        model = CourseSerializer.Meta.model
        fields = CourseSerializer.Meta.fields + ['created_date', 'description']

class ManageCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageCourse
        fields = '__all__'