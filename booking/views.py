from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Service, Booking, Order
from .serializers import ServiceSerializer, BookingSerializer, OrderSerializer


@api_view(['GET'])
def get_services(request):
    services = Service.objects.all()
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Booking successful!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username aur password dono zaroori hain!'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username pehle se maujood hai!'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, password=password)
    return Response({'message': 'Naya account successfully ban gaya!'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_bookings(request):
    bookings = Booking.objects.all()
    booking_data = []
    for b in bookings:
        booking_data.append({
            'id': b.id,
            'customer_name': b.customer_name,
            'service_name': b.service.name,
            'date': b.booking_date,
            'time': str(b.booking_time)
        })
    return Response(booking_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.delete()
        return Response({'message': 'Booking successfully cancel ho gayi!'})
    except Booking.DoesNotExist:
        return Response({'error': 'Booking nahi mili.'}, status=status.HTTP_404_NOT_FOUND)


# --- NAYA MULTI-ITEM ORDER ENDPOINT ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    if not request.data.get('items'):
        return Response(
            {"error": "Cart khali hai, order place nahi ho sakta."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():
            serializer = OrderSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    # Sirf logged-in user ke orders nikalein, newest first
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
@api_view(['PATCH', 'POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    try:
        # Sirf logged-in user ka hi order dhoondhein (security check)
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order nahi mila.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Sirf PENDING orders hi cancel ho sakte hain
    if order.status != 'PENDING':
        return Response(
            {'error': f'Yeh order ab cancel nahi ho sakta kyunki status {order.status} hai.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    order.status = 'CANCELLED'
    order.save()
    return Response({'message': f'Order #{order.id} successfully cancel ho gaya!'})

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import Service, Order
from .serializers import ServiceSerializer, OrderSerializer


# 1. Check current user role (is_staff)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_info(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'is_staff': request.user.is_staff,
    })


# 2. Staff/Kitchen: Get ALL orders (latest first)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def staff_all_orders(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# 3. Staff/Kitchen: Update order status or payment status
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def staff_update_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order nahi mila.'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    new_payment_status = request.data.get('payment_status')

    if new_status:
        order.status = new_status
    if new_payment_status:
        order.payment_status = new_payment_status

    order.save()
    return Response(OrderSerializer(order).data)


# 4. Staff/Kitchen: Toggle Service In-Stock / Out-of-Stock
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def toggle_service_stock(request, service_id):
    try:
        service = Service.objects.get(id=service_id)
    except Service.DoesNotExist:
        return Response({'error': 'Service nahi mili.'}, status=status.HTTP_404_NOT_FOUND)

    service.is_available = not service.is_available
    service.save()
    return Response(ServiceSerializer(service).data)


# 5. Customer: Submit Rating & Review for Delivered Order
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def rate_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order nahi mila.'}, status=status.HTTP_404_NOT_FOUND)

    if order.status != 'DELIVERED':
        return Response({'error': 'Sirf Delivered orders ko hi rate kiya ja sakta hai.'}, status=status.HTTP_400_BAD_REQUEST)

    rating = request.data.get('rating')
    review = request.data.get('review', '')

    if not rating or not (1 <= int(rating) <= 5):
        return Response({'error': 'Rating 1 se 5 ke beech honi chahiye.'}, status=status.HTTP_400_BAD_REQUEST)

    order.rating = int(rating)
    order.review = review
    order.save()
    return Response(OrderSerializer(order).data)
