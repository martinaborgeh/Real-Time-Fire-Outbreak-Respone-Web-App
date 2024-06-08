#Third Party Modules
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser,IsAuthenticatedOrReadOnly

#Django Modules
from django.shortcuts import render
from django.http import Http404
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import Distance as DistanceMeasure

#Custom Defined Modules
from . models import FireHydrants,FireStations,FireIncident,Roads
from .serializers import AddFireServiceStationsSerializer,AddFireHydrantSerializer,AddFireIncidentSerializer,RoadSerializer
from account.permissions import IsOwnerOrReadOnly


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
        
#This view search fire stations, fire services and roads based on window extent buffer and current location
class SearchBasedOnProximity(APIView):

    def get_input_details(self, requestdata):
        x_coordinate = requestdata.POST.get('x_coordinate ')
        y_coordinate= requestdata.POST.get('y_coordinate ')
        buffer_distance = requestdata.POST.get('buffer_distance')
        return x_coordinate,y_coordinate,buffer_distance

    def search_by_proximity(self,requestdata):
        
        x_coordinate,y_coordinate,buffer_distance = self.get_input_details(requestdata)
        current_point = Point(x_coordinate, y_coordinate, srid=4326)  # Use the appropriate coordinates

        # Define the window extent view buffer
        window_extent_view_buffer = current_point.buffer(buffer_distance)

        fire_stations_within_buffer = FireStations.objects.filter(location__intersects=window_extent_view_buffer) \
        .annotate(distance=Distance('location', current_point))

        # Query fire hydrants within the window extent view buffer
        fire_hydrants_within_buffer = FireHydrants.objects.filter(location__intersects=window_extent_view_buffer) \
        .annotate(distance=Distance('location', current_point))

        # Query roads within the window extent view buffer
        roads_within_buffer = Roads.objects.filter(geom__intersects=window_extent_view_buffer) \
       .annotate(distance=Distance('location', current_point))
  
        # Serialiszing the results
        fire_stations_serializer = AddFireServiceStationsSerializer(fire_stations_within_buffer, many=True)
        fire_hydrants_serializer = AddFireHydrantSerializer(fire_hydrants_within_buffer, many=True)
        roads_serializer = RoadSerializer(roads_within_buffer, many=True)
         
        #Returning response
        serialized_data = {
        'fire_stations': fire_stations_serializer.data,
        'fire_hydrants': fire_hydrants_serializer.data,
        'roads': roads_serializer.data
        }
        return serialized_data


    def get(self, request, format=None):
        permission_classes = [IsAuthenticatedOrReadOnly]

        serialized_data = self.search_by_proximity(request)
        return Response(serialized_data)
    