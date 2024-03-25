# Generated by Django 5.0.3 on 2024-03-22 00:20

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FireHydrants',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('region', models.CharField(max_length=100, verbose_name='Region')),
                ('district', models.CharField(max_length=100, verbose_name='District')),
                ('locality', models.CharField(max_length=100, verbose_name='Locality')),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='FireIncident',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('region', models.CharField(max_length=100, verbose_name='Region')),
                ('district', models.CharField(max_length=100, verbose_name='District')),
                ('locality', models.CharField(max_length=100, verbose_name='Locality')),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='FireStations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('region', models.CharField(max_length=100, verbose_name='Region')),
                ('district', models.CharField(max_length=100, verbose_name='District')),
                ('locality', models.CharField(max_length=100, verbose_name='Locality')),
                ('emergency_phone_number', models.PositiveIntegerField(verbose_name='Emergency Phone Number')),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Roads',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('geometry', django.contrib.gis.db.models.fields.LineStringField(srid=4326)),
            ],
        ),
    ]
