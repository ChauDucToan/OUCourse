from abc import ABC, abstractmethod
from typing import Dict
from datetime import datetime
import json
import google_auth_oauthlib.flow
import google.auth.transport.requests as google_requests
import requests
from google.oauth2.credentials import Credentials
import os
from django.conf import settings
from urllib.parse import urlencode
import time
import secrets
import hashlib
import base64

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

class OAuthProvider(ABC):
    def __init__(self, credential_file: str, request=None):
        self.credential_file = credential_file
        self.credentials = None
        self.request = request
        self.client_config = self._load_client_config()

    def _load_client_config(self) -> Dict:
        try:
            with open(self.credential_file, 'r') as f:
                data = json.load(f)
                return data.get('installed') or data.get('web') or data
        except Exception:
            return {}

    @abstractmethod
    def authenticate(self) -> str:
        """Trả về URL để user login hoặc thực hiện luồng auth"""
        pass

    @abstractmethod
    def fetch_token(self, callback_code: str) -> None:
        """Đổi code lấy token"""
        pass

    @abstractmethod
    def refresh_token(self, token_info: Dict) -> None:
        """Làm mới token khi hết hạn"""
        pass
    
    def get_user_response(self) -> Dict:
        if not self.credentials:
            raise ValueError("Credentials have not been created yet.")
        
        expiry_val = self.credentials.expiry
        if isinstance(expiry_val, datetime):
            expiry_val = expiry_val.isoformat()

        return {
            'token': self.credentials.token,
            'refresh_token': self.credentials.refresh_token,
            'client_id': self.credentials.client_id,
            'token_uri': self.credentials.token_uri,
            'expiry': expiry_val,
            'auth_type': 'generic_oauth'
        }
    
    @abstractmethod
    def get_user_info(self) -> Dict:
        """
        Trả về dictionary chuẩn hóa:
        {
            'uid': str,      # ID duy nhất bên provider
            'email': str,    # Email
            'name': str,     # Tên hiển thị
            'avatar': str    # Link ảnh
        }
        """
        pass

class GoogleOAuthProvider(OAuthProvider):
    def __init__(self, credential_file: str, scopes=None, request=None):
        super().__init__(credential_file, request=request)

        default_scopes = [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/youtube.upload",
            "https://www.googleapis.com/auth/youtube.force-ssl"
        ]

        self.scopes = scopes or default_scopes
        self.redirect_uri = self.client_config.get('redirect_uris', [None])[0]
        self.flow = None

    def _create_flow(self):
        return google_auth_oauthlib.flow.Flow.from_client_secrets_file(
            self.credential_file,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri
        )
    
    def authenticate(self) -> str:
        self.flow = self._create_flow()
        
        auth_url, _ = self.flow.authorization_url(prompt='consent', access_type='offline', state='google')
        return auth_url
    
    def fetch_token(self, callback_code: str) -> None:
        if not self.flow:
            self.flow = self._create_flow()
        
        try:
            self.flow.fetch_token(code=callback_code)
            self.credentials = self.flow.credentials
        except Exception as e:
            raise ValueError(f"Lỗi khi đổi code lấy token: {str(e)}")

    def refresh_token(self, token_info: Dict) -> None:
        if not token_info.get('refresh_token'):
            raise ValueError("Dictionary phải chứa 'refresh_token'")

        incoming_client_id = token_info.get('client_id')
        server_client_id = self.client_config.get('client_id')
        if incoming_client_id and server_client_id and server_client_id != incoming_client_id:
            raise ValueError("client_id không khớp giữa token và credential file")
        
        info = {
            'token': token_info.get('token'),
            'refresh_token': token_info.get('refresh_token'),
            'token_uri': token_info.get('token_uri', "https://oauth2.googleapis.com/token"),
            'client_id': self.client_config.get('client_id'),
            'client_secret': self.client_config.get('client_secret'),
            'scopes': self.scopes
        }

        try:
            creds = Credentials.from_authorized_user_info(info, self.scopes)
            creds.refresh(google_requests.Request())
            self.credentials = creds
        except Exception as e:
            raise ValueError(f"Không thể refresh token: {str(e)}")
        
    def get_user_info(self) -> Dict:
        if not self.credentials or not self.credentials.token:
            raise ValueError("Token chưa có, không thể lấy info.")

        url = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {'Authorization': f'Bearer {self.credentials.token}'}
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            return {
                'uid': data.get('sub'),
                'email': data.get('email'),
                'name': data.get('name'),
                'avatar': data.get('picture')
            }
        except Exception as e:
            raise ValueError(f"Lỗi lấy thông tin user Google: {e}")
        
    def get_user_response(self):
        response = super().get_user_response()
        response['auth_type'] = 'google'
        return response
    
