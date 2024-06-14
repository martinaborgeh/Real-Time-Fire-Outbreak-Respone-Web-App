from django.urls import path

from .views import (

CreateOrListFireService,
CreateOrListFireHydrant,
CreateOrListFireIncident,

GetOneOrUpdateOneFireService,
GetOneOrUpdateOneFireHydrant,
GetOneOrUpdateOneFireIncident,
SearchBestOptimalPath

)
urlpatterns = [
   
    # Create or List data
    path("search-best-optimal-path/",SearchBestOptimalPath.as_view(), name="search-best-optimal-path"),
    
    path("create-list-fire-service-stations/", CreateOrListFireService.as_view(), name="create-list-fire-service"),
    path("create-list-fire-hydrants/", CreateOrListFireHydrant.as_view(), name="create-list-fire-hydrant"),
    path("create-list-fire-incidents/", CreateOrListFireIncident.as_view(), name="create-list-fire-incidents"),
   
   # Get One or Update
   path("get-update-one-fire-service-stations/<int:pk>", GetOneOrUpdateOneFireService.as_view(), name="get-update-one-fire-service-stations"),
   path("get-update-one-fire-hydrants/<int:pk>", GetOneOrUpdateOneFireHydrant.as_view(), name="get-update-one-fire-hydrants"),
   path("get-update-one-fire-incidents/<int:pk>", GetOneOrUpdateOneFireIncident.as_view(), name="get-update-one-fire-incidents"),

   
    
]
