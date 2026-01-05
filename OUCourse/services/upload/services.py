import googleapiclient.discovery
from ..OAuth.OAuthProviders import OAuthFactory
from ...api.authentications.models import AuthenticationModel
from googleapiclient.http import MediaFileUpload

def get_youtube_service(user_id, scopes=None):
    try:
        auth = AuthenticationModel.objects.get(user_id=user_id, provider='google')
    except AuthenticationModel.DoesNotExist:
        raise Exception("User chưa liên kết tài khoản Google/YouTube")

    token_info = {
        'token': auth.access_token,
        'refresh_token': auth.refresh_token,
        'token_uri': auth.token_uri,
        'client_id': auth.client_id,
        'expiry': auth.expires_at.isoformat() if auth.expires_at else None
    }

    provider = OAuthFactory.get_provider('google', scopes=scopes)

    provider.refresh_token(token_info) 
    
    new_creds = provider.get_user_response()
    if new_creds['token'] != auth.access_token:
        auth.access_token = new_creds['token']
        auth.expires_at = new_creds.get('expiry')
        auth.save()

    return googleapiclient.discovery.build('youtube', 'v3', credentials=provider.credentials)

def upload_video_to_youtube(user_id, video_file_path, title, description, tags, privacy_status='unlisted'):
    youtube_service = get_youtube_service(user_id, scopes = ["https://www.googleapis.com/auth/youtube.upload"])

    body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': tags
        },
        'status': {
            'privacyStatus': privacy_status
        }
    }

    media = MediaFileUpload(video_file_path, resumable=True)

    request = youtube_service.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Uploading... {int(status.progress() * 100)}%")

    print("Upload complete!")
    return response