from chat.consumer import ChatConsumer
import os

import django
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from channels.auth import AuthMiddlewareStack
from django.conf.urls import url
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  'websocket': AllowedHostsOriginValidator(
      AuthMiddlewareStack(
          URLRouter(
              [url(r"^messages/(?P<username>[\w.@+-]+)$", ChatConsumer().as_asgi())]
          )
      )
  ),
})