class GenericCredentials:
    def __init__(self, token, refresh_token=None, token_uri=None, client_id=None, client_secret=None, expiry=None):
        self.token = token
        self.refresh_token = refresh_token
        self.token_uri = token_uri
        self.client_id = client_id
        self.client_secret = client_secret
        self.expiry = expiry
    
class DjangoOAuthProvider(OAuthProvider):
    def __init__(self, credential_file: str, scopes=None, request=None):
        super().__init__(credential_file, request=request)
        self.scopes = scopes or ["read", "write"]
        self.redirect_uri = self.client_config.get('redirect_uri')

    def _create_pkce_challenge(self):
        code_verifier = secrets.token_urlsafe(64)
        code_challenge = hashlib.sha256(code_verifier.encode('ascii')).digest()
        code_challenge_b64 = base64.urlsafe_b64encode(code_challenge).decode('ascii').rstrip('=')
        return code_verifier, code_challenge_b64

    def authenticate(self) -> str:
        base_url = self.client_config.get('auth_uri')
        verifier, challenge = self._create_pkce_challenge()

        if self.request:
            self.request.session['pkce_verifier'] = verifier
            self.request.session.modified = True

        params = {
            "client_id": self.client_config.get('client_id'),
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "scope": " ".join(self.scopes),
            "state": "django",
            "code_challenge": challenge,
            "code_challenge_method": "S256"
        }

        auth_url = f"{base_url}?{urlencode(params)}"
        return auth_url

    def fetch_token(self, callback_code: str) -> None:
        token_url = self.client_config.get('token_uri')

        code_verifier = None
        if self.request:
            code_verifier = self.request.session.get('pkce_verifier')

        data = {
            "grant_type": "authorization_code",
            "code": callback_code,
            "redirect_uri": self.redirect_uri,
            "client_id": self.client_config.get('client_id'),
            "client_secret": self.client_config.get('client_secret'),
            "code_verifier": code_verifier
        }
        
        try:
            response = requests.post(token_url, data=data)
            response.raise_for_status()
            token_data = response.json()
            
            expiry = None
            if 'expires_in' in token_data:
                expiry = datetime.fromtimestamp(time.time() + token_data['expires_in'])

            self.credentials = GenericCredentials(
                token=token_data.get('access_token'),
                refresh_token=token_data.get('refresh_token'),
                token_uri=token_url,
                client_id=self.client_config.get('client_id'),
                client_secret=self.client_config.get('client_secret'),
                expiry=expiry
            )

            if self.request and 'pkce_verifier' in self.request.session:
                del self.request.session['pkce_verifier']
            
        except Exception as e:
            raise ValueError(f"Lỗi khi đổi code lấy token DOT: {str(e)}")

    def refresh_token(self, token_info: Dict) -> None:
        token_url = self.client_config.get('token_uri')
        data = {
            "grant_type": "refresh_token",
            "refresh_token": token_info.get('refresh_token'),
            "client_id": self.client_config.get('client_id'),
            "client_secret": self.client_config.get('client_secret'),
        }

        try:
            response = requests.post(token_url, data=data)
            response.raise_for_status()
            token_data = response.json()
            
            self.credentials.token = token_data.get('access_token')
            if token_data.get('refresh_token'):
                self.credentials.refresh_token = token_data.get('refresh_token')
                
        except Exception as e:
            raise ValueError(f"Không thể refresh token DOT: {str(e)}")
    
    def get_user_info(self) -> Dict:
        if not self.credentials or not self.credentials.token:
            raise ValueError("Token chưa có.")

        user_info_url = self.client_config.get('user_info_uri')
        headers = {'Authorization': f'Bearer {self.credentials.token}'}

        try:
            response = requests.get(user_info_url, headers=headers)
            response.raise_for_status()
            data = response.json()

            return {
                'uid': str(data.get('id')),
                'email': data.get('email'),
                'name': f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or data.get('username'),
                'avatar': data.get('profile_pic') or data.get('avatar')
            }
        except Exception as e:
            raise ValueError(f"Lỗi lấy thông tin user DOT: {e}")
    
    def get_user_response(self) -> Dict:
        response = super().get_user_response()
        response['auth_type'] = 'django'
        return response

class OAuthFactory:
    @staticmethod
    def get_provider(auth_type: str, scopes=None, request=None) -> OAuthProvider:
        provider_type = auth_type.lower().strip()
        
        if provider_type == 'google':
            return GoogleOAuthProvider(os.path.join(settings.BASE_DIR, 'services' ,'secret', 'google.json'), scopes=scopes, request=request)        
        elif provider_type == 'django':
            return DjangoOAuthProvider(os.path.join(settings.BASE_DIR, 'services' ,'secret', 'django.json'), scopes=scopes, request=request)
        else:
            raise ValueError(f"Hệ thống chưa hỗ trợ provider: {auth_type}")