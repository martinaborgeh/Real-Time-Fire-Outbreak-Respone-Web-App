#Third Party Modules
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

#Django Modules
from django.urls import path

#Custom Defined Modules
from .views import *




urlpatterns = [
 
    #Accounts 
    path("send-new-user-verification-code/", SendNewUserVerificationCode.as_view(), name="send-new-user-verification-code"),
    path("verify-new-user-and-create-account/", VerifyAndCreateUserAccount.as_view(), name="send-new-user-verification-code"),
    path("login/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path("register-admin/", RegisterAdminUserView.as_view(), name="register-admin"),
    path("login-admin/", LoginAdminUser.as_view(), name="login-admin"),
    path("add-getall-admins/", CreateOrGetAllAdmins.as_view(), name="add-getall-admins"),
    path("getone-updateone-deleteone-admin/", GetOneDeleteUpdateAdmin.as_view(), name="getone-updateone-deleteone-admin"),
    path("update-normal-user/", UpdateNormalUser.as_view(), name="update-normal-user"),
    path("getone-deleteone-normal-user/", GetOneDeleteNormalUser.as_view(), name="getone-deleteone-normal-user"),
    path("getall-normal-users/", GetAllNormalUser.as_view(), name="add-getall-normal-users"),
    

    


   
]
