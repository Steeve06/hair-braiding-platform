from rest_framework import serializers
from .models import Booking, Service

class BookingSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Booking
        fields = [
            'id', 'full_name', 'email', 'phone', 'service', 'date', 'time', 'notes', 'created_at', 'status', 
        ]
        
        read_only_fields = ['id','created_at']
        
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'