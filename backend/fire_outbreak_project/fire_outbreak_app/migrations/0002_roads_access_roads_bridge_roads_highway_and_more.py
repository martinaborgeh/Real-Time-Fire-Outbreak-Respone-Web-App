# Generated by Django 5.0.3 on 2024-05-23 06:24

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fire_outbreak_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='roads',
            name='access',
            field=models.CharField(default=0, max_length=100, verbose_name='Access'),
        ),
        migrations.AddField(
            model_name='roads',
            name='bridge',
            field=models.CharField(default=0, max_length=100, verbose_name='Bridge'),
        ),
        migrations.AddField(
            model_name='roads',
            name='highway',
            field=models.CharField(default=0, max_length=100, verbose_name='Highway Name'),
        ),
        migrations.AddField(
            model_name='roads',
            name='junction',
            field=models.CharField(default=0, max_length=100, verbose_name='Junction'),
        ),
        migrations.AddField(
            model_name='roads',
            name='key',
            field=models.IntegerField(default=0, verbose_name='Unique Edge Identifier'),
        ),
        migrations.AddField(
            model_name='roads',
            name='lanes',
            field=models.CharField(default=0, max_length=100, verbose_name='Lanes'),
        ),
        migrations.AddField(
            model_name='roads',
            name='length',
            field=models.FloatField(default=0, max_length=100, verbose_name='Length'),
        ),
        migrations.AddField(
            model_name='roads',
            name='maxspeed',
            field=models.CharField(default=0, max_length=100, verbose_name='Maximum Speed'),
        ),
        migrations.AddField(
            model_name='roads',
            name='oneway',
            field=models.IntegerField(default=0, verbose_name='One way'),
        ),
        migrations.AddField(
            model_name='roads',
            name='osmid',
            field=models.CharField(default=0, max_length=100, verbose_name='Open StreetMap Identifier'),
        ),
        migrations.AddField(
            model_name='roads',
            name='ref',
            field=models.CharField(default=0, max_length=100, verbose_name='Ref'),
        ),
        migrations.AddField(
            model_name='roads',
            name='reversed',
            field=models.CharField(default=0, max_length=100, verbose_name='Reversed'),
        ),
        migrations.AddField(
            model_name='roads',
            name='service',
            field=models.CharField(default=0, max_length=100, verbose_name='Service'),
        ),
        migrations.AddField(
            model_name='roads',
            name='tunnel',
            field=models.CharField(default=0, max_length=100, verbose_name='Tunnels'),
        ),
        migrations.AddField(
            model_name='roads',
            name='u',
            field=models.IntegerField(default=0, verbose_name='Start Node'),
        ),
        migrations.AddField(
            model_name='roads',
            name='v',
            field=models.IntegerField(default=0, verbose_name='End Node'),
        ),
        migrations.AlterField(
            model_name='roads',
            name='geometry',
            field=django.contrib.gis.db.models.fields.GeometryField(default=0, srid=4326),
        ),
        migrations.AlterField(
            model_name='roads',
            name='name',
            field=models.CharField(default=0, max_length=100, verbose_name='Road Name'),
        ),
    ]