from unfold.sites import UnfoldAdminSite as AdminSite
from django.utils import timezone
from django.db.models import Sum, Count
from django.db.models.functions import TruncDay, TruncMonth
from datetime import timedelta

from api.users.models import User
from api.users.admin import UserAdmin

from api.courses.models import Course, ManageCourse
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

def dashboard_callback(request, context):
    days = int(request.GET.get('days', 365))
    start_date = timezone.now() - timedelta(days=days)

    active_courses = Course.objects.filter(active=True).count()
    
    paid_txs = Transaction.objects.filter(
        status=Transaction.statuses.COMPLETED,
        created_date__gte=start_date
    )

    total_revenue = paid_txs.aggregate(Sum('total_amount'))['total_amount__sum'] or 0

    if days <= 30:
        trunc_func = TruncDay
        date_format = "%d/%m"
    else:
        trunc_func = TruncMonth
        date_format = "%m/%Y"

    revenue_stats = (
        paid_txs.annotate(period=trunc_func('created_date'))  # Dùng hàm trunc động
        .values('period')
        .annotate(revenue=Sum('total_amount'))
        .order_by('period')
    )

    chart_labels = [x['period'].strftime(date_format) for x in revenue_stats]
    chart_data = [float(x['revenue']) for x in revenue_stats]
    
    daily_regs = (
        ManageCourse.objects.filter(
            created_date__gte=start_date,
            status__in=[ManageCourse.Status.ENROLLED, ManageCourse.Status.COMPLETED]
        )
        .annotate(day=TruncDay('created_date'))
        .values('day')
        .annotate(count=Count('id'))
        .order_by('day')
    )
    
    registration_frequency = [x['count'] for x in daily_regs]

    kpi = [
        {
            "title": "Doanh thu tổng (VND)",
            "metric": f"{total_revenue:,.0f} đ",
            "footer": f"Doanh thu trong {days} ngày qua",
        },
        {
            "title": "Khóa học đang mở",
            "metric": active_courses,
            "footer": "Sẵn sàng đăng ký",
        },
        {
            "title": "Tần suất đăng ký",
            "metric": sum(registration_frequency),
            "footer": "Giao dịch thành công",
            "chart": registration_frequency[-30:] if registration_frequency else [],
        },
    ]

    context.update({
        "kpi": kpi,
        "chart_config": {
            "labels": chart_labels,
            "data": chart_data,
            "title": f"Biểu đồ doanh thu theo {'ngày' if days <= 30 else 'tháng'}"
        },
        "current_days": days 
    })

    return context

admin_site = MyAdminSite(name='eCourse')
admin_site.default_site = MyAdminSite
admin_site.register(User, UserAdmin)
admin_site.register(Course, CourseAdmin)
admin_site.register(Lesson, LessonAdmin)
admin_site.register(Tag, TagAdmin)
admin_site.register(Category, CategoryAdmin)
admin_site.register(Comment, CommentAdmin)
admin_site.register(Transaction, TransactionAdmin)