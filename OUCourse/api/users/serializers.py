from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar']


    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['avatar'] = instance.avatar.url
        return data
