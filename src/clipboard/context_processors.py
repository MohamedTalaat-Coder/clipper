from .models import Section


def my_context_processor(request):
    sections = Section.objects.all()
    return {'sections': sections}
