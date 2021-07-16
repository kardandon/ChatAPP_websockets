from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Q

DEFAULT_PIC = "https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg"

class User(AbstractUser):
    profilepic_url = models.CharField(max_length=128, default=DEFAULT_PIC)

class ThreadManager(models.Manager):
    def thread_data(self, user1, user2):
        qlookup = (Q(first=user1) | Q(second=user1)) &(Q(first=user2) | Q(second=user2))
        qlookup2 = (Q(first=user1) & Q(second=user1)) |(Q(first=user2) & Q(second=user2))
        qs = self.get_queryset().filter(qlookup).exclude(qlookup2).distinct()
        return ChatMessage.serialize(qs.first())

    def get_or_new(self, user, other_username): # get_or_create
        username = user.username
        if username == other_username:
            return None
        qlookup1 = Q(first__username=username) & Q(second__username=other_username)
        qlookup2 = Q(first__username=other_username) & Q(second__username=username)
        qs = self.get_queryset().filter(qlookup1 | qlookup2).distinct()
        if qs.count() == 1:
            return qs.first(), False
        elif qs.count() > 1:
            return qs.order_by('timestamp').first(), False
        else:
            user2 = User.objects.get(username=other_username)
            if user != user2:
                obj = self.model(
                        first=user, 
                        second=user2
                    )
                obj.save()
                return obj, True
            return None, False


class Thread(models.Model):
    first        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_thread_first')
    second       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_thread_second')
    updated      = models.DateTimeField(auto_now=True)
    timestamp    = models.DateTimeField(auto_now_add=True)
    
    objects      = ThreadManager()

    @property
    def room_group_name(self):
        return f'chat_{self.id}'

class ChatMessage(models.Model):
    thread      = models.ForeignKey(Thread, null=True, blank=True, on_delete=models.SET_NULL)
    user        = models.ForeignKey(User, verbose_name='sender', on_delete=models.CASCADE)
    message     = models.TextField()
    timestamp   = models.DateTimeField(auto_now_add=True)

    def serialize(thread):
        return [{"username": chat.user.username, "message": chat.message} for chat in ChatMessage.objects.filter(thread=thread).order_by("timestamp").all()]