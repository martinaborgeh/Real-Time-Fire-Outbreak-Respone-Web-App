# chat/routing.py
from django.urls import re_path

from .django_channel_consumers import NotificationConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", NotificationConsumer.as_asgi()),
]