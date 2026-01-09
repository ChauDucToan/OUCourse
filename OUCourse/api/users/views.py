from rest_framework import viewsets, generics, status, parsers, permissions
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncMonth, TruncQuarter, TruncYear
from django.db.models import Sum, Count
from api import perms

from api.payments.models import TransactionDetail, Transaction

# Create your views here.
class UserView(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    @action(methods=['get', 'patch'], url_path='current-user', \
            detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        u = request.user
        if request.method.__eq__('PATCH'):
            serializer = UserSerializer(u, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class StatisticUserView(viewsets.ViewSet):
    permission_classes = [perms.IsNotStudent]

    @action(methods=['get'], url_path='revenue', detail=False)
    def get_revenue(self, request):
        user = request.user

        from_date_str = request.query_params.get('from_date', None)
        to_date_str = request.query_params.get('to_date', None)

        course_id = request.query_params.get('course_id', None)
        group_by = request.query_params.get('group_by', 'month')

        base_query = TransactionDetail.objects.filter(
            transaction__status=Transaction.statuses.COMPLETED
        )

        if user.role == User.Role.INSTRUCTOR:
            base_query = base_query.filter(courses__instructor=user)
        elif user.role == User.Role.ADMIN:
            pass
        else:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        if course_id:
            base_query = base_query.filter(courses__id=course_id)

        if from_date_str:
            d = parse_date(from_date_str)
            if d:
                base_query = base_query.filter(transaction__created_date__date__gte=d)
        
        if to_date_str:
            d = parse_date(to_date_str)
            if d:
                base_query = base_query.filter(transaction__created_date__date__lte=d)

        summary_stats = base_query.aggregate(
            total_revenue=Sum('price_at_purchase'),
            total_students=Count('transaction__user', distinct=True)
        )

        if group_by == 'year':
            trunc_func = TruncYear('transaction__created_date')
        elif group_by == 'quarter':
            trunc_func = TruncQuarter('transaction__created_date')
        else: # Default month
            trunc_func = TruncMonth('transaction__created_date')

        chart_data = (
            base_query
            .annotate(period=trunc_func)
            .values('period')
            .annotate(
                revenue=Sum('price_at_purchase'),
                students=Count('transaction__user', distinct=True)
            )
            .order_by('period')
        )

        formatted_chart_data = []
        for item in chart_data:
            formatted_chart_data.append({
                "period": item['period'].strftime('%Y-%m-%d'),
                "revenue": item['revenue'] or 0,
                "students": item['students'] or 0
            })

        return Response({
            "filter": {
                "course_id": course_id,
                "from_date": from_date_str,
                "to_date": to_date_str,
                "group_by": group_by
            },
            "summary": {
                "total_revenue": summary_stats['total_revenue'] or 0,
                "total_students": summary_stats['total_students'] or 0
            },
            "chart_data": formatted_chart_data
        })

