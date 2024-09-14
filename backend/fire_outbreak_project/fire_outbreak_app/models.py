
# Django modules.
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from ..account.models import CustomUserModel


# This class requires that you download data from openstreetmap and store as geojson
class Roads(models.Model):
    u = models.BigIntegerField(null=True,blank=True)
    v = models.BigIntegerField(null=True,blank=True)
    key = models.BigIntegerField(null=True,blank=True)
    osmid = models.CharField(max_length=80,null=True,blank=True)
    name = models.CharField(max_length=80,null=True,blank=True)
    highway = models.CharField(max_length=80,null=True,blank=True)
    oneway = models.IntegerField(null=True,blank=True)
    reversed = models.CharField(max_length=80,null=True,blank=True)
    length = models.FloatField(null=True,blank=True)
    lanes = models.CharField(max_length=80,null=True,blank=True)
    ref = models.CharField(max_length=80,null=True,blank=True)
    junction = models.CharField(max_length=80,null=True,blank=True)
    bridge = models.CharField(max_length=80,null=True,blank=True)
    maxspeed = models.CharField(max_length=80,null=True,blank=True)
    service = models.CharField(max_length=80,null=True,blank=True)
    tunnel = models.CharField(max_length=80,null=True,blank=True)
    access = models.CharField(max_length=80,null=True,blank=True)
    geom = models.LineStringField(srid=4326,null=True,blank=True)

    

    class Meta:
        indexes = [
            models.Index(fields=['geom'], name='geom_gist_idx_roads', opclasses=['gist'])
        ]


class FireHydrants(models.Model):
    region = models.CharField(max_length= 100, verbose_name = "Region",null= True, blank=True) 
    district = models.CharField(max_length= 100, verbose_name = "District",null= True, blank=True) 
    location = models.CharField(max_length=80,null =False, blank=False, verbose_name="Location")
    station_id = models.CharField(default=0,max_length=80,null=False,verbose_name="Station ID")
    condition = models.CharField(default=0,max_length=80, null=False, blank=False)
    type_of_hydrant = models.CharField(default=0,max_length=80, null=False,blank=False)
    geom = models.PointField(default=Point(0.0, 0.0),srid=4326)
    
    class Meta:
        indexes = [
            models.Index(fields=['geom'], name='geom_gist_idx_firehydrants', opclasses=['gist'])
        ]

    def __str__(self):
        return f"{self.location}"

class FireStations(models.Model):
    user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE)
    region = models.CharField(max_length= 100, verbose_name = "Region",null= True, blank=True) 
    district = models.CharField(max_length= 100, verbose_name = "District",null= True, blank=True)
    emergency_phone_number= models.PositiveIntegerField(verbose_name = "Emergency Phone Number",null= True, blank=True)
    location = models.CharField(max_length=80,null =False, blank=False, verbose_name="Location")
    station_id = models.CharField(default=0,max_length=80,null=False,verbose_name="Station ID")
    number_of_staff = models.IntegerField(default=0,verbose_name="Number of Staff")
    number_of_fire_tender = models.IntegerField(default=0,verbose_name="Number of Fire Tender")
    number_of_water_tanker = models.IntegerField(default=0,verbose_name="Number of Water Tanker")
    number_of_timetable_ladder = models.IntegerField(default=0,verbose_name="Number of Timetable Ladder")
    number_of_recovery_track = models.IntegerField(default=0,verbose_name="Number of Recovery Track")
    number_of_portable_pumb = models.IntegerField(default=0,verbose_name="Number of Portable Pumb")
    number_of_deep_lift_pumb = models.IntegerField(default=0,verbose_name="Number of Deep Lift Pumb")
    number_of_power_unit = models.IntegerField(default=0,verbose_name="Number of Power Unit")
    geom = models.PointField(default=Point(0.0, 0.0),srid=4326)
    
    class Meta:
        indexes = [
            models.Index(fields=['geom'], name='geom_gist_idx_firestations', opclasses=['gist'])
        ]


    def __str__(self):
        return f"{self.location}"

class FireIncident(models.Model):
    region = models.CharField(max_length= 100, verbose_name = "Region",null= False, blank=False) 
    district = models.CharField(max_length= 100, verbose_name = "District",null= False, blank=False)  
    loc = models.PointField(default=Point(0.0, 0.0),srid=4326)
    
    class Meta:
        indexes = [
            models.Index(fields=['loc'], name='loc_gist_idx_fireincidents', opclasses=['gist'])
        ]

    def __str__(self):
        return f"{self.location}"
    

class Room(models.Model):

    """
    Room Model for group calling
    """

    ROOM_TYPE = [
        ("OTA", "Open to all"),
        ("IO", "Invite only"),
    ]
    user = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(default="")
    type_of = models.CharField(
        max_length=3,
        choices=ROOM_TYPE,
        default="OTA",
    )
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    
        
