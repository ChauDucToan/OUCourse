from abc import ABC, abstractmethod
import os
from typing import Dict, Optional
import json
import google_auth_oauthlib.flow
import google.auth.transport.requests as requests

class OAuthProvider(ABC):
    def __init__(self, credential_file: str):
        self.credential_file = credential_file
        self.token: Optional[Dict] = None
        self.credentials = self._read_credentials()

    def _read_credentials(self) -> Dict:
        try:
            with open(self.credential_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: File {self.credential_file} not found.")
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
    def refresh_token(self) -> None:
        """Làm mới token khi hết hạn"""
        pass

    def get_token(self) -> Dict:
        if not self.token:
            raise ValueError("Token has not been created yet.")
        return self.token

class GoogleOAuthProvider(OAuthProvider):
    def __init__(self, credential_file):
        super().__init__(credential_file)
        self.scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]
    
    def authenticate(self) -> str:
        flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
            self.credential_file, self.scopes)
        auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
        self.flow = flow

        return auth_url + "&redirect_uri=http://localhost:8080/"
    
    def fetch_token(self, callback_code: str) -> None:
        self.flow.fetch_token(code=callback_code)
        self.token = self.flow.credentials.tokens

        if not os.path.exists('gg.json'):
            with open('gg.json', 'w') as token_file:
                token_file.write(self.flow.credentials.to_json())

    def refresh_token(self) -> None:
        if not self.token:
            raise ValueError("Token has not been created yet.")
        
        self.flow.credentials.refresh(requests.Request())
        self.token = self.flow.credentials.tokens