from rest_framework import serializers
from .models import AuthenticationModel
from ..users.models import User
from cloudinary.uploader import upload
import requests

class AuthenticationModelSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True) 
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    avatar = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    def create(self, validated_data):
        email = validated_data.get('email')
        name = validated_data.get('name', '')
        avatar_url = validated_data.get('avatar', '')
        provider = validated_data.get('provider')
        uid = validated_data.get('uid')
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                'email': email,
                'first_name': name,
            }
        )

        if created:
            if avatar_url:
                response = requests.get(avatar_url)
                if response.status_code == 200:
                        file_name = f"avatar_{user.id}.jpg"
                        upload_result = upload(response.content, public_id=file_name)
                        user.avatar = upload_result.get('public_id')
            user.set_unusable_password()
            user.save()

        auth_instance, created = AuthenticationModel.objects.update_or_create(
            provider=provider,
            uid=uid,
            defaults={
                'user': user,
                'access_token': validated_data.get('access_token'),
                'refresh_token': validated_data.get('refresh_token'),
                'expires_at': validated_data.get('expires_at')
            }
        )

        return auth_instance
        
    class Meta:
        model = AuthenticationModel
        fields = ['provider', 'uid', 'access_token', 'refresh_token', 
                  'expires_at', 'email', 'name', 'avatar']
        read_only_fields = ['id', 'user']

class SocialLoginInputSerializer(serializers.Serializer):
    auth_type = serializers.CharField(required=True, help_text="google, facebook, etc.")
    code = serializers.CharField(required=True, help_text="Auth code from provider")