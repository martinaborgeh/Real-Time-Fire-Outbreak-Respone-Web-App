from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import Roads

# roads_mapping = {
#     'u': 'u',
#     'v': 'v',
#     'key': 'key',
#     'osmid': 'osmid',
#     'name': 'name',
#     'highway': 'highway',
#     'oneway': 'oneway',
#     'reversed': 'reversed',
#     'length': 'length',
#     'lanes': 'lanes',
#     'ref': 'ref',
#     'junction': 'junction',
#     'bridge': 'bridge',
#     'maxspeed': 'maxspeed',
#     'service': 'service',
#     'tunnel': 'tunnel',
#     'access': 'access',
#     'geom': 'LINESTRING',
# }

roads_mapping = {
   
    'osmid': 'osm_id',
    'name': 'name',
    'highway': 'fclass',
    'oneway': 'oneway',
    'ref': 'ref',
    'bridge': 'bridge',
    'maxspeed': 'maxspeed',
    'tunnel': 'tunnel',
    'geom': 'LINESTRING',
}
road_shp = Path(__file__).resolve().parent / "road_data" / "ghana_osm_road_free_updated_new.shp"



def run(verbose=True):
    lm = LayerMapping(Roads, road_shp, roads_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)