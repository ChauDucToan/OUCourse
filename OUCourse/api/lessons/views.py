from rest_framework import viewsets, generics, permissions, status, parsers, serializers as drf_serializers
from .. import perms
from django.contrib.contenttypes.models import ContentType
from ..comments.serializers import EmotionSerializer, CommentSerializer
from ..comments.models import Emotion
from . import serializers, paginators, models
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.
class LessonView(viewsets.ViewSet, generics.RetrieveUpdateDestroyAPIView
                 , generics.CreateAPIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    pagination_class = paginators.LessonPaginator
    serializer_class = serializers.LessonDetailSerializer

    def get_queryset(self):
        queryset = models.Lesson.objects.filter(active=True).order_by('order')

        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsNotStudent()]
        return [permissions.IsAuthenticated()]
    
    @action(methods=['post'], url_path='react', detail=True, permission_classes=[permissions.IsAuthenticated],
            serializer_class=EmotionSerializer)
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
    
    @action(methods=['delete'], url_path='unreact', detail=True, permission_classes=[permissions.IsAuthenticated],
            serializer_class=EmotionSerializer)
    def unreact(self, request, pk):
        lesson = self.get_object()
        c_type = ContentType.objects.get_for_model(lesson)

        try:
            emotion = Emotion.objects.get(
                user=request.user,
                content_type=c_type,
                object_id=lesson.id
            )
            emotion.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Emotion.DoesNotExist:
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
        lesson = self.get_object()
        tags = lesson.tags.filter(active=True)
        return Response(serializers.TagSerializer(tags, many=True).data, status=status.HTTP_200_OK)
    
    @action(methods=['post', 'delete'], url_path='manage-tags', detail=True, permission_classes=[perms.IsNotStudent])
    def manage_tags(self, request, pk):
        lesson = self.get_object()
        tag_id = request.data.get('tag_id')
        try:
            tag = models.Tag.objects.get(pk=tag_id, active=True)
        except models.Tag.DoesNotExist:
            return Response({"detail": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method.__eq__('POST'):
            lesson.tags.add(tag)
            return Response({"detail": "Tag added"}, status=status.HTTP_200_OK)
        else:
            lesson.tags.remove(tag)
            return Response({"detail": "Tag removed"}, status=status.HTTP_200_OK)

    @action(methods=['get', 'post'], url_path='comments', detail=True,
            pagination_class=paginators.CommentPaginator, serializer_class=CommentSerializer)
    def get_comments(self, request, pk):
        if request.method.__eq__('POST'):
            s = CommentSerializer(data=request.data)
            s.is_valid(raise_exception=True)

            current_lesson = self.get_object()

            c = s.save(user=request.user, lesson=current_lesson)

            return Response(CommentSerializer(c).data, status=status.HTTP_201_CREATED)

        comments = self.get_object().comment_set.select_related('user').filter(active=True)

        page = self.paginate_queryset(comments)
        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
