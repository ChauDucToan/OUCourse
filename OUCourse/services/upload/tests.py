import os
import django
from django.core.files import File

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "OUCourse.settings")

django.setup()

from .services import upload_video_to_youtube

if __name__ == "__main__":
    from api.users.models import User
    test_user = User.objects.filter(email__icontains='acctest').first()
    with open('/home/oslamelon/Downloads/video.mp4', 'rb') as f:
        video_file = File(f)

        print(upload_video_to_youtube(
            user_id=test_user.id,
            video_file_obj=video_file,
            title="Test Upload Video",
            description="This is a test upload video.",
            tags=["test", "upload"]
        ))