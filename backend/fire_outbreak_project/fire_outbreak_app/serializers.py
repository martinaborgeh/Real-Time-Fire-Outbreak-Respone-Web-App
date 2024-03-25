
#Third-party modules
from rest_framework import serializers



#Django modules
from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.gis.geos import Point

#Custom-created modules
from .models import FireHydrants,FireStations,FireIncident,Roads



class PointFieldSerializer(serializers.Field):
    def to_representation(self, value):
        # Convert the Point object to a dictionary with coordinates
        return {
            'type': 'Point',
            'coordinates': [value.x, value.y]
        }

    def to_internal_value(self, data):
        # Convert the dictionary to a Point object
        if 'type' in data and 'coordinates' in data:
            return Point(data['coordinates'][0], data['coordinates'][1])
        raise serializers.ValidationError("Invalid Point data")

class AddFireServiceStationsSerializer(serializers.ModelSerializer):
    locality = serializers.CharField(required = True)
    emergency_phone_number= serializers.IntegerField(required=True, validators=[MinValueValidator(0)])
    region = serializers.CharField(required = True)
    district = serializers.CharField(required = True)
    location = PointFieldSerializer(required=True)
   
    class Meta:
        model = FireStations
        fields = ['id', 'region', 'district', 'locality', 'location','emergency_phone_number'] 



class AddFireHydrantSerializer(serializers.ModelSerializer):
    locality = serializers.CharField(required = True)
    region = serializers.CharField(required = True)
    district = serializers.CharField(required = True)
    location = PointFieldSerializer(required=True)
    
    class Meta:
        model = FireHydrants
        fields = ['id', 'region', 'district', 'locality', 'location'] 


class AddFireIncidentSerializer(serializers.ModelSerializer):
    region = serializers.CharField(required = True) 
    district = serializers.CharField(required = True) 
    locality = serializers.CharField(required = True)
    location = PointFieldSerializer(required=True)

    class Meta:
        model = FireIncident
        fields = ['id', 'region', 'district', 'locality', 'location'] 

class RoadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roads
        fields = ['id', 'name', 'geometry']
    


