from rest_framework import viewsets, generics, permissions, status
from . import serializers, paginators, models, perms
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.
class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class TagView(viewsets.ViewSet, generics.ListAPIView):
    queryset = models.Tag.objects.all()
    serializer_class = serializers.TagSerializer
    permission_classes = [permissions.IsAuthenticated]

class CourseView(viewsets.ModelViewSet):
    queryset = models.Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer
    pagination_class = paginators.CoursePaginator
    
    def get_permissions(self):
        if self.action == 'lessons' and self.request.method.__eq__('POST'):
            return [perms.IsNotStudent()]
        
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsNotStudent()]
        
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        query = self.queryset

        q = self.request.query_params.get('q')
        if q:
            query = query.filter(subject__icontains=q)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        return query
        
    @action(methods=['post', 'get'], url_path='lessons', detail=True)
    def lessons(self, request, pk=None):
        if request.method.__eq__('GET'):
            lessons = self.get_object().lesson_set.filter(active=True).order_by('order')
            return Response(serializers.LessonSerializer(lessons, many=True).data, status=status.HTTP_200_OK)
        elif request.method.__eq__('POST'):
            course = self.get_object()
            serializer = serializers.LessonSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(course=course)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='enroll', detail=True)
    def enroll(self, request):
        course = self.get_object()
        u = request.user

        manage_course, created = models.ManageCourse.objects.get_or_create(
            student=u,
            course=course,
            defaults={'status': models.ManageCourse.Status.ENROLLED}
        )

        if not created:
            return Response({'detail': 'Already enrolled.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializers.ManageCourseSerializer(manage_course).data, status=status.HTTP_201_CREATED)