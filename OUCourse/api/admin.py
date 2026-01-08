from unfold.sites import UnfoldAdminSite as AdminSite

from api.users.models import User
from api.users.admin import UserAdmin

from api.courses.models import Course
from api.courses.admin import CourseAdmin

from api.lessons.models import Lesson, Tag
from api.lessons.admin import LessonAdmin, TagAdmin

from api.categories.models import Category
from api.categories.admin import CategoryAdmin

from api.comments.admin import CommentAdmin
from api.comments.models import Comment

from api.payments.admin import TransactionAdmin
from api.payments.models import Transaction

class MyAdminSite(AdminSite):
    site_header = 'OUCourse Administration'
    site_title = 'OUCourse Admin Portal'
    index_title = 'Welcome to OUCourse Admin'

admin_site = MyAdminSite(name='eCourse')
admin_site.default_site = MyAdminSite
admin_site.register(User, UserAdmin)
admin_site.register(Course, CourseAdmin)
admin_site.register(Lesson, LessonAdmin)
admin_site.register(Tag, TagAdmin)
admin_site.register(Category, CategoryAdmin)
admin_site.register(Comment, CommentAdmin)
admin_site.register(Transaction, TransactionAdmin)