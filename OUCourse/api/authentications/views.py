from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, authentication_classes,permission_classes
from rest_framework.response import Response

from .serializers import AuthenticationModelSerializer, SocialLoginInputSerializer, TokenSenderSerializer, TokenCreatorSerializer
from .models import AuthenticationModel
from services.OAuth.OAuthProviders import OAuthFactory
from .utils import create_oauth_token

class AuthViewSet(viewsets.GenericViewSet):
    queryset = AuthenticationModel.objects.all()
    serializer_class = AuthenticationModelSerializer

    @action(detail=False, methods=['post'], url_path='send-token', serializer_class=TokenCreatorSerializer)
    def send_token(self, request):
        serializer = TokenCreatorSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        res = serializer.send_token()

        return Response(
            res,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path='get-token', serializer_class=TokenSenderSerializer)
    def get_token(self, request):
        print(request.data)
        serializer = TokenSenderSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        result = serializer.get_token_response()

        if result is None:
            return Response(
                {"error": "No valid token found for this user"}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='url')
    @authentication_classes([])
    @permission_classes([permissions.AllowAny])
    def get_oauth_url(self, request):
        auth_type = request.query_params.get('auth_type')
        if not auth_type:
            return Response({"error": "auth_type là bắt buộc"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            provider = OAuthFactory.get_provider(auth_type, request=request)
            auth_url = provider.authenticate()
            return Response({"auth_url": auth_url}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Lỗi hệ thống", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='callback', serializer_class=SocialLoginInputSerializer)
    def callback(self, request):
        data = request.query_params.dict()

        input_serializer = SocialLoginInputSerializer(data=data)
        input_serializer.is_valid(raise_exception=True)
        
        auth_type = input_serializer.validated_data['auth_type']
        code = input_serializer.validated_data['code']

        try:
            verifier = request.data.get('code_verifier')
            provider = OAuthFactory.get_provider(auth_type, request=request)
            provider.fetch_token(code, code_verifier=verifier)

            user_info = provider.get_user_info()
            token_data = provider.get_user_response()
            
            save_data = {
                'provider': auth_type,
                'uid': user_info['uid'],
                'email': user_info['email'],
                'name': user_info['name'],
                'avatar': user_info['avatar'],
                'access_token': token_data['token'],
                'refresh_token': token_data.get('refresh_token'),
                'expires_at': token_data.get('expiry')
            }
            
            db_serializer = AuthenticationModelSerializer(data=save_data)
            db_serializer.is_valid(raise_exception=True)

            auth_instance = db_serializer.save()
            oauth_token = create_oauth_token(auth_instance.user)

            return Response({
                "status": "success",
                "user": {
                    "id": auth_instance.user.id,
                    "email": auth_instance.user.email,
                    "name": auth_instance.user.first_name,
                    "avatar": auth_instance.user.profile.avatar if hasattr(auth_instance.user, 'profile') else ""
                },
                "tokens": oauth_token
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "System error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)