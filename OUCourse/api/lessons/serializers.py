from rest_framework import serializers
from .models import Lesson, Comment, Tag
from ..users.serializers import UserSerializer

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'video', 'image']
        extra_kwargs = {
            'image': {'required': False},
        }
    
class LessonDetailSerializer(LessonSerializer):
    tags = serializers.SerializerMethodField('get_tags')

    class Meta:
        model = LessonSerializer.Meta.model
        fields = LessonSerializer.Meta.fields + ['tags', 'content', 'order']

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]

class CommentSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['user'] = UserSerializer(instance.user).data

        return data

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'user', 'lesson']
        extra_kwargs = {
            'lesson': {
                'write_only': "True"
            }
        }