from rest_framework import viewsets, generics, permissions, status
from .. import perms
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