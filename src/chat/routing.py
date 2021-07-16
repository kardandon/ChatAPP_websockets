from django.conf.urls import url
from django.core.asgi import get_asgi_application 

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator

from chat.consumer import ChatConsumer

application = ProtocolTypeRouter({
    "http": get_asgi_application(), 
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                url(r"^messages/(?P<username>[\w.@+-]+)/$", ChatConsumer.as_asgi()),
           ])
        )
    )
})