from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response
from rest_framework.decorators import action
from . import serializers, models, perms

# Create your views here.
class CommentView(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = models.Comment.objects.filter(active=True)
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.CommentOwner]

    @action(detail=True, methods=['post'], url_path='react', permission_classes=[IsAuthenticated],
            serializer_class=serializers.EmotionSerializer)
    def react(self, request, pk=None):
        comment = self.get_object() 
        
        c_type = ContentType.objects.get_for_model(comment)

        serializer = serializers.EmotionSerializer(data=request.data)
        if serializer.is_valid():
            emotion = serializer.save(
                user=request.user,
                content_type=c_type,
                object_id=comment.id
            )
            return Response(serializers.EmotionSerializer(emotion).data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='unreact', permission_classes=[IsAuthenticated],
            serializer_class=serializers.EmotionSerializer)
    def unreact(self, request, pk=None):
        comment = self.get_object()
        c_type = ContentType.objects.get_for_model(comment)

        try:
            emotion = models.Emotion.objects.get(
                user=request.user,
                content_type=c_type,
                object_id=comment.id
            )
            emotion.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except models.Emotion.DoesNotExist:
            return Response({"detail": "Reaction not found"}, status=status.HTTP_404_NOT_FOUND)