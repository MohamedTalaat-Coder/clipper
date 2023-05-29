from django.db import models


class Section(models.Model):
    section = models.CharField(max_length=64)


class Clipboard(models.Model):
    key = models.CharField(max_length=64)
    value = models.TextField()
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
