from django.utils import timezone
from datetime import timedelta
from oauth2_provider.settings import oauth2_settings
from oauthlib.common import generate_token
from oauth2_provider.models import AccessToken, RefreshToken, Application

def create_oauth_token(user):
    try:
        application = Application.objects.get(name="mobile") 
    except Application.DoesNotExist:
        raise ValueError("Chưa cấu hình OAuth Application trong Admin")

    expires = timezone.now() + timedelta(seconds=oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS)
    access_token = AccessToken.objects.create(
        user=user,
        application=application,
        token=generate_token(),
        expires=expires,
        scope="read write"
    )

    refresh_token = RefreshToken.objects.create(
        user=user,
        application=application,
        token=generate_token(),
        access_token=access_token
    )

    return {
        'access_token': access_token.token,
        'refresh_token': refresh_token.token,
        'expires_in': oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS,
        'token_type': 'Bearer',
        'scope': access_token.scope
    }