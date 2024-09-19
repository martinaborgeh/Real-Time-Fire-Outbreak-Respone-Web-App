from django.urls import path
from django.views.decorators.cache import cache_page

from rest_framework import routers

from .views import (

CreateOrListFireService,
CreateOrListFireHydrant,
CreateOrListFireIncident,

GetOneOrUpdateOneFireService,
GetOneOrUpdateOneFireHydrant,
GetOneOrUpdateOneFireIncident,
SearchBestOptimalPath,
RoomViewSet,
CallView

)

router = routers.DefaultRouter()
router.register(r"rooms", RoomViewSet)
urlpatterns = router.urls

urlpatterns += [
   
    # Create or List data
    path("search-best-optimal-path/",SearchBestOptimalPath.as_view(), name="search-best-optimal-path"),
    
    path("create-list-fire-service-stations/", CreateOrListFireService.as_view(), name="create-list-fire-service"),
    path("create-list-fire-hydrants/", CreateOrListFireHydrant.as_view(), name="create-list-fire-hydrant"),
    path("create-list-fire-incidents/", CreateOrListFireIncident.as_view(), name="create-list-fire-incidents"),
   
   # Get One or Update
   path("get-update-one-fire-service-stations/<int:pk>", GetOneOrUpdateOneFireService.as_view(), name="get-update-one-fire-service-stations"),
   path("get-update-one-fire-hydrants/<int:pk>", GetOneOrUpdateOneFireHydrant.as_view(), name="get-update-one-fire-hydrants"),
   path("get-update-one-fire-incidents/<int:pk>", GetOneOrUpdateOneFireIncident.as_view(), name="get-update-one-fire-incidents"),
   path("call-view/",CallView.as_view(),name="call-view")
   
    
]
