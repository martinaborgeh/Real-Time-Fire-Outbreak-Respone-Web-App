#Third Party Modules
from import_export import resources
from import_export.fields import Field


#Django Modules
from django.contrib.gis.geos import Point

#Custom Defined Modules
from .models import FireHydrants,FireIncident,FireStations

##Could not use the Road import in Admin because there is no support for shapefiles and geojson file format


class FireHydrantResource(resources.ModelResource):

    station_id = Field(attribute='station_id', column_name='ID')
    condition = Field(attribute='condition', column_name='Condition_of_Hydrant')
    type_of_hydrant = Field(attribute='type_of_hydrant', column_name='Type_of_Hydrant')
    location = Field(attribute='location', column_name='Location')

    class Meta:
        model = FireHydrants  # or 'core.Book'
        fields = (
         "id",
         'region', 
         'district', 
         'location',
         'station_id',
         'condition',
         'type_of_hydrant',
         'geom'
         )
        
    def before_import_row(self, row, **kwargs):
        """
        Override this method to create a Point object from latitude and longitude.
        """
        latitude = row.get('Latitude')
        longitude = row.get('Longitude')
        if latitude is not None and longitude is not None:
            try:
                latitude = float(latitude)
                longitude = float(longitude)
                row['geom'] = Point(longitude, latitude)
            except ValueError:
                row['geom'] = None
        else:
                row['geom'] = None
        
class FireStationResource(resources.ModelResource):

    location = Field(attribute='location', column_name='Location')
    station_id = Field(attribute='station_id', column_name='ID')
    number_of_staff = Field(attribute='number_of_staff', column_name='Number_of_Staff')
    number_of_fire_tender = Field(attribute='number_of_fire_tender', column_name='Number_of_Fire_Tender')
    number_of_water_tanker = Field(attribute='number_of_water_tanker', column_name='Number_of_Water_Tanker')
    number_of_timetable_ladder = Field(attribute='number_of_timetable_ladder', column_name='Number_of_Timetable_Ladder')
    number_of_recovery_track = Field(attribute='number_of_recovery_track', column_name='Number_of_Recovery_Track')
    number_of_portable_pumb = Field(attribute='number_of_portable_pumb', column_name='Number_of_Portable_Pumb')
    number_of_deep_lift_pumb = Field(attribute='number_of_deep_lift_pumb', column_name='Number_of_Deep_Lift_Pumb')
    number_of_power_unit = Field(attribute='number_of_power_unit', column_name='Number_of_Power_Unit')

    class Meta:
        model = FireStations  # or 'core.Book'
        fields = (
         "id",
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
         )
    def before_import_row(self, row, **kwargs):
        """
        Override this method to create a Point object from latitude and longitude.
        """
        latitude = row.get('Latitude')
        longitude = row.get('Longitude')
        if latitude is not None and longitude is not None:
            try:
                latitude = float(latitude)
                longitude = float(longitude)
                row['geom'] = Point(longitude, latitude)
            except ValueError:
                row['geom'] = None
        else:
                row['geom'] = None
        
class FireIncidentResource(resources.ModelResource):

    class Meta:
        model = FireIncident  # or 'core.Book'
        fields = (
        'region', 
        'district',
        'locality', 
        'loc'
         )
        
    def before_import_row(self, row, **kwargs):
        """
        Override this method to create a Point object from latitude and longitude.
        """
        latitude = row.get('Latitude')
        longitude = row.get('Longitude')
        if latitude is not None and longitude is not None:
            try:
                latitude = float(latitude)
                longitude = float(longitude)
                row['loc'] = Point(longitude, latitude)
            except ValueError:
                row['loc'] = None
        else:
                row['loc'] = None