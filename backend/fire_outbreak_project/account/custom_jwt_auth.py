from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken,TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BaseAuthentication
from django.conf import settings
from datetime import datetime,timezone


class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that checks for access and refresh tokens
    in cookies. Refreshes access token if expired using a valid refresh token.
    """

    def authenticate(self, request):
        user, validated_token = None, None

        # Check for access token
        access_token = request.session.get('access_token')
    
        if access_token:
            try:
                validated_token = self.get_validated_token(access_token)
                user = self.get_user(validated_token)
                return user, validated_token
            except Exception as e:
                print(f"Access token authentication error: {e}")

        # If access token fails, check refresh token
        refresh_token = request.session.get('refresh_token')
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)

                expiration_timestamp = refresh['exp']
                expiration_time = datetime.fromtimestamp(expiration_timestamp, tz=timezone.utc)
                current_time = datetime.now(timezone.utc)

                if current_time < expiration_time:
                    # Generate new access token from refresh token
                    new_access_token = str(refresh.access_token)

                    request.session['access_token'] = response.data['access']
                    request.session.save()

                    validated_token = self.get_validated_token(new_access_token)
                    user = self.get_user(validated_token)

                    if user:
                        # Return the user and new access token for setting in the view
                        return user, new_access_token  # Return the new access token
                else:
                    print('Refresh token has expired, log in again.')

            except Exception as e:
                print(f"Refresh token validation error: {e}")

        # Return None if no valid tokens found
        return None




