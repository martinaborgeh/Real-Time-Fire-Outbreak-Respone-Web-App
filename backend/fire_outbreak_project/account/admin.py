#Third Party Modules
from rest_framework.response import Response
from rest_framework import status

#django modules
from django.contrib import admin,messages
from django.contrib.auth.admin import UserAdmin


#Custom created modules
from .models import CustomUserModel
from .serializers import RegisterUserSerializer

class CustomUserAdmin(UserAdmin):
    model = CustomUserModel
    list_display = ('email', 'full_name', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff', 'groups')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name',)}),
        ('Permissions', {'fields': ('role', 'groups', 'user_permissions', 'is_active', 'is_staff')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'full_name', 'role', 'groups', 'user_permissions', 'is_active', 'is_staff'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
 

# Register the CustomUser model with the custom admin class
admin.site.register(CustomUserModel, CustomUserAdmin)




