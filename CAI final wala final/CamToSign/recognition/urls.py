from django.urls import path
from .views import home, recognition, video_feed, get_sign, stop_video

urlpatterns = [
    path('', home, name="home"),
    
    path('recognition/', recognition, name="recognition"),
    path('video_feed/', video_feed, name="video_feed"),
    path('get_sign/', get_sign, name="get_sign"),
    path('stop_video/', stop_video, name="stop_video"),
]
