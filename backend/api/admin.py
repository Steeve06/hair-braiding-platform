from django.contrib import admin
from .models import Booking, Service

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'service', 'date', 'time', 'status', 'created_at')
    list_filter = ('status', 'date')
    search_fields = ('full_name', 'email', 'phone', 'service')
    ordering = ('-created_at',)
    list_editable = ('status',)
    readonly_fields = ('created_at',)
    
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'duration', 'order', 'is_active')
    list_editable = ('price', 'duration', 'order', 'is_active')