from django.shortcuts import render
from django.views.generic import ListView, CreateView, DeleteView
from .models import Clipboard, Section
from django.http import JsonResponse
import json


# Create your views here.

class IndexView(ListView):
    template_name = "clipboard/index.html"
    model = Clipboard
    context_object_name = "sections"

    def get_queryset(self):
        return Section.objects.all()


class SectionClipboard(ListView):
    model = Clipboard
    template_name = "clipboard/index.html"
    context_object_name = "sections"

    def post(self, request, *args, **kwargs):
        clipboards = self.get_queryset()
        return JsonResponse({"success": True, "clipboards": list(clipboards.values())})

    def get_queryset(self):
        section = json.loads(self.request.body)['section']
        return self.model.objects.filter(section=section)


class CreateSection(CreateView):
    model = Section
    success_url = "/"
    fields = ['section']

    def post(self, request, *args, **kwargs):
        section = request.POST.get("section")
        new_section = self.model.objects.create(section=section)
        data = {
            "success": True,
            "section": new_section.section,
            "section_id": new_section.id
        }
        return JsonResponse(data)


class AddToSection(CreateView):
    model = Clipboard
    fields = ['key', 'value', 'section_id']
