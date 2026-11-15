from rest_framework import serializers
from datetime import date
from .models import Booking, Service, Order, OrderItem


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate_booking_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Sorry hum Time Travel nahi kar sakte!")
        return value


# --- NAYA ORDER SERIALIZER (NESTED) ---
from decimal import Decimal
from django.db import transaction

class OrderItemSerializer(serializers.ModelSerializer):
    service_name = serializers.ReadOnlyField(source='service.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'service', 'service_name', 'quantity', 'price']
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        fields = [
            'id',
            'customer_username',
            'phone_number',
            'delivery_address',
            'instructions',
            'preferred_slot',
            'delivery_fee',
            'total_amount',
            'status',
            'payment_method',
            'payment_status',
            'rating',
            'review',
            'created_at',
            'items',
        ]
        read_only_fields = ['delivery_fee', 'total_amount', 'status', 'rating', 'review']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order mein kam se kam ek item hona chahiye.")
        for item in value:
            if not item['service'].is_available:
                raise serializers.ValidationError(f"'{item['service'].name}' abhi Out of Stock hai.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        subtotal = Decimal('0.00')

        for item in items_data:
            subtotal += item['service'].price * item['quantity']

        # ₹199 se neeche ₹20 Delivery Fee, ₹199+ par FREE Delivery
        delivery_fee = Decimal('0.00') if subtotal >= Decimal('199.00') else Decimal('20.00')
        grand_total = subtotal + delivery_fee

        order = Order.objects.create(
            user=user,
            delivery_fee=delivery_fee,
            total_amount=grand_total,
            **validated_data,    
        )

        for item in items_data:
            OrderItem.objects.create(
                order=order,
                service=item['service'],
                quantity=item['quantity'],
                price=item['service'].price,
            )

        return order