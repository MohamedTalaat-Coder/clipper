# Generated by Django 4.2.1 on 2023-05-26 18:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clipboard', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section', models.CharField(max_length=64)),
            ],
        ),
        migrations.RemoveField(
            model_name='clipboard',
            name='section',
        ),
        migrations.AddField(
            model_name='clipboard',
            name='section',
            field=models.ManyToManyField(to='clipboard.section'),
        ),
    ]
