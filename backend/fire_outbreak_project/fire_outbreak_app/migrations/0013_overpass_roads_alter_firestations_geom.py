# Generated by Django 5.0.3 on 2024-06-10 09:08

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fire_outbreak_app', '0012_alter_firestations_geom'),
    ]

    operations = [
        migrations.CreateModel(
            name='Overpass_Roads',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('u', models.BigIntegerField()),
                ('v', models.BigIntegerField()),
                ('key', models.BigIntegerField()),
                ('osmid', models.CharField(max_length=80)),
                ('name', models.CharField(max_length=80)),
                ('highway', models.CharField(max_length=80)),
                ('oneway', models.IntegerField()),
                ('reversed', models.CharField(max_length=80)),
                ('length', models.FloatField()),
                ('lanes', models.CharField(max_length=80)),
                ('ref', models.CharField(max_length=80)),
                ('junction', models.CharField(max_length=80)),
                ('bridge', models.CharField(max_length=80)),
                ('maxspeed', models.CharField(max_length=80)),
                ('service', models.CharField(max_length=80)),
                ('tunnel', models.CharField(max_length=80)),
                ('access', models.CharField(max_length=80)),
                ('geom', django.contrib.gis.db.models.fields.LineStringField(srid=4326)),
            ],
        ),
        migrations.AlterField(
            model_name='firestations',
            name='geom',
            field=django.contrib.gis.db.models.fields.PointField(default=django.contrib.gis.geos.point.Point(0.0, 0.0), srid=4326),
        ),
    ]
