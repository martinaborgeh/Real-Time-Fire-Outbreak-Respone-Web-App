# Generated by Django 5.0.3 on 2024-05-26 11:18

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fire_outbreak_app', '0011_alter_firestations_geom'),
    ]

    operations = [
        migrations.AlterField(
            model_name='firestations',
            name='geom',
            field=django.contrib.gis.db.models.fields.PointField(srid=4326),
        ),
    ]