from api.courses.models import Course, ManageCourse
from api.users.models import User
from api.categories.models import Category
from api.lessons.models import Lesson, Tag
from api.payments.models import Transaction, TransactionDetail
from api.comments.models import Comment, Emotion


import random
import unicodedata
import string
from datetime import timedelta
from django.utils import timezone
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType

random.seed(27)

VN_FAMILY = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Võ", "Đặng", "Bùi", "Đỗ",
    "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Tạ", "Đào", "Vũ", "Trương", "Phan"
]
VN_GIVEN = [
    "An", "Bình", "Chi", "Duy", "Giang", "Hà", "Hân", "Hải", "Hiếu", "Hoài",
    "Khang", "Khánh", "Linh", "Minh", "My", "Nam", "Ngân", "Nhi", "Phúc", "Phương",
    "Quân", "Quang", "Sơn", "Thảo", "Thành", "Thiện", "Trang", "Tú", "Vy", "Yến"
]

EN_FAMILY = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson",
    "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Perez"
]
EN_GIVEN = [
    "Alex", "Ben", "Chloe", "Daniel", "Emma", "Fiona", "Grace", "Henry", "Ivy",
    "Jack", "Katy", "Liam", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Ryan",
    "Sophia", "Tom", "Uma", "Vera", "Will", "Zoe"
]

DOMAINS = ["example.com", "mail.com", "student.edu", "oucourse.vn"]

CS_FOCUSED_CATEGORIES = [
    # CS Core
    "Nhập môn Khoa học máy tính",
    "Tư duy lập trình",
    "Cấu trúc dữ liệu",
    "Thuật toán",
    "Giải thuật nâng cao",
    "Toán rời rạc",
    "Xác suất & Thống kê cho CS",
    "Đại số tuyến tính cho ML",

    # Programming
    "Lập trình Python",
    "Lập trình Java",
    "Lập trình C/C++",
    "Lập trình JavaScript",
    "Lập trình Go",
    "Lập trình Rust",
    "Lập trình hướng đối tượng (OOP)",
    "Functional Programming",

    # Software Engineering
    "Kỹ thuật phần mềm",
    "Git & Quy trình làm việc",
    "Clean Code",
    "Design Patterns",
    "Kiểm thử phần mềm (Testing)",
    "System Design",
    "Kiến trúc Microservices",

    # Web / Backend / Frontend
    "Web cơ bản (HTML/CSS)",
    "Frontend (React/Vue)",
    "Backend (Django/DRF)",
    "Backend (Node.js)",
    "REST API",
    "GraphQL",

    # Databases / Data
    "Cơ sở dữ liệu (SQL)",
    "Cơ sở dữ liệu NoSQL",
    "Thiết kế Database",
    "Data Engineering",
    "Big Data (Spark)",
    "ETL & Data Pipeline",

    # Systems
    "Hệ điều hành",
    "Mạng máy tính",
    "Lập trình hệ thống",
    "Hệ phân tán",
    "Hiệu năng & Tối ưu",

    # Cloud / DevOps
    "Docker",
    "Kubernetes",
    "Cloud Computing",
    "CI/CD",
    "DevOps",
    "SRE (Site Reliability)",

    # Security
    "An toàn thông tin",
    "Web Security (OWASP)",
    "Mật mã học cơ bản",

    # AI/ML
    "Trí tuệ nhân tạo (AI)",
    "Machine Learning",
    "Deep Learning",
    "NLP (Xử lý ngôn ngữ)",
    "Computer Vision",
    "MLOps",
]

BROAD_TAGS = [
    "beginner",          # mức độ
    "intermediate",
    "advanced",

    "theory",            # kiểu nội dung
    "practice",
    "project",
    "quiz",

    "backend",           # domain
    "frontend",
    "mobile",
    "data",
    "database",
    "devops",
    "cloud",
    "security",
    "ai-ml",
    "systems",
    "algorithms",
    "web",
]

