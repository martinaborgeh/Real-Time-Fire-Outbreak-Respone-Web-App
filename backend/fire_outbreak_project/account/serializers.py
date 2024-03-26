from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from .models import CustomUserModel

class VerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=CustomUserModel.objects.all())]
    )
    full_name = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    code = serializers.CharField(read_only=True) 
    
    


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        if user.role == "Normal User":
            token = super(MyTokenObtainPairSerializer, cls).get_token(user)
            token["email"] = user.email
        
            return token
        else:
            raise AuthenticationFailed("Invalid Credential")



class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=CustomUserModel.objects.all())]
    )
    full_name = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUserModel
        fields = ("full_name", "password", "password2", "email")

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        user = CustomUserModel.objects.create(
            email=validated_data["email"],
            full_name=validated_data["full_name"],
        )

        user.set_password(validated_data["password"])
        user.is_active = True
        user.save()

        return user
    
#Login Serializer for Admins
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()