import json
import requests
import networkx as nx
from django.contrib.gis.geos import Point,Polygon
from django.contrib.gis.db.models.functions import Distance
from .models import FireStations, FireHydrants,Roads  # Assuming these are your models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from scipy.spatial import KDTree
from django.core.cache import cache
from asgiref.sync import sync_to_async

# def get_from_cache(key):
#     cached_data = cache.get(key)
#     if cached_data:
#         return json.loads(cached_data)
#     return None

# def save_to_cache(key, data):
#     cache.set(key, json.dumps(data),timeout=3600)

# def fetch_overpass_osm_road_data(map_bounds):
#     south, west, north, east = map_bounds['south'], map_bounds['west'], map_bounds['north'], map_bounds['east']
#     overpass_query = f"""
#     [out:json];
#     (
#         way({south},{west},{north},{east})["highway"];
#     );
#     (._;>;);
#     out body;
#     """
#     try:
#         cached_data = get_from_cache(overpass_query)
#         if cached_data:
#             print("Using Overpass data from cache")
#             return convert_to_geojson(cached_data)
#         else:
#             response = requests.post(
#                 'https://overpass-api.de/api/interpreter',
#                 data={'data': overpass_query},
#                 headers={'Content-Type': 'application/x-www-form-urlencoded'}
#             )
#             response.raise_for_status()
#             print("Using Overpass data from overpass osm api")
#             overpass_data = response.json()
#             save_to_cache(overpass_query, overpass_data)
#             return convert_to_geojson(overpass_data)

#     except requests.exceptions.RequestException as e:
#         print("Overpass error", e)
#         return "overpass request not successful"

# def convert_to_geojson(overpass_data):
#     nodes = {element['id']: element for element in overpass_data['elements'] if element['type'] == 'node'}
#     features = [
#         {
#             "type": "Feature",
#             "geometry": {
#                 "type": "LineString",
#                 "coordinates": [
#                     [nodes[node]['lon'], nodes[node]['lat']] for node in element['nodes']
#                 ]
#             },
#             "properties": element.get('tags', {})
#         }
#         for element in overpass_data['elements'] if element['type'] == 'way'
#     ]
#     geojson = {
#         "type": "FeatureCollection",
#         "features": features
#     }

#     return geojson

# def get_fire_stations_and_hydrants(bounds):
#     south, west, north, east = bounds['south'], bounds['west'], bounds['north'], bounds['east']
#     bounding_box = Polygon.from_bbox((west, south, east, north))
#     fire_stations = FireStations.objects.filter(geom__within=bounding_box)
#     fire_hydrants = FireHydrants.objects.filter(geom__within=bounding_box)
#     return fire_stations, fire_hydrants

# def create_graph_from_geojson(geojson_data):
#     G = nx.Graph()
#     for feature in geojson_data['features']:
#         coords = feature['geometry']['coordinates']
#         for i in range(len(coords) - 1):
#             point1 = tuple(coords[i])
#             point2 = tuple(coords[i + 1])
#             G.add_edge(point1, point2, weight=distance(point1, point2))
#     return G

# def distance(point1, point2):
#     return ((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2) ** 0.5

# def find_nearest_node(graph, point):
#     tree = KDTree([node for node in graph.nodes])
#     _, idx = tree.query(point)
#     return list(graph.nodes)[idx]

# def calculate_optimal_path(graph, source, destinations):
#     source = (source.x, source.y)
#     optimal_path = None
#     min_distance = float('inf')
#     for dest in destinations:
#         dest_point = (dest.geom.x, dest.geom.y)
#         try:
#             nearest_source = find_nearest_node(graph, source)
#             nearest_dest = find_nearest_node(graph, dest_point)
#             path = nx.shortest_path(graph, nearest_source, nearest_dest, weight='weight')
#             path_length = nx.shortest_path_length(graph, nearest_source, nearest_dest, weight='weight')
#             if path_length < min_distance:
#                 min_distance = path_length
#                 optimal_path = path
#         except nx.NetworkXNoPath:
#             continue
#     return optimal_path, min_distance


