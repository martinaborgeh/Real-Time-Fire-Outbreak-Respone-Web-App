# Generated by Django 5.0.3 on 2024-06-17 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fire_outbreak_app', '0015_overpass_roads_remove_roads_geom_gist_idx_roads_and_more'),
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
