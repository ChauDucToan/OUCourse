from rest_framework import viewsets, permissions
from rest_framework.response import Response



class UserInfoAPI(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar': user.profile.avatar.url if hasattr(user, 'profile') else None
        })