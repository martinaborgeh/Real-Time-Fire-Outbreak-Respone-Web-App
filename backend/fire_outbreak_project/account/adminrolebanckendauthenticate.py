from django.contrib.auth.backends import ModelBackend
from .models import CustomUserModel





class RoleBasedBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        print(request.POST)  # Assuming username is the email
    
     
        
        try:
            user = CustomUserModel.objects.get(email=username)
            print(user.email)
            # Check if the user's role and email meet certain criteria for authentication
            if user.role == "SuperUser Admins":
                if user.check_password(password):
                    request.session['username'] = username
                    request.session['password'] = password
                    request.session.save()
                    print("role auth used",user)
                    return user
            elif user.role == "Other Admins":
                if user.check_password(password):
                    return user
        except CustomUserModel.DoesNotExist:
            print("User does not exist")
        
      
        return None

    def get_user(self, user_id):
        try:
            return CustomUserModel.objects.get(id=user_id)
        except CustomUserModel.DoesNotExist:
            return None




