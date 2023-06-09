from django.shortcuts import render, redirect
from django.views.generic import ListView, CreateView, DeleteView, UpdateView
from .models import Clipboard, Section
from django.http import JsonResponse
import json
from django.core.cache import cache


# Create your views here.

class IndexView(ListView):
    template_name = "clipboard/index.html"
    model = Clipboard
    context_object_name = "sections"

    def get_queryset(self):
        queryset = cache.get("sections_list", None)
        if queryset is None:
            queryset = Section.objects.all()
            cache.set("sections_list", queryset)
        return queryset


class SectionClipboard(ListView):
    model = Clipboard
    template_name = "clipboard/index.html"
    context_object_name = "clipboards"

    def post(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        sections = queryset['sections']
        clipboards = queryset['clipboards']
        return JsonResponse({
            "success": True,
            "clipboards": list(clipboards.values()),
            "sections": list(sections.values()),
            "section": kwargs['id'],
        })

    def get_queryset(self):
        section = self.kwargs['id']
        sections = cache.get("sections_list", None)
        if sections is None:
            sections = Section.objects.all()
        clipboards = Clipboard.objects.filter(section=section)
        return {
            "sections": sections,
            "clipboards": clipboards
        }

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        queryset = self.get_queryset()
        context['sections'] = queryset['sections']
        context['clipboards'] = queryset['clipboards']
        return context


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

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        if not data['value'] or not data['key']:
            return JsonResponse({"success": False})
        print(data['section'])
        section = Section.objects.get(id=data['section'])
        clipboard = Clipboard.objects.create(section=section, key=data['key'], value=data['value'])
        return JsonResponse({"success": True, "key": data['key'], "value": data['value'], "id": clipboard.id})


class DeleteClipboard(DeleteView):
    model = Clipboard

    def delete(self, request, *args, **kwargs):
        self.get_object().delete()
        return JsonResponse({"success": True})

    def get_object(self, queryset=None):
        print("-->", self.kwargs['clipboard'])
        return Clipboard.objects.get(id=self.kwargs['clipboard'])


class DeleteSection(DeleteView):
    model = Section

    def get_object(self):
        section_id = self.kwargs.get("section")
        print("wwe", section_id)
        return Section.objects.get(id=section_id)

    def delete(self, request, *args, **kwargs):
        self.get_object().delete()
        return JsonResponse({"success": True})
