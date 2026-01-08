from unfold.sites import UnfoldAdminSite as AdminSite

from api.users.models import User
from api.users.admin import UserAdmin

class MyAdminSite(AdminSite):
    site_header = 'OUCourse Administration'
    site_title = 'OUCourse Admin Portal'
    index_title = 'Welcome to OUCourse Admin'

    class Media:
        css = {
            'all': ('static/css/admin.css',)
        }

admin_site = MyAdminSite(name='eCourse')
admin_site.register(User, UserAdmin)