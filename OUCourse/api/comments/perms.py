from rest_framework.permissions import IsAuthenticated

class CommentOwner(IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.user
    
class EmotionOwner(IsAuthenticated):
    def has_object_permission(self, request, view, emotion):
        return super().has_permission(request, view) and request.user == emotion.user