# def get_from_cache(key):
#     cached_data = cache.get(key)
#     if cached_data:
#         return json.loads(cached_data)
#     return None

# def save_to_cache(key, data):
#     cache.set(key, json.dumps(data), timeout=3600)

# def fetch_road_data_from_db(map_bounds):
#     south, west, north, east = map_bounds['south'], map_bounds['west'], map_bounds['north'], map_bounds['east']
#     bounding_box = Polygon.from_bbox((west, south, east, north))
    
#     try:
#         cache_key = f"roads_{south}_{west}_{north}_{east}"
#         cached_data = get_from_cache(cache_key)
#         if cached_data:
#             print("Using road data from cache")
#             return cached_data
#         else:
#             road_data = Roads.objects.filter(geom__intersects=bounding_box)
#             road_data_list = [
#                 {
#                     'id': road.id,
#                     'geom': list(road.geom.coords),
#                     'u': road.u,
#                     'v': road.v,
#                     'key': road.key,
#                     'osmid': road.osmid,
#                     'name': road.name,
#                     'highway': road.highway,
#                     'oneway': road.oneway,
#                     'reversed': road.reversed,
#                     'length': road.length,
#                     'lanes': road.lanes,
#                     'ref': road.ref,
#                     'junction': road.junction,
#                     'bridge': road.bridge,
#                     'maxspeed': road.maxspeed,
#                     'service': road.service,
#                     'tunnel': road.tunnel,
#                     'access': road.access
#                 } for road in road_data
#             ]
#             save_to_cache(cache_key, road_data_list)
#             print("Using road data from database")
#             return road_data_list
#     except Exception as e:
#         print("Database error", e)
#         return "database request not successful"

# def convert_to_geojson(road_data):
#     features = [
#         {
#             "type": "Feature",
#             "geometry": {
#                 "type": "LineString",
#                 "coordinates": element['geom']
#             },
#             "properties": {key: value for key, value in element.items() if key != 'geom'}
#         }
#         for element in road_data
#     ]
    
#     geojson = {
#         "type": "FeatureCollection",
#         "features": features
#     }

#     return geojson

# def get_fire_stations_and_hydrants(bounds):
#     south, west, north, east = bounds['south'], bounds['west'], bounds['north'], bounds['east']
#     bounding_box = Polygon.from_bbox((west, south, east, north))
#     fire_stations = FireStations.objects.filter(geom__within=bounding_box)
#     fire_hydrants = FireHydrants.objects.filter(geom__within=bounding_box)
#     return fire_stations, fire_hydrants

# def create_graph_from_geojson(geojson_data):
#     G = nx.Graph()
#     for feature in geojson_data['features']:
#         coords = feature['geometry']['coordinates']
#         for i in range(len(coords) - 1):
#             point1 = tuple(coords[i])
#             point2 = tuple(coords[i + 1])
#             G.add_edge(point1, point2, weight=distance(point1, point2))
#     return G

# def distance(point1, point2):
#     return ((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2) ** 0.5

# def find_nearest_node(graph, point):
#     tree = KDTree([node for node in graph.nodes])
#     _, idx = tree.query(point)
#     return list(graph.nodes)[idx]

# def calculate_optimal_path(graph, source, destinations):
#     source = (source.x, source.y)
#     optimal_path = None
#     min_distance = float('inf')
#     for dest in destinations:
#         dest_point = (dest.geom.x, dest.geom.y)
#         try:
#             nearest_source = find_nearest_node(graph, source)
#             nearest_dest = find_nearest_node(graph, dest_point)
#             path = nx.shortest_path(graph, nearest_source, nearest_dest, weight='weight')
#             path_length = nx.shortest_path_length(graph, nearest_source, nearest_dest, weight='weight')
#             if path_length < min_distance:
#                 min_distance = path_length
#                 optimal_path = path
#         except nx.NetworkXNoPath:
#             continue
#     return optimal_path, min_distance



async def get_from_cache(key):
    cached_data = await sync_to_async(cache.get)(key)
    if cached_data:
        return json.loads(cached_data)
    return None

