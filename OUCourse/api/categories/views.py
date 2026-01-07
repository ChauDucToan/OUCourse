from rest_framework import viewsets, permissions
from . import serializers, models
from .. import perms

# Create your views here.
class CategoryView(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer

    def get_permission_classes(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [perms.IsNotStudent]
        return [permission() for permission in permission_classes]