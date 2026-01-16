from rest_framework import viewsets, permissions, status, parsers
from .. import perms
from . import serializers, paginators, models
from api.lessons.serializers import LessonSerializer
from django.contrib.auth import get_user_model
from api.lessons.models import LessonProgress
from django.db.models import Q, Count
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter

UserModel = get_user_model()

# Create your views here.
class CourseView(viewsets.ModelViewSet):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    queryset = models.Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer
    pagination_class = paginators.CoursePaginator

    filter_backends = [OrderingFilter]
    ordering_fields = ['price', 'created_date', 'updated_date']
    ordering = ['-updated_date']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsNotStudent()]
        
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return serializers.CourseDetailSerializer
        if self.action in ['enroll']:
            return serializers.ManageCourseSerializer
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

        if self.action == 'my_courses' and self.request.user.role == UserModel.Role.INSTRUCTOR:
            return models.Course.objects.filter(instructor=self.request.user, active=True)

        return query
    
    def perform_create(self, serializer, **kwargs):
        if self.action == 'create' and self.request.user.role == UserModel.Role.INSTRUCTOR:
            serializer.save(instructor=self.request.user)
    
    @action(methods=['get'], permission_classes=[permissions.IsAuthenticated],
            url_path='my-courses', detail=False)
    def my_courses(self, request):
        courses = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(courses)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=['get'], url_path='lessons', detail=True)
    def get_lessons(self, request, pk):
        lessons = self.get_object().lesson_set.filter(active=True)

        page = self.paginate_queryset(lessons)
        if page is not None:
            serializer = LessonSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        return Response(LessonSerializer(lessons, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='enroll',
             detail=True)
    def enroll(self, request, pk=None):
        course = self.get_object()
        student = request.user

        data = request.data.copy()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course, student=student)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(methods=['get'], permission_classes=[perms.IsInstructor], detail=True,
            url_path='stats', serializer_class=serializers.CourseStatsSerializer)
    def stats(self, request, pk=None):
        course = self.get_object()

        lessons = course.lesson_set.filter(active=True)

        total_students = models.ManageCourse.objects.filter(course=course).count()

        lesson_id = request.query_params.get('lesson_id')
        if lesson_id:
            lessons = lessons.filter(id=lesson_id)
        
        data = lessons.annotate(
            completed_count=Count(
                'progress', 
                filter=Q(progress__status=LessonProgress.Status.COMPLETED)
            )
        ).values('id', 'subject', 'completed_count').order_by('order')

        return Response({
            "total_students": total_students,
            "details": data
        }, status=status.HTTP_200_OK)
