# chat/routing.py
from django.urls import re_path

from .django_channel_consumers import VideoConsumer

websocket_urlpatterns = [
   re_path(r"video/(?P<room_name>\w+)/$", VideoConsumer.as_asgi()),
]