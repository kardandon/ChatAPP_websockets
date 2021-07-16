import asyncio
import json
from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Thread, ChatMessage

class ChatConsumer(AsyncWebsocketConsumer):
    async def websocket_connect(self, event):
        print("connected", event)
        await self.accept()
        other = self.scope["url_route"]["kwargs"]["username"]
        user = self.scope["user"]
        self.thread_obj = await self.get_thread(user, other)
        self.chat_room = f"thread_{self.thread_obj.id}"
        await self.channel_layer.group_add(
            self.chat_room,
            self.channel_name,
        )

    async def websocket_receive(self, event):
        print("receive", event)
        text = event.get('text', None)
        user = self.scope["user"]
        if text is not None and user.is_authenticated:
            response = {
                "message": text,
                "username": user.username,
            }
            await self.create_chat_message(user = user, message=text)
            event = {
                "type": "chatmessage",
                "text": json.dumps(response),
            }
            await self.channel_layer.group_send(
                self.chat_room,
                event,
            )
    async def chatmessage(self, event):
        front_response = event.get('text', None)
        await self.send(json.dumps(
                {
                    "type": "websocket.send",
                    "text": front_response,
                })
            )
    async def websocket_disconnect(self, event):
        print("disconnected", event)

    @database_sync_to_async
    def get_thread(self, user, other):
        return Thread.objects.get_or_new(user, other)[0]

    @database_sync_to_async
    def create_chat_message(self, user, message):
        return ChatMessage.objects.create(thread=self.thread_obj, user=user, message=message)