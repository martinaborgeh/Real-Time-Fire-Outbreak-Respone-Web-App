#Third party libraries
import json
import networkx as nx
from django.contrib.gis.geos import Point,Polygon
from .models import FireStations, FireHydrants,Roads  # Assuming these are your models
from scipy.spatial import KDTree
from asgiref.sync import sync_to_async
import math
import redis
import os
import dotenv


env_file = os.getenv('DJANGO_ENV') 
dotenv.load_dotenv(env_file if env_file else '.env.dev')


#Django Modules
from django.core.cache import cache

#get data from redis immemory storage
async def get_from_cache(key):
    cached_data = await cache.aget(key)
    if cached_data:
        print("Using data from cache")
        return json.loads(cached_data)
    return None


#Cache data to redis immemory storage
async def save_to_cache(key, data):
    print("saving to cache")
    await cache.aset(key, json.dumps(data), timeout=3600)


#get road data from database within the specified bound
@sync_to_async
def query_road_data_from_db(bounding_box):
    print("Using road data from database")
    return list(Roads.objects.filter(geom__intersects=bounding_box))


#get fire hydrants from database
@sync_to_async
def query_fire_hydrants(bounding_box):
    print("retrieving hydrants from db")
    return list(FireHydrants.objects.filter(geom__within=bounding_box))


#get fire station from database
@sync_to_async
def query_fire_stations(bounding_box):
    print("retrieving stations from db")
    return list(FireStations.objects.filter(geom__within=bounding_box))


#retrieve fire stations and fire hydrants from database
async def get_fire_stations_and_hydrants(bounds):
    south, west, north, east = bounds['south'], bounds['west'], bounds['north'], bounds['east']
    bounding_box = Polygon.from_bbox((west, south, east, north))
    fire_stations = await query_fire_stations(bounding_box)
    fire_hydrants = await query_fire_hydrants(bounding_box)
    print("",fire_hydrants,fire_stations)
    return fire_stations, fire_hydrants


#convert road data to geojsom
@sync_to_async
def convert_to_geojson(road_data):
    print("converting to geojson")
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


#Create graph from road data
async def create_graph_from_geojson(geojson_data):
    print("creating graph")
    G = nx.Graph()
    for feature in geojson_data['features']:
        coords = feature['geometry']['coordinates']
        for i in range(len(coords) - 1):
            point1 = tuple(coords[i])
            point2 = tuple(coords[i + 1])
            G.add_edge(point1, point2, weight= await haversine_distance(point1, point2))
    return G


#Haversine algorithm to calculate distance in kilometres from longitude and latitude
async def haversine_distance(point1, point2):
    R = 6371.0
    lat1, lon1 = math.radians(point1[1]), math.radians(point1[0])
    lat2, lon2 = math.radians(point2[1]), math.radians(point2[0])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


#find nearest node to source and target
@sync_to_async
def find_nearest_node(graph, point):
    print("finding nearest node")
    tree = KDTree([node for node in graph.nodes])
    _, idx = tree.query(point)
    return list(graph.nodes)[idx]


#format output optimal path as geojson
def format_path_as_geojson(path,path_length):
    print("format optimal path as geojson")
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": path
        },
        "properties": {"path_length":path_length}
    }


#format output destination point(fire station and hydrants) as geojson
def format_points_as_geojson(points):
    print("format destinations as geojson")
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


#Find three most optimal path
async def calculate_optimal_paths(graph, source, destinations):
    print("Finding optimal path")
    source = (source.x, source.y)
    optimal_paths = []
    nearest_source = await find_nearest_node(graph, source)
    for dest in destinations:
        dest_point = (dest.geom.x, dest.geom.y)
        try:
            
            nearest_dest = await find_nearest_node(graph, dest_point)
            path = nx.shortest_path(graph, nearest_source, nearest_dest, weight='weight')
            path_length = nx.shortest_path_length(graph, nearest_source, nearest_dest, weight='weight')
            optimal_paths.append({
                'path': path,
                'path_length': path_length,
            })
        except nx.NetworkXNoPath:
            continue

    # Sort paths by length (ascending)
    optimal_paths.sort(key=lambda x: x['path_length'])
    
    return optimal_paths[:3]  # Return top 3 paths


# fetch_road_data_from_db function
async def fetch_road_data_from_db(map_bounds):
    print("Fetching road data")
    south, west, north, east = map_bounds['south'], map_bounds['west'], map_bounds['north'], map_bounds['east']
    bounding_box = Polygon.from_bbox((west, south, east, north))    
    try:
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

        print("Using road data from database")
        return road_data_list
    except Exception as e:
        print("Database error", e)
        return "database request not successful"


#Redis to store current points to geoset
redis_aioredis_url =  redis.from_url(f"redis://{os.environ.get('CACHE_HOST')}:{os.environ.get('CACHE_PORT')}/2")


#add current location to geoset
@sync_to_async
def add_location_t_geoset(setname,longitude,latitude,name):
    redis_aioredis_url.geoadd(setname, (longitude, latitude,name))


#retrieve the most  closest previous incident to the current incident
@sync_to_async
def get_by_200m_radius_previous_point(setname,longitude,latitude):
    nearest_incident = redis_aioredis_url.georadius(
            setname, 
            longitude,
            latitude, 
            0.2, 
            unit='km', 
            count=1, 
            withdist=True, 
        )
    return nearest_incident


#function to check previous incidents less than 200m(0.km) buffer away from current incident
async def check_if_previous_incident_less_200m_from_current_incident(current_incident_point):
    try:
        nearest_incident = await get_by_200m_radius_previous_point("incidents",current_incident_point.x,current_incident_point.y)
        if nearest_incident:
            nearest_incident_key = nearest_incident[0][0].decode('utf-8').split(',') if nearest_incident else None
            print("retrieved",Point(float(nearest_incident_key[0]),float(nearest_incident_key[1]),srid=4326))
            return await get_from_cache(f"cached_response_data{Point(float(nearest_incident_key[0]),float(nearest_incident_key[1]),srid=4326)}") if nearest_incident_key else None
        else:
            return None
    except Exception as e:
        print("The error is:", e)
        return None


