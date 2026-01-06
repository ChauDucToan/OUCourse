from rest_framework import viewsets, generics, permissions, status
from .. import perms
from django.contrib.contenttypes.models import ContentType
from ..comments.serializers import EmotionSerializer
from . import serializers, paginators, models
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class TagView(viewsets.ViewSet, generics.ListAPIView):
    queryset = models.Tag.objects.all()
    serializer_class = serializers.TagSerializer
    permission_classes = [permissions.IsAuthenticated]

class LessonView(viewsets.ViewSet, generics.RetrieveUpdateDestroyAPIView
                 , generics.CreateAPIView):
    pagination_class = paginators.LessonPaginator
    serializer_class = serializers.LessonDetailSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        return models.Lesson.objects.filter(course_id=course_id, active=True).order_by('order')

    def perform_create(self, serializer):
        course_id = self.request.query_params.get('course_id')
        course = models.Course.objects.get(pk=course_id)
        serializer.save(course=course)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsNotStudent()]
        return [permissions.IsAuthenticated()]
    
    @action(methods=['post'], url_path='react', detail=True, permission_classes=[permissions.IsAuthenticated])
    def react(self, request, pk):
        lesson = self.get_object()

        c_type = ContentType.objects.get_for_model(lesson)

        serializer = EmotionSerializer(data=request.data)
        if serializer.is_valid():
            emotion = serializer.save(
                user=request.user,
                content_type=c_type,
                object_id=lesson.id
            )
            return Response(EmotionSerializer(emotion).data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['delete'], url_path='unreact', detail=True, permission_classes=[permissions.IsAuthenticated])
    def unreact(self, request, pk):
        lesson = self.get_object()
        c_type = ContentType.objects.get_for_model(lesson)

        try:
            emotion = models.Emotion.objects.get(
                user=request.user,
                content_type=c_type,
                object_id=lesson.id
            )
            emotion.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except models.Emotion.DoesNotExist:
            return Response({"detail": "Reaction not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(methods=['get', 'patch'], url_path='progress', detail=True)
    def get_progress(self, request, pk):
        lesson = self.get_object()
        progress, created = models.LessonProgress.objects.get_or_create(
            student=request.user,
            lesson=lesson
        )
        if request.method.__eq__('PATCH'):
            s = serializers.ProgressLessonSerializer(progress, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            s.save()
            return Response(s.data, status=status.HTTP_200_OK)
        return Response(serializers.ProgressLessonSerializer(progress).data, status=status.HTTP_200_OK)
    
    @action(methods=['get'], url_path='tags', detail=True)
    def get_tags(self, request, pk):
        tags = self.get_object().tags.filter(active=True)
        return Response(serializers.TagSerializer(tags, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get', 'post'], url_path='comments', detail=True,
            pagination_class=paginators.CommentPaginator)
    def get_comments(self, request, pk):
        if request.method.__eq__('POST'):
            s = serializers.CommentSerializer(data={
                'user': request.user.pk,
                'lesson': pk,
                'content': request.data.get('content')
            })
            s.is_valid(raise_exception=True)
            c = s.save()

            return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

        comments = self.get_object().comment_set.select_related('user').filter(active=True)
        return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)