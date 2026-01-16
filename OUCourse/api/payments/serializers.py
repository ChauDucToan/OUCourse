from rest_framework import serializers
from .models import Transaction, TransactionDetail

class TransactionDetailSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.subject', read_only=True)

    class Meta:
        model = TransactionDetail
        fields = ['id', 'course', 'course_name', 'price_at_purchase']

        read_only_fields = ['price_at_purchase']

class TransactionSerializer(serializers.ModelSerializer):
    items = TransactionDetailSerializer(many=True, read_only=False)

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        transaction = Transaction.objects.create(**validated_data)

        total_amount = 0
        for item_data in items_data:
            course = item_data['course']
            price = float(course.price)

            detail = TransactionDetail.objects.create(
                transaction=transaction,
                course=course,
                price_at_purchase=price,
            )
            total_amount += price

        transaction.total_amount = total_amount
        transaction.save()
        return transaction 

    def validate_items(self, value):
        if isinstance(value, list) and len(value) == 0:
            raise serializers.ValidationError("Transaction must have at least one item.")
        
        for item in value:
            course_id = item.get('course')

            course = TransactionDetail.objects.select_related('transaction').filter(
                course_id=course_id,
                transaction__user=self.context['request'].user
            ).first()

            if course:
                raise serializers.ValidationError(f"User has already been purchased the course with id {course_id}.")
            
        return value
    
    def validate_currency(self, value):
        allowed_currencies = ['vnd', 'usd']
        if value.lower() not in allowed_currencies:
            raise serializers.ValidationError(f"Currency must be one of {allowed_currencies}.")
        return value.lower()

    class Meta:
        model = Transaction
        fields = [
            'id',
            'order_code',
            'total_amount',
            'currency',

            'status',

            'provider',

            'user',
            'items',
        ]
        read_only_fields = ['order_code', 'status', 'user', 'provider_transaction_id', 'total_amount']