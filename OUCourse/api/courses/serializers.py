from rest_framework import serializers
from .models import Course, ManageCourse
import services.upload.services as upload_services
    
class CourseSerializer(serializers.ModelSerializer):
    instructor = serializers.CharField(source='instructor.username', read_only=True)
    category = serializers.CharField(source='category.name')
    image = serializers.ImageField(required=False)
    video = serializers.FileField(required=False, write_only=True)
    video_url = serializers.URLField(source='video', read_only=True)

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be a non-negative value.")
        return value
    
    def validate_instructor(self, value):
        if getattr(value, "role", None) != 'INSTRUCTOR':
            raise serializers.ValidationError("Instructor must have the role of INSTRUCTOR.")
        return value
    
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


        course = Course.objects.create(**validated_data)
        
        return course
    
    class Meta:
        model = Course
        fields = ['id', 'instructor', 'subject', 'duration', 'image',
                   'video', 'video_url', 'price', 'category']
    
class CourseDetailSerializer(CourseSerializer):
    class Meta:
        model = CourseSerializer.Meta.model
        fields = CourseSerializer.Meta.fields + ['created_date', 'description']

class ManageCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageCourse
        fields = '__all__'
