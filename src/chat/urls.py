from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path("messages/<str:username>", views.chat, name="username"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]