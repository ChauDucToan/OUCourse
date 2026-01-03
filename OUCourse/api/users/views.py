from django.shortcuts import render
from rest_framework import viewsets, generics, status, parsers, permissions
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

# Create your views here.
class UserView(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser]
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

        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)
    
    @action(methods=['post'], url_path='login', detail=False, \
            permission_classes=[permissions.AllowAny])
    def login(self, request):
        return Response({"detail": "Use OAuth2 to login"}, status=status.HTTP_200_OK)