VIDEO_URLS = {
    "intro_cs_python": "https://www.youtube.com/playlist?list=PLUl4u3cNGP63WbdFxL8giv4yhgdMGaZNA",  # MIT 6.0001 (2020)
    "algorithms_mit": "https://www.youtube.com/playlist?list=PLUl4u3cNGP63EdVPNLG3ToM6LaEUuStEY",     # MIT 6.006 (2020)
    "cs50": "https://www.youtube.com/playlist?list=PLhQjrBD2T383q7Vn8QnTsVgSvyLpsqL_R",               # CS50x 2025
    "os_xv6": "https://www.youtube.com/playlist?list=PLTsf9UeqkReZHXWY9yJvTwLJWYYPcKEqK",             # MIT 6.S081
    "distributed": "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB",         # MIT 6.824 (2020)
    "cv_cs231n": "https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16",           # Stanford CS231n 2025
    "sql_full": "https://www.youtube.com/watch?v=7S_tz1z_5bA",                                         # SQL Course
    "docker_full": "https://www.youtube.com/watch?v=fqMOX6JJhGo",                                       # Docker Tutorial (full)
    "k8s_full": "https://www.youtube.com/watch?v=d6WC5n9G_sM",                                          # Kubernetes course
    "drf_full": "https://www.youtube.com/watch?v=tujhGdn1EMI",                                          # Django REST Framework
    "networking": "https://www.youtube.com/watch?v=IPvYjXCsTg8",                                        # Networking course
    "cyber_cert": "https://www.youtube.com/playlist?list=PLTZYG7bZ1u6ocTMdhDwwmfjaNv134KcWn",           # Google Cybersecurity Certificate
    "system_design": "https://www.youtube.com/watch?v=m8Icp_Cid5o",                                     # System Design for Beginners
}

