from rest_framework import serializers
from .models import Course, Category, Lesson, Tag

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ImageSerializer(serializers.Serializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data
    
class CourseSerializer(ImageSerializer):
    class Meta:
        model = Course
        fields = ['id', 'instructor', 'subject', 'created_date', 'image', 'video', 'price', 'category']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['id'] = instance.id
        data['instructor'] = instance.instructor.username
        data['subject'] = instance.subject
        data['video'] = instance.video if instance.video else ''
        data['created_date'] = instance.created_date
        data['price'] = str(instance.price)
        data['category'] = instance.category.name
        return data