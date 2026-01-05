from rest_framework import serializers
from .models import Lesson, Tag, LessonProgress

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    video = serializers.FileField(required=False)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'video', 'image']
        extra_kwargs = {
            'image': {'required': False},
        }

    def create(self, validated_data):
        lesson = Lesson.objects.create(**validated_data)
        progress = LessonProgress.objects.create(
            student=self.context['request'].user,
            lesson=lesson
        )
        progress.save()
        return lesson
    
class LessonDetailSerializer(LessonSerializer):
    tags = serializers.SerializerMethodField('get_tags')

    class Meta:
        model = LessonSerializer.Meta.model
        fields = LessonSerializer.Meta.fields + ['tags', 'content', 'order']

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]
    
class ProgressLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'status', 'student', 'lesson']