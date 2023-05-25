from django.shortcuts import render
from django.views.generic import ListView, CreateView, DeleteView
from .models import Clipboard


# Create your views here.

class IndexView(ListView):
    template_name = "clipboard/index.html"
    model = Clipboard

    def get_queryset(self):
        return Clipboard.objects.all()


class CreateSection(CreateView):
    def post(self, request, *args, **kwargs):
        print("create section")


class AddToSection(CreateView):
    def post(self, request, *args, **kwargs):
        print("add to section")
