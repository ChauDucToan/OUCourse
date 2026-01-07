from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from api.payments import serializers, models
from services.payments.PaymentProviders import PaymentFactory
# Create your views here.

class TransactionViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    serializer_class = serializers.TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return models.Transaction.objects.filter(user=self.request.user).order_by('-created_date')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        transaction = serializer.save(user=request.user)

        items_for_provider = []
        for detail in transaction.items.all():
            items_for_provider.append({
                'name': detail.courses.subject,
                'amount': float(detail.price_at_purchase),
                'quantity': 1,
                'description': f"{detail.courses.description[:50]}..." if detail.courses.description else "",
            })

        provider_name = request.data.get('provider')
        payment_provider = PaymentFactory.get_payment_provider(provider_name, items_for_provider)

        if not payment_provider:
            transaction.delete()
            return Response(
                {"error": "Invalid payment provider"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_response = payment_provider.create_payment(transaction)

        if "error" in payment_response:
            transaction.status = models.Transaction.statuses.FAILED
            transaction.save()
            return Response(
                {"error": payment_response["error"]}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        response_data = serializer.data
        response_data['payment_url'] = payment_response.get('checkout_url')
        response_data['session_id'] = payment_response.get('session_id')

        return Response(response_data, status=status.HTTP_201_CREATED)
    
class PaymentWebhookView(viewsets.ViewSet):
    authentication_classes = [] 
    permission_classes = [permissions.AllowAny]

    def _handle_webhook(self, request, provider_name):
        provider = PaymentFactory.get_payment_provider(provider_name, items=[])
        
        if not provider:
            return Response(
                {"error": f"Provider '{provider_name}' not supported"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        print( "Webhook received for provider:", provider_name)

        django_response = provider.process_webhook(request)

        return django_response

    @action(detail=False, methods=['post'], url_path='stripe')
    def stripe_webhook(self, request):
        return self._handle_webhook(request, 'stripe')

    # Endpoint: /api/webhook/zalopay/ (Method: POST)
    @action(detail=False, methods=['post'], url_path='zalopay')
    def zalopay_webhook(self, request):
        return self._handle_webhook(request, 'zalopay')