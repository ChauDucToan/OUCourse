from time import timezone
from rest_framework import serializers
from .models import AuthenticationModel
from cloudinary.uploader import upload
import requests
import hmac
import hashlib
import os
from oauth2_provider.models import AccessToken, RefreshToken
from api.users.models import User
from oauth2_provider.settings import oauth2_settings

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
                    file_name = f"avatar_{user.id}"
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
    
class TokenSenderSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    client_id = serializers.CharField(required=True)
    mac = serializers.CharField(required=True)

    def _get_mac(self, data, key):
        mac = hmac.new(
            key.encode("utf-8"),
            data.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        return mac

    def validate(self, attrs):
        username = attrs.get('username')
        client_id = attrs.get('client_id')
        received_mac = attrs.get('mac')

        internal_client_id = os.getenv("CLIENT_ID")

        data = f"{username}|{client_id}"
        expected_mac = self._get_mac(data, internal_client_id)
        if client_id != internal_client_id:
            raise serializers.ValidationError("Invalid client ID.")
        
        if not hmac.compare_digest(received_mac, expected_mac):
            raise serializers.ValidationError("Invalid MAC signature.")
        
        try:
            user = User.objects.get(username=username)
            attrs['user'] = user
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "User not found."})

        return attrs

    def get_token(self):
        username = self.validated_data.get('username')
        user = User.objects.get(username=username)

        access_token = AccessToken.objects.filter(
            user=user,
            expires__gt=timezone.now()
        ).order_by('-expires').first()

        refresh_token = RefreshToken.objects.filter(
            user=user,
            access_token=access_token,
        ).first()

        return {
            'status': 'success',
            'user': {
                "id": user.id,
                "email": user.email,
                "name": user.first_name,
                "avatar": user.profile.avatar if hasattr(user, 'profile') else ""
            },
            'tokens': {
                'access_token': access_token.token,
                'refresh_token': refresh_token.token,
                'expires_in': oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS,
                'token_type': 'Bearer',
                'scope': access_token.scope
            }
        }
