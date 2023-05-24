from django.db import models


class Clipboard(models.Model):
    key = models.CharField(max_length=64)
    value = models.TextField()
    section = models.CharField(max_length=64)
