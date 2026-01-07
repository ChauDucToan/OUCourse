from rest_framework import serializers
from .models import AuthenticationModel
from ..users.models import User
from cloudinary.uploader import upload
import requests

class AuthenticationModelSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True) 
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    avatar = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = AuthenticationModel
        fields = ['provider', 'uid', 'access_token', 'refresh_token', 
                  'expires_at', 'email', 'name', 'avatar']
        read_only_fields = ['id', 'user']
        
        validators = []
    
    def create(self, validated_data):
        email = validated_data.get('email')
        name = validated_data.get('name', '')
        raw_avatar = validated_data.get('avatar')
        avatar_url = raw_avatar if raw_avatar else 'https://res.cloudinary.com/dtcjixfyd/image/upload/v1765710152/no-profile-picture-15257_kw9uht.png'
        provider = validated_data.get('provider')
        uid = validated_data.get('uid')

        user = User.objects.filter(email=email).first()
        
        created = False
        if not user:
            created = True
            user = User.objects.create(
                username=email,
                email=email,
                first_name=name
            )
            user.set_unusable_password()
            user.save()

        if created:
            if avatar_url:
                response = requests.get(avatar_url)

                if response.status_code == 200:
                    avatar_url_ext = avatar_url.split('.')[-1]

                    if avatar_url_ext.lower()[:3] not in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']:
                        avatar_url_ext = 'png'
                    file_name = f"avatar_{user.id}.{avatar_url_ext}"
                    upload_result = upload(response.content, public_id=file_name)
                    user.avatar = upload_result.get('public_id')
                    user.save()

        defaults_data = {
            'user': user,
            'access_token': validated_data.get('access_token'),
            'expires_at': validated_data.get('expires_at')
        }
        
        if validated_data.get('refresh_token'):
            defaults_data['refresh_token'] = validated_data.get('refresh_token')

        auth_instance, created = AuthenticationModel.objects.update_or_create(
            provider=provider,
            uid=uid,
            defaults=defaults_data
        )

        return auth_instance

class SocialLoginInputSerializer(serializers.Serializer):
    auth_type = serializers.CharField(required=True, help_text="google, facebook, etc.")
    code = serializers.CharField(required=True, help_text="Auth code from provider")

    def validate_empty_values(self, data):
        if 'state' in data:
            auth_type = data.pop('state')
            data['auth_type'] = auth_type
        return super().validate_empty_values(data)