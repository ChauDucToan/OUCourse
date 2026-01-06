from rest_framework import serializers
from .models import Lesson, Tag, LessonProgress
import services.upload.services as upload_services

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    video = serializers.FileField(required=False, write_only=True)
    video_url = serializers.URLField(source='video', read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'video', 'video_url', 'image']
        extra_kwargs = {
            'image': {'required': False},
        }

    def create(self, validated_data):
        video_file = validated_data.pop('video', None)
        user = self.context['request'].user
        content = validated_data.get('content', '')

        youtube_url = None
        if video_file:
            try:
                youtube_url = upload_services.upload_video_to_youtube(
                    video_file_obj=video_file,
                    title=validated_data.get('subject', 'Untitled Lesson'),
                    description=content,
                    tags=["OUCourse Lesson"]
                )
            except Exception as e:
                raise serializers.ValidationError({"video": f"YouTube upload failed: {str(e)}"})

        if youtube_url:
            validated_data['video'] = youtube_url


        lesson = Lesson.objects.create(**validated_data)
        progress = LessonProgress.objects.create(
            student=user,
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