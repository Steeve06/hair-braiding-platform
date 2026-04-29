from rest_framework import serializers
from .models import Booking, Service

class BookingSerializer(serializers.ModelSerializer):
    # Explicitly handle formats to force 400 errors instead of 500 crashes
    date = serializers.DateField(input_formats=['%Y-%m-%d', 'iso-8601'])
    time = serializers.TimeField(input_formats=['%H:%M', '%H:%M:%S'])
    
    # Write-only field to receive the token without saving it to the DB
    turnstile_token = serializers.CharField(
        write_only=True, 
        required=False, 
        allow_blank=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'full_name', 'email', 'phone', 'service', 
            'date', 'time', 'notes', 'created_at', 'status', 
            'turnstile_token'
        ]
        read_only_fields = ['id', 'created_at', 'status']

    def create(self, validated_data):
        # Remove the token so the Model doesn't try to save it to a non-existent column
        validated_data.pop('turnstile_token', None)
        return super().create(validated_data)

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'