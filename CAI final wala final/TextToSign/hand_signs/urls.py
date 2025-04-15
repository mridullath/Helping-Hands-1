from django.urls import path
from .views import convert_statement

urlpatterns = [
    path('', convert_statement, name='convert_statement'),  # Home page for the form
]