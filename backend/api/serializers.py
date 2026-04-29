from rest_framework import serializers
from .models import Booking, Service

class BookingSerializer(serializers.ModelSerializer):
    # Add this line to handle the token from the frontend
    turnstile_token = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Booking
        fields = [
            'id', 'full_name', 'email', 'phone', 'service', 
            'date', 'time', 'notes', 'created_at', 'status', 
            'turnstile_token' # Include it here
        ]
        read_only_fields = ['id', 'created_at', 'status']

    def create(self, validated_data):
        # Remove the token before saving to the database
        validated_data.pop('turnstile_token', None)
        return super().create(validated_data)

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'