# Generated by Django 5.0.3 on 2024-05-23 06:27

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fire_outbreak_app', '0002_roads_access_roads_bridge_roads_highway_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roads',
            name='geometry',
            field=django.contrib.gis.db.models.fields.GeometryField(srid=4326),
        ),
    ]
