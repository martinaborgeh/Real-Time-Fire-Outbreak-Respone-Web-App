from django.urls import path

from .views import *

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)



urlpatterns = [
 
    path("send-new-user-verification-code/", SendNewUserVerificationCode.as_view(), name="send-new-user-verification-code"),
    path("verify-new-user-and-create-account/", VerifyAndCreateUserAccount.as_view(), name="send-new-user-verification-code"),
    # path("register/", RegisterUserView.as_view(), name="auth-register"),
    path("login/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
   
]
