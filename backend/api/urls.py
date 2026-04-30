from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetail,
    ServiceListView, 
    ServiceDetail,
    AvailableSlotsView,
    UpdateBookingStatusView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views import test_email

urlpatterns = [
    # Auth Endpoints (CRITICAL FOR LOGIN)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Bookings
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', BookingDetail.as_view(), name='booking-detail'),

    #Services
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('services/<int:pk>/', ServiceDetail.as_view(), name='service-detail'),
    
    # Available Slots
    path('available-slots/', AvailableSlotsView.as_view(), name='available-slots'),
    
   path('bookings/<int:pk>/status/', UpdateBookingStatusView.as_view(), name='update-status'),
   path('test-email/', test_email, name='test-email'),
]

