
#Third Party Modules
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import timedelta




from django.contrib.auth import authenticate,login,logout
from django.http import Http404
from django.utils import timezone
from django.conf import settings


#Custom-defined Modules
from .models import CustomUserModel
from .serializers import *
from .view_helper_functions import (
    send_email_verification_code,
    generate_verification_code,
    save_in_session,
    delete_from_session,
    check_code_verification_timeout,
    validate_code_email
    )

from account.custom_jwt_auth import CustomJWTAuthentication
from account.adminrolebanckendauthenticate import RoleBasedBackend
#Receive new normal user details, store in session to be verified and later send code to the Normal user
class SendNewUserVerificationCode(APIView):

    def get_formatted_errors(self, errors):
        formatted_errors = {}
        errors_items = errors.items()
        for field, field_errors in errors_items:
            if field == 'password':
                formatted_errors[field] = self.format_password_errors(field_errors)
            else:
                formatted_errors[field] = field_errors
        return formatted_errors

    def format_password_errors(self, password_errors):
        formatted_password_errors = []
        for error in password_errors:
            if 'This field may not be blank.' in error:
                formatted_password_errors.append('Password is required.')
            elif 'This password is too short.' in error:
                formatted_password_errors.append('Password is too short.')
            # Add more conditions for other password-related errors as needed
        return formatted_password_errors

    def post(self, request):
        serializer = VerificationEmailSerializer(data=request.data)

        try:
            print(serializer.is_valid())
            if serializer.is_valid():
                validated_data = serializer.validated_data
                email = validated_data['email']
                code = generate_verification_code()
                validated_data['Code'] = code
                validated_data['code_verification_timeout'] = timezone.now() + timedelta(minutes=20)
                save_in_session(request, validated_data)
                print("session data",request.session.get('unverified_details', 'Session item not found'))
            
                send_email_verification_code(email,code)
                return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
            else:
               errors = self.get_formatted_errors(serializer.errors)
               print("errors",errors)
               return Response({'errors': errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print("error is ",e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Check_If_Code_Verification_Expired(APIView):
    def post(self, request):
        session_data = request.session.get('unverified_details')
        session_email = session_data.get('email')if session_data else None
        client_email = request.data.get('verify_email')
        is_code_verify_timeout = check_code_verification_timeout(session_data)
        if is_code_verify_timeout and client_email !=session_email:
            return Response({'message': 'Verification Code Expired'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Verification Not Expired'}, status=250)





#Verify normal user code and save the session data in the CustomUser Model table
class VerifyAndCreateUserAccount(APIView):

    def post(self, request,*args, **kwargs):
        try:
            session_data = request.session.get('unverified_details')
            client_code = request.data.get('Code')
            client_email= request.data.get('verify_email')
            
            if session_data is None:
                return Response({"message": "Session data not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            session_email = session_data['email']
            
            is_code_verify_timeout = check_code_verification_timeout(session_data)
                                                     
            validate_verify_input =validate_code_email(client_code,client_email,session_email)
                
            if not is_code_verify_timeout and validate_verify_input == "client data is validated successfully":
                serializer = RegisterUserSerializer(data=session_data)
                if serializer.is_valid():
                    # validated_data = serializer.validated_data
                    session_code = session_data['Code']
                    print("session_code",session_code)
                    print("clientcode",client_code)
                    if client_code == session_code:
                        serializer.save()
                        print("saved successfully")
                        del request.session['unverified_details']
                       
                        return Response({"message":"Account Created Successfully"}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({"message":"Codes are not Equal"}, status=status.HTTP_404_NOT_FOUND)
                else:
                    # errors = self.get_formatted_errors(serializer.errors)
                    print("Serializer invalid")
                    return Response({'errors ': "Serializer invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
                
            elif not is_code_verify_timeout and validate_verify_input == "Your input is empty":
                return Response({'message': "Your input is empty"}, status=250)
            
            elif not is_code_verify_timeout and validate_verify_input == "Your input canot be less than 4":
                return Response({'message': "Your input canot be less than 4"}, status=250)
            
            elif not is_code_verify_timeout and validate_verify_input == "You do not have account or your code has expired":
                return Response({'message': "You do not have account or your code has expired"}, status=250)
            
            elif not is_code_verify_timeout and validate_verify_input == "Your email is invalid":
                return Response({'message': "Your email is invalid"}, status=250)
            

            else:
                del request.session['unverified_details']
                return Response({'message': "Code Verification expired"}, status=250)
        except Exception as e:
            print("error is ", e)
            print("the error is" ,e)
            return Response({"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
        

class UpdateNormalUser(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, pk):
        try:
            return CustomUserModel.objects.get(pk=pk)
        except CustomUserModel.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = CreateRemoveUpdateRetrieveAdminSerializer(snippet)
        return Response(serializer.data)
        

#Obtain normal user token for authentication
class MyObtainTokenPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data['access']
        refresh_token = response.data['refresh']
        
        # Set tokens in cookies
        response.set_cookie('access_token', access_token, httponly=True, max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
        response.set_cookie('refresh_token', refresh_token, httponly=True, max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
        
        return response




# class CheckIfUserIsAuthenticated(APIView):
#     authentication_classes = [CustomJWTAuthentication]
#     def get(self, request,*args, **kwargs):
#         try:     # Your view logic here
#             return Response({"message": "Your response"}, status=status.HTTP_200_OK)
#         except AuthenticationFailed as e:
#             print("error",e)
#             return Response({"message": "Unauthorized","error":e}, status=status.HTTP_401_UNAUTHORIZED)

class CheckIfUserIsAuthenticated(APIView):
    authentication_classes = [CustomJWTAuthentication]
    
    def get(self, request, *args, **kwargs):
        try:
            # Attempt primary authentication
            self.authenticate(request)
            return self._generate_response({request.user})
        except AuthenticationFailed as e:
            print("Primary authentication failed:", e)
            
            # Attempt fallback authentication
            try:
                # Temporarily switch authentication class to fallback
                request._authenticator = RoleBasedBackend()
                self.authenticate(request)
                return self._generate_response(request.user)
            except AuthenticationFailed as e:
                print("Fallback authentication failed:", e)
                return Response({"message": "Unauthorized", "error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    def authenticate(self, request):
        """
        Authenticate the request using the provided authentication classes.
        """
        for backend in self.authentication_classes:
            try:
                user_auth_tuple = backend().authenticate(request)
                if user_auth_tuple is not None:
                    request.user, request.auth = user_auth_tuple
                    return user_auth_tuple
            except AuthenticationFailed:
                continue
        return None
    
    def _generate_response(self, user):
        """
        Generate a response with user details.
        """
        if user.is_authenticated:
            return Response({
                "message": "Authentication successful",
                "full_name": f"{user.full_name}",
                "user_id": user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)




#Logout normal user
class UserLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)



# Create Account for the Admin
class RegisterAdminUserView(generics.CreateAPIView):

    serializer_class = RegisterUserSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                role_type = validated_data['role']
                if role_type == "SuperUser Admins" or role_type =="Other Admins":
                    serializer.save()
                    return Response({"message":"Admin Created Successfully"}, status=status.HTTP_201_CREATED)
                else:
                    Response({"message":"Choose a role"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response({"errors": f"the error is {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)   
        

class LoginAdminUser(APIView):
     def post(self, request, *args, **kwargs):

        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data['email']
                password = serializer.validated_data['password']
                role = serializer.validated_data['role']
                print("role",role)

                user = authenticate(request, email=email, password=password)
                if user is not None:
                
                    if role =="SuperUser Admins" or role =="Other Admins":
                        print("hello")
                        login(request, user)
                        return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
                    elif role =="Normal User":
                        return Response({"error": "Only Admins can log in into the admin"}, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                print("the serializer error is ",serializer.errors)
                return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
             print("the error is", e)
             return Response({"errors": f"the error is {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)   
        
class CreateOrGetAllAdmins(APIView):
    """
    List all snippets, or create a new snippet.
    """
    def get(self, request, format=None):
        snippets = CustomUserModel.objects.all()
        serializer =  CreateRemoveUpdateRetrieveAdminSerializer(snippets, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = CreateRemoveUpdateRetrieveAdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GetOneDeleteUpdateAdmin(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, pk):
        try:
            return CustomUserModel.objects.get(pk=pk)
        except CustomUserModel.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = CreateRemoveUpdateRetrieveAdminSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = CreateRemoveUpdateRetrieveAdminSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)









class GetAllNormalUser(APIView):
    """
    List all snippets, or create a new snippet.
    """
    def get(self, request, format=None):
        snippets = CustomUserModel.objects.all()
        serializer =  CreateRemoveUpdateRetrieveAdminSerializer(snippets, many=True)
        return Response(serializer.data)
    
    

class GetOneDeleteNormalUser(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, pk):
        try:
            return CustomUserModel.objects.get(pk=pk)
        except CustomUserModel.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = CreateRemoveUpdateRetrieveAdminSerializer(snippet)
        return Response(serializer.data)



    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