COURSE_TEMPLATES = [
    {
        "subject": "Nhập môn Khoa học máy tính với Python",
        "category_keywords": ["Nhập môn", "Khoa học máy tính", "Python"],
        "video": VIDEO_URLS["intro_cs_python"],
        "duration": 900,  # phút (tùy bạn quy ước)
        "price": Decimal("0"),
        "description": "<p>Khóa nền tảng giúp bạn làm quen tư duy CS, Python, và cách giải quyết bài toán bằng lập trình.</p>",
    },
    {
        "subject": "Thuật toán cơ bản: Sorting & Searching",
        "category_keywords": ["Thuật toán", "Algorithms"],
        "video": VIDEO_URLS["algorithms_mit"],
        "duration": 720,
        "price": Decimal("199000"),
        "description": "<p>Tập trung vào tư duy thuật toán, độ phức tạp, và các kỹ thuật sắp xếp/tìm kiếm kinh điển.</p>",
    },
    {
        "subject": "Cấu trúc dữ liệu: Array, Stack, Queue, Tree",
        "category_keywords": ["Cấu trúc dữ liệu", "Data Structures"],
        "video": VIDEO_URLS["algorithms_mit"],
        "duration": 600,
        "price": Decimal("159000"),
        "description": "<p>Nắm chắc các cấu trúc dữ liệu cốt lõi để học DSA và phỏng vấn hiệu quả.</p>",
    },
    {
        "subject": "CS50: Lập trình & nền tảng Computer Science",
        "category_keywords": ["Nhập môn", "Tư duy lập trình", "Khoa học máy tính"],
        "video": VIDEO_URLS["cs50"],
        "duration": 1000,
        "price": Decimal("0"),
        "description": "<p>Khóa nhập môn cực nổi tiếng: C, thuật toán, web cơ bản và tư duy problem solving.</p>",
    },
    {
        "subject": "Hệ điều hành căn bản với xv6 (MIT 6.S081)",
        "category_keywords": ["Hệ điều hành", "Operating", "Systems"],
        "video": VIDEO_URLS["os_xv6"],
        "duration": 900,
        "price": Decimal("249000"),
        "description": "<p>Hiểu OS qua kernel nhỏ gọn xv6: process, syscall, memory, scheduling.</p>",
    },
    {
        "subject": "Distributed Systems: RPC, Raft & Replication (MIT 6.824)",
        "category_keywords": ["Hệ phân tán", "Distributed", "Systems", "Raft"],
        "video": VIDEO_URLS["distributed"],
        "duration": 900,
        "price": Decimal("299000"),
        "description": "<p>Đi sâu vào nền tảng hệ phân tán: RPC, consistency, fault tolerance và Raft.</p>",
    },
    {
        "subject": "Computer Vision: CNNs & Image Classification (CS231n)",
        "category_keywords": ["Computer Vision", "Deep Learning", "AI", "ML"],
        "video": VIDEO_URLS["cv_cs231n"],
        "duration": 800,
        "price": Decimal("299000"),
        "description": "<p>Nhập môn thị giác máy tính và deep learning: CNN, loss, optimization, training tips.</p>",
    },
    {
        "subject": "SQL cho lập trình viên: Từ cơ bản đến thực chiến",
        "category_keywords": ["SQL", "Cơ sở dữ liệu", "Database"],
        "video": VIDEO_URLS["sql_full"],
        "duration": 360,
        "price": Decimal("129000"),
        "description": "<p>SQL nền tảng: SELECT, JOIN, GROUP BY, index, và tư duy thiết kế truy vấn.</p>",
    },
    {
        "subject": "Docker từ A-Z cho Backend Developer",
        "category_keywords": ["Docker", "DevOps", "Cloud"],
        "video": VIDEO_URLS["docker_full"],
        "duration": 240,
        "price": Decimal("149000"),
        "description": "<p>Container hóa ứng dụng, Dockerfile, image, network, volume và best practices.</p>",
    },
    {
        "subject": "Kubernetes căn bản: Deploy ứng dụng lên K8s",
        "category_keywords": ["Kubernetes", "DevOps", "Cloud"],
        "video": VIDEO_URLS["k8s_full"],
        "duration": 240,
        "price": Decimal("199000"),
        "description": "<p>Pod, Deployment, Service, Ingress và cách triển khai app thực tế trên Kubernetes.</p>",
    },
    {
        "subject": "Xây REST API với Django REST Framework",
        "category_keywords": ["Django", "DRF", "REST", "Backend"],
        "video": VIDEO_URLS["drf_full"],
        "duration": 300,
        "price": Decimal("199000"),
        "description": "<p>Serializer, ViewSet, Router, Auth/Permissions và xây API clean, dễ mở rộng.</p>",
    },
    {
        "subject": "Mạng máy tính: OSI, TCP/IP, DNS, HTTP",
        "category_keywords": ["Mạng", "Networking", "Computer Networks"],
        "video": VIDEO_URLS["networking"],
        "duration": 300,
        "price": Decimal("159000"),
        "description": "<p>Hiểu cách internet hoạt động: tầng mạng, routing, DNS, HTTP, TCP/UDP.</p>",
    },
    {
        "subject": "Security Fundamentals: tư duy phòng thủ & OWASP cơ bản",
        "category_keywords": ["An toàn", "Security", "OWASP"],
        "video": VIDEO_URLS["cyber_cert"],
        "duration": 600,
        "price": Decimal("0"),
        "description": "<p>Nền tảng an toàn thông tin: threat model, hardening, best practices và nhận diện rủi ro.</p>",
    },
    {
        "subject": "System Design nền tảng: cache, queue, database, scalability",
        "category_keywords": ["System Design", "Hệ phân tán", "Kiến trúc"],
        "video": VIDEO_URLS["system_design"],
        "duration": 240,
        "price": Decimal("249000"),
        "description": "<p>Học cách thiết kế hệ thống: scale, reliability, caching, queue và trade-offs.</p>",
    },
]

