from rest_framework import generics, permissions, parsers
from .models import Booking, Service
from .serializers import BookingSerializer, ServiceSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime
from .models import Booking
from django.core.mail import send_mail
from django.conf import settings
import requests
import os
from rest_framework import status


class UpdateBookingStatusView(APIView):
    # This ensures only logged-in admins can accept/reject
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            new_status = request.data.get('status')
            
            if new_status not in ['confirmed', 'rejected']:
                return Response({"error": "Invalid status"}, status=400)
            
            booking.status = new_status
            booking.save()
            
            if new_status == 'confirmed':
                send_mail(
                    subject="Booking Confirmed",
                    message=f" Hello {booking.full_name},\n\nYour appointment for {booking.service} on {booking.date} at {booking.time} has been confirmed.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[booking.email],
                    fail_silently=False,                    
                )
                
            return Response(BookingSerializer(booking).data)
        
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)
class AvailableSlotsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        date_str = request.query_params.get('date') # Expected format: YYYY-MM-DD
        if not date_str:
            return Response({"error": "Date parameter is required"}, status=400)

        # 1. Your defined business hours (MUST match your frontend selection)
        all_slots = ["09:00", "12:00", "15:00", "18:00"]
        
        # 2. Filter for bookings on this date that are 'confirmed'
        # We also filter for 'pending' if you want to block slots 
        # as soon as someone requests them.
        booked_slots = Booking.objects.filter(
            date=date_str, 
            status__in=['confirmed', 'pending'] # Block both confirmed and pending
        ).values_list('time', flat=True)

        # 3. CRITICAL: Format the time objects from DB to "HH:MM" strings
        # Django's TimeField returns datetime.time(9, 0) -> we need "09:00"
        booked_formatted = [t.strftime('%H:%M') for t in booked_slots]

        # 4. Exclude booked slots from the total list
        available_slots = [slot for slot in all_slots if slot not in booked_formatted]

        return Response({"slots": available_slots})

class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer

    def post(self, request, *args, **kwargs):
        # 1. Token Check
        token = request.data.get('turnstile_token')
        if not token:
            return Response({"error": "Security token is missing."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Cloudflare Verification
        secret_key = os.environ.get('TURNSTILE_SECRET_KEY')
        if not secret_key:
            # If this hits, you need to add the key to Render Environment Variables
            return Response({"error": "Server configuration error (Secret Key missing)."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        verify_url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        try:
            response = requests.post(verify_url, data={
                'secret': secret_key,
                'response': token,
            }, timeout=5)
            result = response.json()
        except Exception:
            return Response({"error": "Could not connect to security service."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if not result.get('success'):
            return Response({"error": "Security check failed. Please refresh."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Serializer Validation
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 4. Database Save
        try:
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Logs the real error to Render while returning a clean response
            print(f"Database Save Error: {e}")
            return Response({"error": "Database integrity error. Check field formats."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class BookingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAdminUser]
    
class ServiceListView(generics.ListCreateAPIView):
    queryset = Service.objects.all().order_by('order')
    serializer_class = ServiceSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]