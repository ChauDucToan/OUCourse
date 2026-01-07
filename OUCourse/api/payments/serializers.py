from rest_framework import serializers
from .models import Transaction, TransactionDetail

class TransactionDetailSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='courses.subject', read_only=True)

    class Meta:
        model = TransactionDetail
        fields = ['id', 'courses', 'course_name', 'price_at_purchase']

        read_only_fields = ['price_at_purchase']

class TransactionSerializer(serializers.ModelSerializer):
    items = TransactionDetailSerializer(many=True, read_only=False)

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        transaction = Transaction.objects.create(**validated_data)

        total_amount = 0
        for item_data in items_data:
            course = item_data['courses']
            price = float(course.price)

            detail = TransactionDetail.objects.create(
                transaction=transaction,
                courses=course,
                price_at_purchase=price,
            )
            total_amount += price

        transaction.total_amount = total_amount
        transaction.save()
        return transaction 

    def validate_items(self, value):
        if isinstance(value, list) and len(value) == 0:
            raise serializers.ValidationError("Transaction must have at least one item.")
        return value

    class Meta:
        model = Transaction
        fields = [
            'id',
            'order_code',
            'total_amount',
            'currency',
            'payment_method',

            'status',

            'provider',

            'user',
            'items',
        ]
        read_only_fields = ['order_code', 'status', 'user', 'provider_transaction_id', 'total_amount']