_WORDS = [
    "hay", "rõ", "dễ hiểu", "khó", "ổn", "đỉnh", "chi tiết", "thiếu ví dụ",
    "tốc độ vừa", "tốc độ nhanh", "cần demo", "nên thêm bài tập", "phần này quan trọng",
    "mình chưa hiểu đoạn này", "giải thích lại giúp", "cảm ơn thầy", "good job",
]

_TEMPLATES = [
    "Bài này {adj} 👍 {extra}",
    "Em thấy phần này {adj}. {extra}",
    "Đoạn {topic} hơi {adj}, {extra}",
    "Cảm ơn bài giảng! {extra}",
    "Mình đề xuất: {extra}",
]

_TOPICS = ["ORM", "serializer", "queryset", "filter", "prefetch", "select_related", "GenericFK", "signals"]
_ADJ = ["hay", "ổn", "khó", "rõ ràng", "hơi nhanh", "cực kỳ dễ hiểu", "thiếu ví dụ"]

PROVIDERS = ["stripe", "zalopay"]
CURRENCIES = ["vnd", "usd"]

def generate_comment_content():
    template = random.choice(_TEMPLATES)
    content = template.format(
        adj=random.choice(_ADJ),
        topic=random.choice(_TOPICS),
        extra=" ".join(random.sample(_WORDS, k=random.randint(0, 3)))
    )
    return content.strip()

def find_category_by_keywords(keywords):
    qs = Category.objects.all()
    for kw in keywords:
        hit = qs.filter(name__icontains=kw).first()
        if hit:
            return hit
    return qs.first()

def unique_subject(base):
    subject = base
    i = 1
    while Course.objects.filter(subject=subject).exists():
        i += 1
        subject = f"{base} #{i}"
    return subject

def strip_accents(s: str) -> str:
    # bỏ dấu tiếng Việt để làm username/email
    return "".join(
        c for c in unicodedata.normalize("NFKD", s)
        if not unicodedata.combining(c)
    )

def slugify_simple(s: str) -> str:
    s = strip_accents(s).lower()
    allowed = string.ascii_lowercase + string.digits
    s = "".join(ch if ch in allowed else "-" for ch in s)
    s = "-".join(filter(None, s.split("-")))
    return s

def unique_username(base: str) -> str:
    base = slugify_simple(base)[:20] or "user"
    username = base
    i = 1
    while User.objects.filter(username=username).exists():
        i += 1
        suffix = f"{i:02d}"
        username = f"{base[:20-len(suffix)]}{suffix}"
    return username

def pick_name():
    # 60% Việt, 40% Tây cho đa dạng
    if random.random() < 0.6:
        last_name = random.choice(VN_FAMILY)
        first_name = random.choice(VN_GIVEN)
    else:
        last_name = random.choice(EN_FAMILY)
        first_name = random.choice(EN_GIVEN)
    return first_name, last_name

def make_email(username: str) -> str:
    return f"{username}@{random.choice(DOMAINS)}"

