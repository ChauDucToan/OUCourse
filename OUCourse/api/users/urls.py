from django.urls import path, include
from api.users.views import UserView, StatisticUserView
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('', UserView, basename='user')
r.register('statistics', StatisticUserView, basename='statistic-user')

urlpatterns = [
    path('', include(r.urls)),
]