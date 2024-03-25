from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
import uuid

from .emailvalidator import CustomEmailValidator

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, role=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)

        validators = [CustomEmailValidator(domain="gmail.com")]  # Adjust this validator as needed

        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        
        user.full_clean()
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, role=None, **extra_fields):
        if role == "SuperUser Admins" or role == "Other Admins":
            if role == "SuperUser Admins":
                extra_fields.setdefault("is_staff", True)
             
                extra_fields.setdefault("is_superuser", True)
                return self.create_user(email, password, role=role, **extra_fields)

            elif role == "Other Admins":
                extra_fields.setdefault("is_staff", True)
                extra_fields.setdefault("is_superuser", False)
                return self.create_user(email, password, role=role, **extra_fields)
        elif role == "Normal User":
            raise ValueError("Roles Must be chosen for Admins")
        



class CustomUserModel(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    ROLE_CHOICES = (("Other Admins", "Other Admins"), ("SuperUser Admins", "SuperUser Admins"),("Normal User", "Normal User"))
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES,default="Normal User"
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=256)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)  # Only admin users should be staff
    is_superuser = models.BooleanField(default=False)  # Only superuser admins should be superusers


    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set',  # Change related_name to avoid clash
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set',  # Change related_name to avoid clash
        related_query_name='custom_user',
    )


    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "role"]
    

    def __str__(self):
        return self.email


