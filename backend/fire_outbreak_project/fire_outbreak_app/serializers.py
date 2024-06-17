
#Third-party modules
from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer



#Django modules
from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import LineString

#Custom-created modules
from .models import FireHydrants,FireStations,FireIncident,Roads



class PointFieldSerializer(serializers.Field):
   def to_representation(self, value):
        # Convert the Point object to a dictionary with coordinates
        return {
            'longitude': value.x,
            'latitude': value.y
        }
   def to_internal_value(self, data):
        # Convert separate longitude and latitude to a Point object
        try:
            longitude = data['longitude']
            latitude = data['latitude']
            return Point(longitude, latitude)
        except KeyError:
            raise serializers.ValidationError("Longitude and latitude are required fields.")

class AddFireServiceStationsSerializer(serializers.ModelSerializer):
    emergency_phone_number= serializers.IntegerField(required=False, validators=[MinValueValidator(0)])
    region = serializers.CharField(required = False)
    district = serializers.CharField(required = False)
    location = serializers.CharField(required = True)
    station_id = serializers.CharField(required = True)
    number_of_staff = serializers.IntegerField(required = True)
    number_of_fire_tender = serializers.IntegerField(required = True)
    number_of_water_tanker = serializers.IntegerField(required = True)
    number_of_timetable_ladder = serializers.IntegerField(required = True)
    number_of_recovery_track = serializers.IntegerField(required = True)
    number_of_portable_pumb = serializers.IntegerField(required = True)
    number_of_deep_lift_pumb = serializers.IntegerField(required = True)
    number_of_power_unit = serializers.IntegerField(required = True)
    geom = PointFieldSerializer(required=True)
    class Meta:
        model = FireStations
        fields = [
            'id', 
            'region', 
            'district', 
            'location',
            'emergency_phone_number',
            'station_id',
            'number_of_staff',
            'number_of_fire_tender',
            'number_of_water_tanker',
            'number_of_timetable_ladder',
            'number_of_recovery_track',
            'number_of_portable_pumb',
            'number_of_deep_lift_pumb',
            'number_of_power_unit',
             'geom'
            ] 



class AddFireHydrantSerializer(serializers.ModelSerializer):
    region = serializers.CharField(required = False)
    district = serializers.CharField(required = False)
    location = serializers.CharField(required = True)
    station_id = serializers.CharField(required = True)
    condition = serializers.CharField(required = True)
    type_of_hydrant = serializers.CharField(required = True)
    geom = PointFieldSerializer(required=True)
    
    class Meta:
        model = FireHydrants
        fields = [
            'id', 
            'region', 
            'district', 
            'location',
            'station_id',
            'condition',
            'type_of_hydrant',
            'geom'
            ] 


class AddFireIncidentSerializer(serializers.ModelSerializer):
    region = serializers.CharField(required = True) 
    district = serializers.CharField(required = True) 
    location = PointFieldSerializer(required=True)

    class Meta:
        model = FireIncident
        fields = [
            'id',
            'region', 
            'district',
            'location'
            ] 




    




class RoadsSerializer(GeoFeatureModelSerializer):
    osmid = serializers.CharField(
        max_length=80, 
    )
    name = serializers.CharField(
        max_length=80, 
        required=False, 
        allow_blank=True
    )
    highway = serializers.CharField(
        max_length=80
    )
    oneway = serializers.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    reversed = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    length = serializers.FloatField(
        validators=[MinValueValidator(0.0)]
    )
    lanes = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    ref = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    junction = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    bridge = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    maxspeed = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    service = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    tunnel = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    access = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True
    )
    
    class Meta:
        model = Roads
        geo_field = "geom"
        fields = [
            'u', 'v', 'key', 'osmid', 'name', 'highway', 'oneway', 
            'reversed', 'length', 'lanes', 'ref', 'junction', 
            'bridge', 'maxspeed', 'service', 'tunnel', 'access', 'geom'
        ]

    def validate_geom(self, value):
        """
        Validate the geom field to ensure it contains valid LineString geometry.
        """
        if not isinstance(value, LineString):
            raise serializers.ValidationError("The geometry field must be a valid LineString.")
        return value
    

