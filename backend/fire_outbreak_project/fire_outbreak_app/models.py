
# Django modules.
from django.contrib.gis.db import models




class Roads(models.Model):
    name = models.CharField(max_length=100)
    geometry = models.LineStringField()

    def __str__(self):
        return self.name

class FireHydrants(models.Model):
    region = models.CharField(max_length= 100, verbose_name = "Region",null= False, blank=False) 
    district = models.CharField(max_length= 100, verbose_name = "District",null= False, blank=False) 
    locality = models.CharField(max_length= 100, verbose_name = "Locality",null= False, blank=False) 
    location = models.PointField()
 
    def __str__(self):
        return f"{self.locality}"

class FireStations(models.Model):
    region = models.CharField(max_length= 100, verbose_name = "Region",null= False, blank=False) 
    district = models.CharField(max_length= 100, verbose_name = "District",null= False, blank=False) 
    locality = models.CharField(max_length= 100, verbose_name = "Locality",null= False, blank=False) 
    emergency_phone_number= models.PositiveIntegerField(verbose_name = "Emergency Phone Number",null= False, blank=False)
    location = models.PointField()

    def __str__(self):
        return f"{self.locality}"

class FireIncident(models.Model):
    region = models.CharField(max_length= 100, verbose_name = "Region",null= False, blank=False) 
    district = models.CharField(max_length= 100, verbose_name = "District",null= False, blank=False) 
    locality = models.CharField(max_length= 100, verbose_name = "Locality",null= False, blank=False) 
    location = models.PointField()

    def __str__(self):
        return f"{self.locality}"
    
        
