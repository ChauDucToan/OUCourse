from django.urls import path, include
from .views import TransactionViewSet, PaymentWebhookView
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('', TransactionViewSet, basename='payment')
r.register('webhook', PaymentWebhookView, basename='payment-webhook')
urlpatterns = [
    path('', include(r.urls)),
]