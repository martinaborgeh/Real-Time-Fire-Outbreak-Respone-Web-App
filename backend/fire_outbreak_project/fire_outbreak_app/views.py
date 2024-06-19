#Third Party Modules
# from rest_framework.views import APIView
from adrf.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser,IsAuthenticatedOrReadOnly


#Django Modules
from django.shortcuts import render
from django.http import Http404
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import Distance as DistanceMeasure
from django.http import JsonResponse


#Custom Defined Modules
from . models import FireHydrants,FireStations,FireIncident,Roads
from .serializers import AddFireServiceStationsSerializer,AddFireHydrantSerializer,AddFireIncidentSerializer,RoadsSerializer
from account.permissions import IsOwnerOrReadOnly
from .view_helper_functions import (
    fetch_road_data_from_db,
    create_graph_from_geojson,
    get_fire_stations_and_hydrants,
     calculate_optimal_paths,
     convert_to_geojson,
     format_path_as_geojson,
     format_points_as_geojson,
     save_to_cache,
     check_if_previous_incident_less_200m_from_current_incident,
     add_location_t_geoset

    )


class CreateOrListFireService(APIView):
 
    
    def get(self, request, format=None):
        permission_classes = [IsAdminUser]
        firestations = FireStations.objects.all()
        serializer = AddFireServiceStationsSerializer(firestations, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        permission_classes = [IsAdminUser]
        serializer = AddFireServiceStationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetOneOrUpdateOneFireService(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
 
    def get_object(self, pk):
        try:
            return FireStations.objects.get(pk=pk)
        except FireStations.DoesNotExist:
            raise Http404
  
    

    def get(self, request, pk, format=None):
        permission_classes = [IsAuthenticatedOrReadOnly]
        firestations = self.get_object(pk)
        serializer = AddFireServiceStationsSerializer(firestations)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        self.permission_classes = [IsOwnerOrReadOnly]
        firestations = self.get_object(pk)
        serializer = AddFireServiceStationsSerializer(firestations, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.permission_classes = [IsOwnerOrReadOnly]
        firestations = self.get_object(pk)
        firestations.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CreateOrListFireHydrant(APIView):
    """
    List all snippets, or create a new snippet.
    """
    def get(self, request, format=None):
        permission_classes = [IsAdminUser]
        firehydrants = FireHydrants.objects.all()
        serializer = AddFireHydrantSerializer(firehydrants, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        permission_classes = [IsAdminUser]
        serializer = AddFireHydrantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetOneOrUpdateOneFireHydrant(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return FireHydrants.objects.get(pk=pk)
        except FireHydrants.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        permission_classes = [IsAuthenticatedOrReadOnly]
        firehydrants = self.get_object(pk)
        serializer = AddFireHydrantSerializer(firehydrants)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        self.permission_classes = [IsOwnerOrReadOnly]
        firehydrants = self.get_object(pk)
        serializer = AddFireHydrantSerializer(firehydrants, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.permission_classes = [IsOwnerOrReadOnly]
        firehydrants = self.get_object(pk)
        firehydrants.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CreateOrListFireIncident(APIView):
    """
    List all snippets, or create a new snippet.
    """
    def get(self, request, format=None):
        permission_classes = [IsAdminUser]
        fireincidents = FireIncident.objects.all()
        serializer = AddFireIncidentSerializer(fireincidents, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        permission_classes = [IsAdminUser]
        serializer =  AddFireIncidentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetOneOrUpdateOneFireIncident(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]  
 
    def get_object(self, pk):
        try:
            return FireIncident.objects.get(pk=pk)
        except FireIncident.DoesNotExist:
            raise Http404



    def get(self, request, pk, format=None):
        permission_classes = [IsAuthenticatedOrReadOnly]
        fireincidents = self.get_object(pk)
        serializer = AddFireIncidentSerializer(fireincidents )
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        self.permission_classes = [IsOwnerOrReadOnly]
        fireincidents = self.get_object(pk)
        serializer = AddFireIncidentSerializer(fireincidents, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.permission_classes = [IsOwnerOrReadOnly]
        fireincidents = self.get_object(pk)
        fireincidents.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

class SearchBestOptimalPath(APIView):
    async def post(self, request, format=None):

         #Check if there is bounds
        bounds = request.data.get("bounds")
        if not bounds:
            return Response({"error": "Bounds data not provided"}, status=status.HTTP_400_BAD_REQUEST)

         #Check if there is current location
        incident_lon = request.data.get("starting_point").get("lon")
        incident_lat = request.data.get("starting_point").get("lat")
        if not incident_lon or not incident_lat:
            return Response({"error": "Incident location not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        #Create Point Feature
        incident_location = Point(incident_lon, incident_lat, srid=4326)

        #Check if any previous incident is within 200m buffer from current incident
        is_previous_point_interval_less_than_200m = await check_if_previous_incident_less_200m_from_current_incident(incident_location)
        if is_previous_point_interval_less_than_200m:
            return Response(is_previous_point_interval_less_than_200m, status=status.HTTP_200_OK)

        #add cuurent incident to redis geoset
        await add_location_t_geoset("incidents",incident_lon,incident_lat,f"{incident_lon},{incident_lat}")
      
        #Retrieve data from database
        road_data = await fetch_road_data_from_db(bounds)
        if road_data == "database request not successful":
            return Response({"error": "Database request failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        #Convert data to geojson
        road_data_geojson = await convert_to_geojson(road_data)

        #Create graph from data using Kdtree algorithm
        graph = await create_graph_from_geojson(road_data_geojson)

        #Retrieve Fire Stations and Fire Hydrants from Database
        fire_stations, fire_hydrants = await get_fire_stations_and_hydrants(bounds)

        #Find optimal Path to the Fire Stations
        optimal_fire_station_paths = await calculate_optimal_paths(graph, incident_location, fire_stations)
        optimal_hydrant_paths = await calculate_optimal_paths(graph, incident_location, fire_hydrants)

        #format response data for Optimal Paths and destinations within 8km Buffer
        response_data = {
            "optimal_fire_station_paths": [format_path_as_geojson(path['path'],path["path_length"]) for path in optimal_fire_station_paths],
            "optimal_hydrant_paths": [format_path_as_geojson(path['path'],path["path_length"]) for path in optimal_hydrant_paths],            
            "fire_stations": format_points_as_geojson(fire_stations),
            "fire_hydrants": format_points_as_geojson(fire_hydrants),
        }
        
        #Save Cache Response for fast response if current point within 200m from previous 
        await save_to_cache(f"cached_response_data{incident_location}",response_data)
        print("saved",incident_location)

        #Return Response Object to Clientsssssssssssss
        return Response(response_data, status=status.HTTP_200_OK)