class Command(BaseCommand):
    help = 'Generate fake data for testing'

    def _create_tags(self):
        tags = []
        for tag_name in BROAD_TAGS:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            tags.append(tag)
        return tags

    def _create_categories(self):
        categories = []
        for cat_name in CS_FOCUSED_CATEGORIES:
            category, created = Category.objects.get_or_create(name=cat_name)
            categories.append(category)
        return categories

    def _create_users(self):
        users = []
        for i in range(50):
            role = User.Role.INSTRUCTOR if random.random() < 0.1 else User.Role.STUDENT
            
            username = unique_username(f"{random.choice(VN_FAMILY + EN_FAMILY + VN_GIVEN + EN_GIVEN)}{i}")
            first_name, last_name = pick_name()

            user = User.objects.create_user(
                username=username,
                email=make_email(username),
                password="Admin@123",
                first_name=first_name,
                last_name=last_name,
                role=role
            )

            users.append(user)
        return users

    def _create_courses(self):
        instructors = User.objects.filter(role=User.Role.INSTRUCTOR)
        courses = []
        lessons = []
        for template in COURSE_TEMPLATES:
            subject = unique_subject(template["subject"])
            category = find_category_by_keywords(template["category_keywords"])
            tags = Tag.objects.filter(name__in=BROAD_TAGS).order_by('?')[:3]
            instructor = random.choice(instructors) if instructors.exists() else None

            course = Course.objects.create(
                subject=subject,
                description=template["description"],
                category=category,
                price=template["price"],
                instructor=instructor,
                duration=template["duration"],
                video=template["video"],
            )

            # Tạo các lesson giả
            num_lessons = template["duration"] // 30  # giả sử mỗi lesson ~30 phút
            for j in range(num_lessons):
                les = Lesson.objects.create(
                    course=course,
                    subject=f"Bài học {j+1}: Nội dung của {subject}",
                    video=template["video"],
                    content=f"Nội dung chi tiết cho bài học {j+1} của khóa học {subject}.",
                    order=j * 10,
                )

                for tag in tags:
                    if random.random() < 0.7:
                        les.tags.add(tag)
                
                lessons.append(les)
            courses.append(course)
        return courses, lessons

    def _create_comments(self, students, lessons):
        comments = []
        emotions = []
        for lesson in lessons:
            num_comments = random.randint(5, 20)
            for _ in range(num_comments):
                student = random.choice(students)
                content = generate_comment_content()
                comment = Comment.objects.create(
                    user=student,
                    lesson=lesson,
                    content=content
                )
                
                emotion = Emotion.objects.create(
                    type = random.choice(Emotion.EmotionType.values),
                    user = student,
                    content_type = ContentType.objects.get_for_model(Comment),
                    object_id = comment.id
                )

                comments.append(comment)
                emotions.append(emotion)
        return comments, emotions
    
    def _create_transactions(self, students, courses, current_date):
        transactions = []
        for student in students:
            if random.random() < 0.5:
                continue  # không phải ai cũng mua khóa học
            
            num_courses = random.randint(1, 3)
            selected_courses = random.sample(courses, k=num_courses)

            if ManageCourse.objects.filter(student=student, course__in=selected_courses).exists():
                continue  # tránh mua trùng khóa đã đăng ký

            transaction = Transaction.objects.create(
                order_code=f"ORD-{random.randint(100, 999999999)}",
                total_amount=sum(course.price for course in selected_courses),
                currency='vnd',
                status=Transaction.statuses.COMPLETED,
                provider=random.choice(PROVIDERS),
                user=student,
            )

            transaction.created_date = current_date
            transaction.save()

            for course in selected_courses:
                transaction_details = TransactionDetail.objects.create(
                    transaction=transaction,
                    courses=course,
                    price_at_purchase=course.price
                )

                manage_course = ManageCourse.objects.create(
                    student=student,
                    course=course,
                    status=ManageCourse.Status.ENROLLED
                )

                manage_course.created_date = current_date
                manage_course.save()

            transactions.append(transaction)

        return transactions

    def handle(self, *args, **kwargs):
        tags = self._create_tags()
        categories = self._create_categories()
        users = self._create_users()
        courses, lessons = self._create_courses()
        comments, emotions = self._create_comments(
            students=[u for u in users if u.role == User.Role.STUDENT],
            lessons=lessons
        )

        end_date = timezone.now()
        start_date = end_date - timedelta(days=365 * 2)  # 2 năm trước
        
        current_loop_date = start_date
        while current_loop_date < end_date:            
            self._create_transactions(
                students=[u for u in users if u.role == User.Role.STUDENT],
                courses=courses,
                current_date=current_loop_date
            )

            days_to_skip = random.randint(3, 5)
            current_loop_date += timedelta(days=days_to_skip)