async def save_to_cache(key, data):
    await sync_to_async(cache.set)(key, json.dumps(data), timeout=3600)

@sync_to_async
def query_road_data_from_db(bounding_box):
    return Roads.objects.filter(geom__intersects=bounding_box)

async def fetch_road_data_from_db(map_bounds):
    south, west, north, east = map_bounds['south'], map_bounds['west'], map_bounds['north'], map_bounds['east']
    bounding_box = Polygon.from_bbox((west, south, east, north))
    
    try:
        cache_key = f"roads_{south}_{west}_{north}_{east}"
        cached_data = await get_from_cache(cache_key)
        if cached_data:
            print("Using road data from cache")
            return cached_data
        else:
            road_data = await query_road_data_from_db(bounding_box)
            road_data_list = [
                {
                    'id': road.id,
                    'geom': list(road.geom.coords),
                    'u': road.u,
                    'v': road.v,
                    'key': road.key,
                    'osmid': road.osmid,
                    'name': road.name,
                    'highway': road.highway,
                    'oneway': road.oneway,
                    'reversed': road.reversed,
                    'length': road.length,
                    'lanes': road.lanes,
                    'ref': road.ref,
                    'junction': road.junction,
                    'bridge': road.bridge,
                    'maxspeed': road.maxspeed,
                    'service': road.service,
                    'tunnel': road.tunnel,
                    'access': road.access
                } for road in await sync_to_async(list)(road_data)  # Converting the queryset to a list in a synchronous context
            ]
            await save_to_cache(cache_key, road_data_list)
            print("Using road data from database")
            return road_data_list
    except Exception as e:
        print("Database error", e)
        return "database request not successful"

@sync_to_async
def convert_to_geojson(road_data):
    features = [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": element['geom']
            },
            "properties": {key: value for key, value in element.items() if key != 'geom'}
        }
        for element in road_data
    ]
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    return geojson

@sync_to_async
def query_fire_stations(bounding_box):
    return list(FireStations.objects.filter(geom__within=bounding_box))

@sync_to_async
def query_fire_hydrants(bounding_box):
    return list(FireHydrants.objects.filter(geom__within=bounding_box))

async def get_fire_stations_and_hydrants(bounds):
    south, west, north, east = bounds['south'], bounds['west'], bounds['north'], bounds['east']
    bounding_box = Polygon.from_bbox((west, south, east, north))
    fire_stations = await query_fire_stations(bounding_box)
    fire_hydrants = await query_fire_hydrants(bounding_box)
    print("",fire_hydrants,fire_stations)
    return fire_stations, fire_hydrants

@sync_to_async
def create_graph_from_geojson(geojson_data):
    G = nx.Graph()
    for feature in geojson_data['features']:
        coords = feature['geometry']['coordinates']
        for i in range(len(coords) - 1):
            point1 = tuple(coords[i])
            point2 = tuple(coords[i + 1])
            G.add_edge(point1, point2, weight=distance(point1, point2))
    return G

def distance(point1, point2):
    return ((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2) ** 0.5

@sync_to_async
def find_nearest_node(graph, point):
    tree = KDTree([node for node in graph.nodes])
    _, idx = tree.query(point)
    return list(graph.nodes)[idx]


async def calculate_optimal_path(graph, source, destinations):
    source = (source.x, source.y)
    optimal_path = None
    min_distance = float('inf')
    for dest in destinations:
        dest_point = (dest.geom.x, dest.geom.y)
        try:
            nearest_source = await find_nearest_node(graph, source)
            nearest_dest = await find_nearest_node(graph, dest_point)
            path = nx.shortest_path(graph, nearest_source, nearest_dest, weight='weight')
            path_length = nx.shortest_path_length(graph, nearest_source, nearest_dest, weight='weight')
            if path_length < min_distance:
                min_distance = path_length
                optimal_path = path
        except nx.NetkworXNoPath:
            continue
    return optimal_path, min_distance

def format_path_as_geojson(path):
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": path
        },
        "properties": {}
    }