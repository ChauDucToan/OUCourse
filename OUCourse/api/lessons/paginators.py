from rest_framework.pagination import PageNumberPagination

class CommentPaginator(PageNumberPagination):
    page_size = 8

class LessonPaginator(PageNumberPagination):
    page_size = 8