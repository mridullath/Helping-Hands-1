
from django.db import models

class HandSign(models.Model):
    text = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='hand_signs/')

    def __str__(self):
        return self.text