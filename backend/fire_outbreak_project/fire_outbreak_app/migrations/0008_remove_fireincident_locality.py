# Generated by Django 5.0.3 on 2024-05-26 07:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fire_outbreak_app', '0007_alter_firehydrants_geom_alter_fireincident_location_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fireincident',
            name='locality',
        ),
    ]
