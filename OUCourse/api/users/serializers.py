from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'role', 'avatar', 'password']
        read_only_fields = ['username', 'role']

        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar'] = instance.avatar.url if instance.avatar else ''
        data['role'] = instance.role
        return data
    
    def validate_password(self, password):
        validate_password(password)
        return password

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)

        if password:
            instance.set_password(password)
            instance.save()

        return instance
    

class UserCreateSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'role', 'avatar', 'password']
        ref_name = None # Only show UserSerializer in docs

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        if instance.role:
            data['role'] = instance.role
        return data

    def validate_password(self, password):
        validate_password(password)
        return password

    def create(self, validated_data):
        user = self.Meta.model(**validated_data)
        user.set_password(user.password)

        if user.role == User.Role.INSTRUCTOR:
            user.is_active = False

        user.save()
        return user
    
class ChatRoomSerializer(serializers.Serializer):
    target_username = serializers.CharField()
    
    class Meta:
        models = User
        fields = ['target_username']