from abc import ABC, abstractmethod
from typing import Dict
from datetime import datetime
import json
import google_auth_oauthlib.flow
import google.auth.transport.requests as requests
from google.oauth2.credentials import Credentials

class OAuthProvider(ABC):
    def __init__(self, credential_file: str):
        self.credential_file = credential_file
        self.credentials = None
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
            'expiry': expiry_val
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
    def __init__(self, credential_file: str):
        super().__init__(credential_file)
        self.scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]
        self.redirect_uri = 'http://localhost:8080/'
        self.flow = None
    
    def authenticate(self) -> str:
        self.flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
            self.credential_file, self.scopes)
        
        self.flow.redirect_uri = self.redirect_uri
        
        auth_url, _ = self.flow.authorization_url(prompt='consent', access_type='offline')
        return auth_url
    
    def fetch_token(self, callback_code: str) -> None:
        if not self.flow:
            self.authenticate()

        self.flow.fetch_token(code=callback_code)
        self.credentials = self.flow.credentials

    def refresh_token(self, token_info: Dict) -> None:
        if not token_info.get('refresh_token'):
            raise ValueError("Dictionary phải chứa 'refresh_token'")

        incoming_client_id = token_info.get('client_id')
        server_client_id = self.client_config.get('client_id')
        if server_client_id and server_client_id != incoming_client_id:
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
            creds.refresh(requests.Request())
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