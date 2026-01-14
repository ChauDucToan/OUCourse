from rest_framework.permissions import IsAuthenticated

class IsNotStudent(IsAuthenticated):
    def has_permission(self, request, view):
        is_auth = super().has_permission(request, view)
        if not is_auth:
            return False
        return getattr(request.user, "role", None) != request.user.Role.STUDENT
    
class IsAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        is_auth = super().has_permission(request, view)
        if not is_auth:
            return False
        return getattr(request.user, "role", None) == request.user.Role.ADMIN
    
class IsInstructor(IsAuthenticated):
    def has_permission(self, request, view):
        is_auth = super().has_permission(request, view)
        if not is_auth:
            return False
        return getattr(request.user, "role", None) == request.user.Role.INSTRUCTOR