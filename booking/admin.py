from django.contrib import admin
from .models import Service, Booking, Order, OrderItem


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price')
    list_filter = ('category',)
    search_fields = ('name',)
    list_editable = ('price',)  # Menu rates directly list se update karne ke liye


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'service', 'booking_date', 'booking_time')
    list_filter = ('booking_date', 'service__category')
    search_fields = ('customer_name', 'service__name')


# --- MASTER-DETAIL ORDER ADMIN SETUP ---

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0  # Khali extra rows na dikhein
    readonly_fields = ('service', 'quantity', 'price')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'phone_number',
        'total_amount',
        'payment_method',
        'payment_status',
        'status',
        'created_at',
    )
    list_filter = ('status', 'payment_method', 'payment_status', 'created_at')
    search_fields = ('id', 'user__username', 'phone_number', 'delivery_address')
    list_editable = ('status', 'payment_status')  # Admin list se hi payment status PAID kar sake
    readonly_fields = ('user', 'total_amount', 'created_at')
    inlines = [OrderItemInline]

    fieldsets = (
        ('Order & Payment Summary', {
            'fields': ('user', 'status', 'total_amount', 'payment_method', 'payment_status', 'created_at')
        }),
        ('Delivery & Customer Contact', {
            'fields': ('phone_number', 'delivery_address', 'instructions')
        }),
    )


# Admin Panel ke Header aur Title ko ProBooking ke naam se customize karna
admin.site.site_header = "ProBooking Operations Dashboard"
admin.site.site_title = "ProBooking Admin"
admin.site.index_title = "Hotel, Food & Electrician Management"