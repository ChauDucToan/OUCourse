from rest_framework import viewsets, generics, status, parsers, permissions
from .models import User, FireBaseUser
from .serializers import UserSerializer, UserCreateSerializer, ChatRoomSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncMonth, TruncQuarter, TruncYear
from django.db.models import Sum, Count
from api import perms
from firebase_admin.auth import UidAlreadyExistsError, EmailAlreadyExistsError
from firebase_admin import auth, db

from api.payments.models import TransactionDetail, Transaction

# Create your views here.
class UserView(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action == 'create_chat_room':
            return ChatRoomSerializer
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
        else:
            serializer = UserSerializer(u)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def _get_or_create_firebase_mapping(self, user):
        fb_user_local = FireBaseUser.objects.filter(user=user).first()
        
        if fb_user_local:
            return fb_user_local

        firebase_uid = str(user.id)
        
        try:
            auth.create_user(
                uid=firebase_uid,
                email=user.email,
                display_name=user.username,
                disabled=False
            )
        except (UidAlreadyExistsError, EmailAlreadyExistsError):
            pass
        except Exception as e:
            raise e

        fb_user_local, created = FireBaseUser.objects.get_or_create(
            user=user,
            defaults={'firebase_uid': firebase_uid}
        )
        
        return fb_user_local
    
    @action(methods=['get'], url_path='firebase-token', \
            detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_firebase_uid(self, request):
        user = request.user
        try:
            fb_user_local = self._get_or_create_firebase_mapping(user)
            custom_token = auth.create_custom_token(str(user.id)).decode('utf-8')
            return Response({
                "firebase_uid": fb_user_local.firebase_uid,
                "firebase_token": custom_token
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Error linking Firebase: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
    
    @action(methods=['post'], url_path='chat-room', \
            detail=False, permission_classes=[permissions.IsAuthenticated])
    def create_chat_room(self, request):
        current_user = request.user
        target_username = request.data.get('target_username', None)

        if not target_username:
            return Response({"detail": "target_username is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(username=target_username, is_active=True)
        except User.DoesNotExist:
            return Response({"detail": "Target user not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            current_user_firebase = self._get_or_create_firebase_mapping(current_user)
            target_user_firebase = self._get_or_create_firebase_mapping(target_user)
        except Exception as e:
            return Response({"detail": f"Error linking Firebase: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
        
        room_id = f"room_{min(current_user_firebase.firebase_uid, target_user_firebase.firebase_uid)}_{max(current_user_firebase.firebase_uid, target_user_firebase.firebase_uid)}"
        
        updates = {}
        current_uid = current_user_firebase.firebase_uid
        target_uid = target_user_firebase.firebase_uid
        
        updates[f'chats/{room_id}/members/{current_uid}'] = True
        updates[f'chats/{room_id}/members/{target_uid}'] = True

        server_timestamp = {'.sv': 'timestamp'}

        updates[f'user_chats/{current_uid}/{room_id}/partner_id'] = target_uid
        updates[f'user_chats/{current_uid}/{room_id}/timestamp'] = server_timestamp
        
        updates[f'user_chats/{target_uid}/{room_id}/partner_id'] = current_uid
        updates[f'user_chats/{target_uid}/{room_id}/timestamp'] = server_timestamp
        
        db.reference().update(updates)

        return Response({
            "room_id": room_id, 
            "members": [current_user.username, target_user.username]
            },status=status.HTTP_200_OK
        )

class StatisticUserView(viewsets.ViewSet):
    permission_classes = [perms.IsNotStudent]

    @action(methods=['get'], url_path='revenue', detail=False)
    def get_revenue(self, request):
        user = request.user

        from_date_str = request.query_params.get('from_date', None)
        to_date_str = request.query_params.get('to_date', None)

        course_id = request.query_params.get('course_id', None)
        group_by = request.query_params.get('group_by', 'month')

        base_query = TransactionDetail.objects.select_related(
            'transaction', 'transaction__user', 'course'
        ).filter(
            transaction__status=Transaction.statuses.COMPLETED
        )

        if user.role == User.Role.INSTRUCTOR:
            base_query = base_query.filter(course__instructor=user)
        elif user.role == User.Role.ADMIN:
            pass
        else:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        if course_id:
            base_query = base_query.filter(course__id=course_id)

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
            .values(
                'period',
                'price_at_purchase',
                'transaction__user__id',
                'transaction__user__username',
                'transaction__user__email'
            )
            .order_by('period')
        )

        grouped_results = {}
        for item in chart_data:
            period = item['period'].strftime('%Y-%m-%d')

            if period not in grouped_results:
                grouped_results[period] = {
                    'period': period,
                    'revenue': 0,
                    'students': {}
                }
            grouped_results[period]['revenue'] += item['price_at_purchase']
            
            user_id = item['transaction__user__id']
            if user_id not in grouped_results[period]['students']:
                grouped_results[period]['students'][user_id] = {
                    'id': user_id,
                    'username': item['transaction__user__username'],
                    'email': item['transaction__user__email']
                }

        formatted_chart_data = []
        for data in grouped_results.values():
            student_list = list(data['students'].values())

            formatted_chart_data.append({
                'period': data['period'],
                'revenue': data['revenue'],
                'student_count': len(student_list),
                'students': student_list
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

