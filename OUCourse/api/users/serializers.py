from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar']


    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['id'] = instance.id
        data['username'] = instance.username
        data['avatar'] = instance.avatar.url
        data['role'] = instance.role
        return data
