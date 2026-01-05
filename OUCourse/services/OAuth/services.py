import os
import googleapiclient.discovery
from google.oauth2.credentials import Credentials

from OAuthProviders import GoogleOAuthProvider

def main():
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"

    provider = GoogleOAuthProvider('../secret/config2.json')
    auth_url = provider.authenticate()
    print("Please go to this URL and authorize the application:", auth_url)
    callback_code = input("Enter the authorization code: ")
    provider.fetch_token(callback_code)
    token_info = provider.get_user_response()

    print(token_info)
    credentials = Credentials(
        token=token_info['token'],
        refresh_token=token_info.get('refresh_token'),
        token_uri=token_info['token_uri'],
        client_id=token_info['client_id'],
        client_secret='secretkeyhere',
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