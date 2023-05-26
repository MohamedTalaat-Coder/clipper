from django.shortcuts import render
from django.views.generic import ListView, CreateView, DeleteView
from .models import Clipboard, Section


# Create your views here.

class IndexView(ListView):
    template_name = "clipboard/index.html"
    model = Clipboard
    context_object_name = "clipboards"

    def get_queryset(self):
        return Section.objects.all()


class SectionCliboard(ListView):
    model = Clipboard
    template_name = "clipboard/index.html"
    context_object_name = "clipboards"

    def get_queryset(self):
        section = self.kwargs['section']
        print("section -->", section)


class CreateSection(CreateView):
    model = Section
    success_url = "/"
    fields = ['section']


class AddToSection(CreateView):
    model = Clipboard
    fields = ['key', 'value', 'section_id']
