from django.db import models

class Booking(models.Model):
    # Basic Information
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    
    # Service Selection (Frontend sends the service title as a string)
    service = models.CharField(max_length=255)
    
    # Date and Time
    date = models.DateField()
    time = models.TimeField()
    
    # Optional Details
    notes = models.TextField(blank=True, null=True)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, 
        choices=[
            ('pending', 'Pending'), 
            ('confirmed', 'Confirmed'),
            ('rejected', 'Rejected')
        ], 
        default='pending'
    )

    def __str__(self):
        return f"{self.full_name} - {self.service} ({self.date})"

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=20) # e.g., "2 hours"
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title