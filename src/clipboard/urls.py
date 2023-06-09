"""
URL configuration for clipper project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .views import *
urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("create/", CreateSection.as_view(), name="create_section"),
    path("<str:section>/add/", AddToSection.as_view(), name="add_to_section"),
    path("<int:id>/", SectionClipboard.as_view(), name="clipboards"),
    path("<int:section>/<int:clipboard>/delete", DeleteClipboard.as_view(), name="delete_clipboard"),
    path("<int:section>/delete", DeleteSection.as_view(), name="delete_section")
]
