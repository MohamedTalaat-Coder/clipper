from django.shortcuts import render
from django.views.generic import ListView, CreateView, DeleteView
from .models import Clipboard


# Create your views here.

class IndexView(ListView):
    template_name = "clipboard/index.html"
    model = Clipboard

    def get_queryset(self):
        return Clipboard.objects.all()
