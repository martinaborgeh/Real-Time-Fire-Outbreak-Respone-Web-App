from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken,TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from datetime import datetime,timezone

# from django.utils import timezone



class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that checks for access and refresh tokens
    in cookies. Refreshes access token if expired using a valid refresh token.
    """

    def authenticate(self, request):
        """
        Authenticates the request based on access and refresh tokens in cookies.

        Returns:
            A tuple containing the authenticated user and any error messages (or None if no errors).
        """
        try:
            access_token = request.COOKIES.get('access_token')
            if access_token:
                validated_token = self.get_validated_token(access_token)
                print(f"Validated access token: {validated_token}")
                user = self.get_user(validated_token)
                return user, validated_token
        except Exception as e:
            print(f"Access token authentication error: {e}")
            pass  # Ignore errors during access token authentication

        # If access token authentication failed, check refresh token
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                print(f"Refresh token claims: {refresh.payload}")

                expiration_timestamp = refresh['exp']
                expiration_time = datetime.fromtimestamp(expiration_timestamp, tz=timezone.utc)
                current_time = datetime.now(timezone.utc)

                if current_time < expiration_time:
                    # Generate new access token from refresh token
                    new_access_token = str(refresh.access_token)
                    # Authenticate with new access token
                    validated_token = self.get_validated_token(new_access_token)
                    user = self.get_user(validated_token)
                    print("user",user)
                    if user:
                        # Set the new access token to the cookies
                        response = Response()
                        response.set_cookie(
                            'access_token',
                            new_access_token,
                            httponly=True,
                            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
                        )
                        return user, validated_token
                    else:
                        raise AuthenticationFailed('Token creation failed, retry')
                else:
                    raise AuthenticationFailed('Refresh token has expired, log in again')
            except (InvalidToken, TokenError) as e:
                print(f"Refresh token validation error: {e}")
                raise AuthenticationFailed('Authentication credentials were not provided.')
        else:
            raise AuthenticationFailed('There is no refresh token, log in again.')

        # If both authentication methods fail, return None
        return None
                


# class CustomJWTAuthentication(JWTAuthentication):
#     """
#     Custom authentication class that extracts JWT from authorization headers.
#     """

#     def authenticate(self, request):
#         """
#         Authenticate the request by extracting JWT from authorization headers.
#         """

#         # Get authorization headers from the request
#         auth_header = request.headers
#         print('hh',auth_header)

#         if auth_header:
#             # Split the authorization header to get the token
#             parts = auth_header.split()

#             if len(parts) == 2 and parts[0].lower() == 'bearer':
#                 access_token = parts[1]

#                 # Authenticate the access token
#                 try:
#                     validated_token = self.get_validated_token(access_token)
#                     user = self.get_user(validated_token)
#                     return user, validated_token
#                 except AuthenticationFailed as e:
#                     raise AuthenticationFailed('Invalid token')
#         return None
