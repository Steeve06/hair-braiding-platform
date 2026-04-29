from django.db import models

class Booking(models.Model):
    # Use 255 to be safe against long names/service titles
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30) # Phone numbers can vary
    service = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    
    # Ensure these are truly optional in the DB
    notes = models.TextField(blank=True, null=True)
    
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
        return f"{self.full_name} - {self.service}"