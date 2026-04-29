from rest_framework import serializers
from .models import Booking, Service

class BookingSerializer(serializers.ModelSerializer):
    # 1. Force strict date/time formats to prevent 500 crashes
    # This ensures a 400 Bad Request is returned if the format is wrong
    date = serializers.DateField(input_formats=['%Y-%m-%d', 'iso-8601'])
    time = serializers.TimeField(input_formats=['%H:%M', '%H:%M:%S', '%I:%M %p'])
    
    # 2. Add turnstile_token as a write-only field
    # required=False allows the serializer to work even if the token is missing in tests
    turnstile_token = serializers.CharField(
        write_only=True, 
        required=False, 
        allow_blank=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 
            'full_name', 
            'email', 
            'phone', 
            'service', 
            'date', 
            'time', 
            'notes', 
            'created_at', 
            'status', 
            'turnstile_token'
        ]
        read_only_fields = ['id', 'created_at', 'status']

    def create(self, validated_data):
        """
        Overriding create to strip out the turnstile_token before 
        it reaches the Booking.objects.create() method.
        """
        # Remove the token from the dictionary so the Model doesn't see it
        validated_data.pop('turnstile_token', None)
        
        # Now safely create the Booking instance
        return super().create(validated_data)

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'