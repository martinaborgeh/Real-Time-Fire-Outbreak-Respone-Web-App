#Third Party Modules
from leaflet.admin import LeafletGeoAdmin
from import_export.admin import ImportExportModelAdmin


#Django modules
from django.contrib import admin


#Custom-created modules
from .models import FireHydrants,FireStations,FireIncident,Roads
from .serializers import AddFireServiceStationsSerializer,AddFireHydrantSerializer,AddFireIncidentSerializer,RoadsSerializer
from .import_resources import FireHydrantResource,FireIncidentResource,FireStationResource

leaflet_config = {
    'DEFAULT_CENTER': (20, 0),  # Adjust this based on your map's center (latitude, longitude)
    #'DEFAULT_ZOOM': 2,
    'TILES': [
         ('Satellite', 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {'subdomains': ['mt0', 'mt1', 'mt2', 'mt3']}),
        ('OpenStreetMap', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}),
    ],
   'LAYERS_CONTROL': True,  # Add layer controls
}


#Fire Service Stations Admin
class FireServiceStationsAdmin(LeafletGeoAdmin,ImportExportModelAdmin):
   
    serializer_class = AddFireServiceStationsSerializer
    resource_classes = [FireStationResource]
    leaflet_config = leaflet_config
   
admin.site.register(FireStations, FireServiceStationsAdmin)


#Fire Hydrants Admin
class FireHydrantAdmin(LeafletGeoAdmin,ImportExportModelAdmin):
   
    serializer_class = AddFireHydrantSerializer
    resource_classes = [FireHydrantResource]
    leaflet_config = leaflet_config
   
admin.site.register(FireHydrants, FireHydrantAdmin)


#Fire Incidents Admin
class FireIncidentAdmin(LeafletGeoAdmin,ImportExportModelAdmin):
   
    serializer_class = AddFireIncidentSerializer
    resource_classes = [FireIncidentResource]
    leaflet_config = leaflet_config
   
admin.site.register(FireIncident, FireIncidentAdmin)



class RoadsAdmin(LeafletGeoAdmin):
    serializer_class = RoadsSerializer
    leaflet_config = leaflet_config
    class Meta:
        model = Roads
        

admin.site.register(Roads, RoadsAdmin)
    