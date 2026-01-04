from rest_framework import viewsets, generics
from . import serializers, models, perms

# Create your views here.
class CommentView(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = models.Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.CommentOwner]