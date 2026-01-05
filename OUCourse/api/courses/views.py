from rest_framework import viewsets, permissions, status, parsers
from .. import perms
from . import serializers, paginators, models
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response

UserModel = get_user_model()

# Create your views here.
class CourseView(viewsets.ModelViewSet):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    queryset = models.Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer
    pagination_class = paginators.CoursePaginator
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsNotStudent()]
        
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return serializers.CourseDetailSerializer
        return self.serializer_class

    def get_queryset(self):
        query = self.queryset

        q = self.request.query_params.get('q')
        if q:
            query = query.filter(subject__icontains=q)

        instructor_name = self.request.query_params.get('instructor')
        if instructor_name:
            query = query.filter(
                Q(instructor__username__icontains=instructor_name) |
                Q(instructor__first_name__icontains=instructor_name) |
                Q(instructor__last_name__icontains=instructor_name),
                instructor__role=UserModel.Role.INSTRUCTOR
        )
            
        price_min = self.request.query_params.get('price_min')
        if price_min:
            query = query.filter(price__gte=price_min)
        
        price_max = self.request.query_params.get('price_max')
        if price_max:
            query = query.filter(price__lte=price_max)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        status = self.request.query_params.get('status')
        if status and self.request.user.is_authenticated:
            manage_courses = models.ManageCourse.objects.filter(
                student=self.request.user,
                status=status
            ).values_list('course_id', flat=True)
            query = query.filter(id__in=manage_courses)

        return query
    
    @action(methods=['get'], url_path='lessons', detail=True)
    def get_lessons(self, request, pk):
        lessons = self.get_object().lesson_set.filter(active=True)

        return Response(serializers.LessonSerializer(lessons, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='enroll',
             detail=True)
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

        manage_course.save()
        return Response(serializers.ManageCourseSerializer(manage_course).data, status=status.HTTP_201_CREATED)