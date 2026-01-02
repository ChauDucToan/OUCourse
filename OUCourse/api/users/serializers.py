from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar', 'password']
        read_only_fields = ['id', 'username', 'role']


    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['id'] = instance.id
        data['username'] = instance.username
        data['avatar'] = instance.avatar.url
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