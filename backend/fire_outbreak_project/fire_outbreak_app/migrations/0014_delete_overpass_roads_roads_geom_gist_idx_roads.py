# Generated by Django 5.0.3 on 2024-06-16 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fire_outbreak_app', '0013_overpass_roads_alter_firestations_geom'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Overpass_Roads',
        ),
        migrations.AddIndex(
            model_name='roads',
            index=models.Index(fields=['geom'], name='geom_gist_idx_roads', opclasses=['gist']),
        ),
    ]
