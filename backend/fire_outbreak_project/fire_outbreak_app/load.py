from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import Roads

roads_mapping = {
    'u': 'u',
    'v': 'v',
    'key': 'key',
    'osmid': 'osmid',
    'name': 'name',
    'highway': 'highway',
    'oneway': 'oneway',
    'reversed': 'reversed',
    'length': 'length',
    'lanes': 'lanes',
    'ref': 'ref',
    'junction': 'junction',
    'bridge': 'bridge',
    'maxspeed': 'maxspeed',
    'service': 'service',
    'tunnel': 'tunnel',
    'access': 'access',
    'geom': 'LINESTRING',
}
road_shp = Path(__file__).resolve().parent / "road_data" / "clipped_road_network.shp"



def run(verbose=True):
    lm = LayerMapping(Roads, road_shp, roads_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)