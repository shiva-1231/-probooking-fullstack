"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib import admin
from django.urls import path
from booking import views
# Yeh nayi line add karein
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/services/', views.get_services),
    path('api/book/', views.create_booking),
    # User Login ke liye naye URLs
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # NAYA URL SIGNUP KE LIYE:
    path('api/register/', views.register_user),
        # ... purane URLs
    path('api/my-bookings/', views.get_my_bookings),
        # ... aapke purane URLs (services, login, book, my-bookings) ...
 
    # NAYA URL CANCEL KE LIYE (isme ID pass hogi):
    path('api/cancel-booking/<int:booking_id>/', views.cancel_booking),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/bookings/', views.get_my_bookings),
    path('api/bookings/<int:pk>/', views.cancel_booking),
    path('api/orders/create/', views.create_order, name='create-order'),
    path('api/orders/', views.get_my_orders, name='my-orders'),
    path('api/orders/<int:order_id>/cancel/', views.cancel_order, name='cancel-order'),
    path('api/me/', views.current_user_info, name='current-user-info'),
    path('api/staff/orders/', views.staff_all_orders, name='staff-all-orders'),
    path('api/staff/orders/<int:order_id>/update/', views.staff_update_order, name='staff-update-order'),
    path('api/staff/services/<int:service_id>/toggle-stock/', views.toggle_service_stock, name='toggle-service-stock'),
    path('api/orders/<int:order_id>/rate/', views.rate_order, name='rate-order'),


]