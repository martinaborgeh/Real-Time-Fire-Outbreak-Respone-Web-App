
# Django modules.
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point


# This class requires that you download data from openstreetmap and store as geojson
class Roads(models.Model):
    u = models.BigIntegerField()
    v = models.BigIntegerField()
    key = models.BigIntegerField()
    osmid = models.CharField(max_length=80)
    name = models.CharField(max_length=80)
    highway = models.CharField(max_length=80)
    oneway = models.IntegerField()
    reversed = models.CharField(max_length=80)
    length = models.FloatField()
    lanes = models.CharField(max_length=80)
    ref = models.CharField(max_length=80)
    junction = models.CharField(max_length=80)
    bridge = models.CharField(max_length=80)
    maxspeed = models.CharField(max_length=80)
    service = models.CharField(max_length=80)
    tunnel = models.CharField(max_length=80)
    access = models.CharField(max_length=80)
    geom = models.LineStringField(srid=4326)

    
    # name = models.CharField(max_length=100)
    # geometry = models.LineStringField()

    def __str__(self):
        return self.name

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
    
        
