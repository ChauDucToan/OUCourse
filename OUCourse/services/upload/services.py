import os
import googleapiclient.discovery
from ..OAuth.OAuthProviders import OAuthFactory
from api.authentications.models import AuthenticationModel
from api.users.models import User
from googleapiclient.http import MediaFileUpload
import tempfile

def save_temp_file(file_obj):
    tfile = tempfile.NamedTemporaryFile(delete=False) 
    for chunk in file_obj.chunks():
        tfile.write(chunk)
    tfile.close()
    return tfile.name

def get_youtube_service(user_id = 1, scopes=None):
    try:
        auth = AuthenticationModel.objects.get(user_id=user_id, provider='google')
    except AuthenticationModel.DoesNotExist:
        raise Exception("User chưa liên kết tài khoản Google/YouTube")

    token_info = {
        'token': auth.access_token,
        'refresh_token': auth.refresh_token,
        'token_uri': "https://oauth2.googleapis.com/token",
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

def upload_video_to_youtube( video_file_obj, title, description, tags, privacy_status='unlisted', user_id=None):
    if user_id is None:
        user_id = User.objects.filter(username__icontains="acctest").first().id
    youtube_service = get_youtube_service(user_id, scopes = [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.force-ssl"
    ])

    temp_file_path = save_temp_file(video_file_obj)

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
    try:
        media = MediaFileUpload(temp_file_path, resumable=True)

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
        return f"https://www.youtube.com/watch?v={response['id']}"
    
    except Exception as e:
        raise e
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)