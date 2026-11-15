from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

CATEGORY_CHOICES = (
    ('FOOD', 'Hotel & Food'),
    ('ELEC', 'Electrician Services'),
)

class Service(models.Model):
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='FOOD')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, null=True)
    is_available = models.BooleanField(default=True)  # Feature #3: Stock Toggle

    def __str__(self):
        return f"{self.name} ({'In Stock' if self.is_available else 'Sold Out'})"



class Booking(models.Model):
    customer_name = models.CharField(max_length=100)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    booking_date = models.DateField(default=timezone.now)
    booking_time = models.TimeField(default=timezone.now)

    def __str__(self):
        return f"{self.customer_name} - {self.service.name}"

# --- NAYA MULTI-ITEM CART ORDER SYSTEM ---

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    PAYMENT_METHODS = [
        ('COD', 'Cash on Delivery'),
        ('ONLINE', 'UPI Online'),
    ]

    PAYMENT_STATUS = [
        ('UNPAID', 'Unpaid'),
        ('PAID', 'Paid'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    phone_number = models.CharField(max_length=15)
    delivery_address = models.TextField()
    instructions = models.TextField(blank=True)
    preferred_slot = models.CharField(max_length=100, blank=True, default='')  # Feature #5: Electrician Slot
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)  # Feature #4: Delivery Fee
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='PENDING')
    payment_method = models.CharField(max_length=15, choices=PAYMENT_METHODS, default='COD')
    payment_status = models.CharField(max_length=15, choices=PAYMENT_STATUS, default='UNPAID')
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # Feature #5: 1-5 Star Rating
    review = models.TextField(blank=True, default='')  # Feature #5: Customer Review
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username} ({self.status})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.service.name} x {self.quantity}"