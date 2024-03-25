#Django modules
from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

#Custom-created modules
from .models import FireHydrants,FireStations,FireIncident
from .serializers import AddFireServiceStationsSerializer,AddFireHydrantSerializer,AddFireIncidentSerializer





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
class FireServiceStationsAdmin(LeafletGeoAdmin):
   
    serializer_class = AddFireServiceStationsSerializer
    leaflet_config = leaflet_config
   
admin.site.register(FireStations, FireServiceStationsAdmin)


#Fire Hydrants Admin
class FireHydrantAdmin(LeafletGeoAdmin):
   
    serializer_class = AddFireHydrantSerializer
    leaflet_config = leaflet_config
   
admin.site.register(FireHydrants, FireHydrantAdmin)


#Fire Incidents Admin
class FireIncidentAdmin(LeafletGeoAdmin):
   
    serializer_class = AddFireIncidentSerializer
    leaflet_config = leaflet_config
   
admin.site.register(FireIncident, FireIncidentAdmin)


