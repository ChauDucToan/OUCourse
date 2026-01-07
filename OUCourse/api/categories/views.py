from rest_framework import viewsets
from . import serializers, models
from .. import perms

# Create your views here.
class CategoryView(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [perms.IsNotStudent]