#Third Party Modules
from rest_framework.response import Response
from rest_framework import status

#django modules
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group, Permission

#Custom created modules
from .models import CustomUserModel
from .serializers import RegisterUserSerializer

# class CustomUserAdmin(UserAdmin):
#     model = CustomUserModel
#     list_display = ('email', 'full_name', 'role', 'is_active', 'is_staff')
#     list_filter = ('role', 'is_active', 'is_staff', 'groups')
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Personal info', {'fields': ('full_name',)}),
#         ('Permissions', {'fields': ('role', 'groups', 'user_permissions', 'is_active', 'is_staff')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2', 'full_name', 'role', 'groups', 'user_permissions', 'is_active', 'is_staff'),
#         }),
#     )
#     search_fields = ('email',)
#     ordering = ('email',)
 

# # Register the CustomUser model with the custom admin class
# admin.site.register(CustomUserModel, CustomUserAdmin)





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

    def save_model(self, request, obj, form, change):
        # Instantiate RegisterUserSerializer with the form data
        serializer = RegisterUserSerializer(data=form.cleaned_data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            role_type = validated_data['role']
            if role_type == "SuperUser Admins" or role_type =="Other Admins":
                serializer.save()
                return Response({"message":"Admin Created Successfully"}, status=status.HTTP_201_CREATED)
            elif role_type =="Normal User":
                Response({"message":"Cannot create Normal in the Admin Panel"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            else:
                Response({"message":"Choose a role"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            # Save the validated data
            user = serializer.save()
            obj = user  # Assign the saved user object to obj
            super().save_model(request, obj, form, change)
        else:
            # Handle validation errors
            # You may want to raise an exception or log the errors here
            pass

# Register the CustomUser model with the custom admin class
admin.site.register(CustomUserModel, CustomUserAdmin)

