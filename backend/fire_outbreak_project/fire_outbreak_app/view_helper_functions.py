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





# async def get_from_cache(key):
#     cached_data = await cache.aget(key)
#     if cached_data:
#         return json.loads(cached_data)
#     return None

# async def save_to_cache(key, data):
#     await cache.aset(key, json.dumps(data), timeout=3600)

# @sync_to_async
# def query_road_data_from_db(bounding_box):
#     return Roads.objects.filter(geom__intersects=bounding_box)

# async def fetch_road_data_from_db(map_bounds):
#     south, west, north, east = map_bounds['south'], map_bounds['west'], map_bounds['north'], map_bounds['east']
#     bounding_box = Polygon.from_bbox((west, south, east, north))
    
#     try:
#         cache_key = f"roads_{south}_{west}_{north}_{east}"
#         cached_data = await get_from_cache(cache_key)
#         if cached_data:
#             print("Using road data from cache")
#             return cached_data
#         else:
#             road_data = await query_road_data_from_db(bounding_box)
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
#                 } for road in await sync_to_async(list)(road_data)  # Converting the queryset to a list in a synchronous context
#             ]
#             await save_to_cache(cache_key, road_data_list)
#             print("Using road data from database")
#             return road_data_list
#     except Exception as e:
#         print("Database error", e)
#         return "database request not successful"

# @sync_to_async
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

# @sync_to_async
# def query_fire_stations(bounding_box):
#     return list(FireStations.objects.filter(geom__within=bounding_box))

# @sync_to_async
# def query_fire_hydrants(bounding_box):
#     return list(FireHydrants.objects.filter(geom__within=bounding_box))

# async def get_fire_stations_and_hydrants(bounds):
#     south, west, north, east = bounds['south'], bounds['west'], bounds['north'], bounds['east']
#     bounding_box = Polygon.from_bbox((west, south, east, north))
#     fire_stations = await query_fire_stations(bounding_box)
#     fire_hydrants = await query_fire_hydrants(bounding_box)
#     print("",fire_hydrants,fire_stations)
#     return fire_stations, fire_hydrants

# @sync_to_async
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

# @sync_to_async
# def find_nearest_node(graph, point):
#     tree = KDTree([node for node in graph.nodes])
#     _, idx = tree.query(point)
#     return list(graph.nodes)[idx]


# async def calculate_optimal_path(graph, source, destinations):
#     source = (source.x, source.y)
#     optimal_path = None
#     min_distance = float('inf')
#     for dest in destinations:
#         dest_point = (dest.geom.x, dest.geom.y)
#         try:
#             nearest_source = await find_nearest_node(graph, source)
#             nearest_dest = await find_nearest_node(graph, dest_point)
#             path = nx.shortest_path(graph, nearest_source, nearest_dest, weight='weight')
#             path_length = nx.shortest_path_length(graph, nearest_source, nearest_dest, weight='weight')
#             if path_length < min_distance:
#                 min_distance = path_length
#                 optimal_path = path
#         except nx.NetkworXNoPath:
#             continue
#     return optimal_path, min_distance

# def format_path_as_geojson(path):
#     return {
#         "type": "Feature",
#         "geometry": {
#             "type": "LineString",
#             "coordinates": path
#         },
#         "properties": {}
#     }

# def format_points_as_geojson(points):
#     features = [
#         {
#             "type": "Feature",
#             "geometry": {
#                 "type": "Point",
#                 "coordinates": [point.x, point.y]
#             },
#             "properties": {}  # You can add properties here if needed
#         }
#         for point in points
#     ]
    
#     return {
#         "type": "FeatureCollection",
#         "features": features
#     }


async def get_from_cache(key):
    cached_data = await cache.aget(key)
    if cached_data:
        return json.loads(cached_data)
    return None

async def save_to_cache(key, data):
    await cache.aset(key, json.dumps(data), timeout=3600)

@sync_to_async
def query_road_data_from_db(bounding_box):
    return list(Roads.objects.filter(geom__intersects=bounding_box))

@sync_to_async
def query_fire_hydrants(bounding_box):
    return list(FireHydrants.objects.filter(geom__within=bounding_box))

@sync_to_async
def query_fire_stations(bounding_box):
    return list(FireStations.objects.filter(geom__within=bounding_box))

async def get_fire_stations_and_hydrants(bounds):
    south, west, north, east = bounds['south'], bounds['west'], bounds['north'], bounds['east']
    bounding_box = Polygon.from_bbox((west, south, east, north))
    fire_stations = await query_fire_stations(bounding_box)
    fire_hydrants = await query_fire_hydrants(bounding_box)
    print("",fire_hydrants,fire_stations)
    return fire_stations, fire_hydrants

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

def format_path_as_geojson(path):
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": path
        },
        "properties": {}
    }

def format_points_as_geojson(points):
    features = []
    for point in points:
        properties = {
            'region': point.region if hasattr(point, 'region') else None,
            'district': point.district if hasattr(point, 'district') else None,
            'emergency_phone_number': point.emergency_phone_number if hasattr(point, 'emergency_phone_number') else None,
            'location': point.location,
            'station_id': point.station_id,
            'number_of_staff': point.number_of_staff if hasattr(point, 'number_of_staff') else None,
            'number_of_fire_tender': point.number_of_fire_tender if hasattr(point, 'number_of_fire_tender') else None,
            'number_of_water_tanker': point.number_of_water_tanker if hasattr(point, 'number_of_water_tanker') else None,
            'number_of_timetable_ladder': point.number_of_timetable_ladder if hasattr(point, 'number_of_timetable_ladder') else None,
            'number_of_recovery_track': point.number_of_recovery_track if hasattr(point, 'number_of_recovery_track') else None,
            'number_of_portable_pumb': point.number_of_portable_pumb if hasattr(point, 'number_of_portable_pumb') else None,
            'number_of_deep_lift_pumb': point.number_of_deep_lift_pumb if hasattr(point, 'number_of_deep_lift_pumb') else None,
            'number_of_power_unit': point.number_of_power_unit if hasattr(point, 'number_of_power_unit') else None,
            'condition': point.condition if hasattr(point, 'condition') else None,
            'type_of_hydrant': point.type_of_hydrant if hasattr(point, 'type_of_hydrant') else None,
        }
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [point.geom.x, point.geom.y]
            },
            "properties": properties
        })
    
    return {
        "type": "FeatureCollection",
        "features": features
    }

async def calculate_optimal_paths(graph, source, destinations):
    source = (source.x, source.y)
    optimal_paths = []
    
    for dest in destinations:
        dest_point = (dest.geom.x, dest.geom.y)
        try:
            nearest_source = await find_nearest_node(graph, source)
            nearest_dest = await find_nearest_node(graph, dest_point)
            path = nx.shortest_path(graph, nearest_source, nearest_dest, weight='weight')
            path_length = nx.shortest_path_length(graph, nearest_source, nearest_dest, weight='weight')
            optimal_paths.append({
                'path': path,
                'length': path_length,
            })
        except nx.NetworkXNoPath:
            continue

    # Sort paths by length (ascending)
    optimal_paths.sort(key=lambda x: x['length'])
    
    return optimal_paths[:3]  # Return top 3 paths

# New addition of fetch_road_data_from_db function
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