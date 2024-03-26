
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



from django.contrib.auth import authenticate,login,logout



#Custom-defined Modules
from .models import CustomUserModel
from .serializers import *
from .view_helper_functions import send_email_verification_code,generate_verification_code,save_in_session

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
                validated_data['code'] = code
                save_in_session(request, validated_data)
                print('session data',request.session['unverified_details'])
                send_email_verification_code(email,code)
                return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
            else:
               errors = self.get_formatted_errors(serializer.errors)
               print("errors",errors)
               return Response({'errors': errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print("error is ",e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#Verify normal user code and save the session data in the CustomUser Model table
class VerifyAndCreateUserAccount(APIView):

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

    def post(self, request, format=None):
        print('vsession data',request.session.get('unverified_details'))
        try:
            session_data = request.session.get('unverified_details')
            if session_data is None:
                return Response({"error": "Session data not found"}, status=status.HTTP_400_BAD_REQUEST)

            client_code = request.data.get('code')  # Use request.data to get POST data
            serializer = RegisterUserSerializer(data=session_data)
            if serializer.is_valid():
                # validated_data = serializer.validated_data
                session_code = session_data['code']
                if client_code == session_code:
                    serializer.save()
                    print("saved successfully")
                    return Response("Account Created Successfully", status=status.HTTP_201_CREATED)
                else:
                    return Response("Codes are not Equal", status=status.HTTP_404_NOT_FOUND)
            else:
                errors = self.get_formatted_errors(serializer.errors)
                print("errors", errors)
                return Response({'errors': errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print("error is ", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

#Obtain normal user token for authentication
class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


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
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)