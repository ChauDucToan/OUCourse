from rest_framework import serializers
from .models import Course, ManageCourse
import services.upload.services as upload_services
    
class CourseSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    video = serializers.FileField(required=False, write_only=True)
    video_url = serializers.URLField(source='video', read_only=True)

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be a non-negative value.")
        return value
    
    def create(self, validated_data):
        video_file = validated_data.pop('video', None)
        description = validated_data.get('description', '')

        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['instructor'] = request.user

        youtube_url = None
        if video_file:
            try:
                youtube_url = upload_services.upload_video_to_youtube(
                    video_file_obj=video_file,
                    title=validated_data.get('subject', 'Untitled Lesson'),
                    description=description,
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
        fields = ['id', 'subject', 'duration', 'image', 'description',
                   'video', 'video_url', 'price', 'category']
    
class CourseDetailSerializer(CourseSerializer):
    class Meta:
        model = CourseSerializer.Meta.model
        fields = CourseSerializer.Meta.fields + ['created_date', 'description']

class ManageCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageCourse
        fields = ['id', 'status']

    def create(self, validated_data):
        course = validated_data.get('course')
        student = validated_data.get('student')
        status = validated_data.get('status', ManageCourse.Status.UNENROLLED)

        if ManageCourse.objects.filter(course=course, student=student).exists():
            raise serializers.ValidationError("The student is already enrolled in this course.")

        manage_course = ManageCourse.objects.create(
            course=course,
            student=student,
            status=status
        )
        return manage_course
    
class LessonStatsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    subject = serializers.CharField()
    completed_count = serializers.IntegerField()

    class Meta:
        model = Course
        fields = ['id', 'subject', 'completed_count']
    
class CourseStatsSerializer(serializers.ModelSerializer):
    total_students = serializers.IntegerField()
    details = LessonStatsSerializer(many=True)

    class Meta:
        model = Course
        fields = ['total_students', 'details']