import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from google.oauth2.credentials import Credentials

from OAuthProviders import GoogleOAuthProvider

def main():
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"

    provider = GoogleOAuthProvider('../secret/config.json')
    auth_url = provider.authenticate()
    print("Please go to this URL and authorize the application:", auth_url)
    callback_code = input("Enter the authorization code: ")
    provider.fetch_token(callback_code)
    token_info = provider.get_token()
    credentials = Credentials(
        token=token_info['access_token'],
        refresh_token=token_info.get('refresh_token'),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=provider.credentials['installed']['client_id'],
        client_secret=provider.credentials['installed']['client_secret'],
        scopes=provider.scopes
    )
    
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)

    request = youtube.search().list(
        part="snippet",
        maxResults=25,
        q="neuro sama"
    )
    response = request.execute()

    print(response)

if __name__ == "__main__":
    main()