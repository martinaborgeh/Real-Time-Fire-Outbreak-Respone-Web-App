#Standard Python Modules
import random
import string
from datetime import datetime

from django.utils import timezone


#Django Modules
from django.core.mail import send_mail

def generate_verification_code():
        # Generate a random 4-digit code
        return ''.join(random.choices(string.digits, k=4))

def send_email_verification_code(email, code):
    recipient_list = [email, ]
    subject = 'Email Verification'
    message = f'''
    <html>
      <body>
        <p>Dear User,</p>
        <p>Your verification code is: <b>{code}</b> </p>
        <p>Please enter this code to complete the verification process.</p>
        <p>Thank you!</p>
        <hr>
        <h3>EFKIWORLD</h3>
        <p>Address: Kumasi, Ghana</p>
        <p>Contact: +233 548779540</p>
      </body>
    </html>
    '''
    # html_message = message.format(logo_url=logo_url, code=code)
    send_mail(subject, '', 'lordoffin30@gmail.com', recipient_list, html_message=message)

# send_email_verification_code("offinlordponkor@yahoo.com", "40F884j")

def save_in_session(requestobj,validatation_data):
    validatation_data['code_verification_timeout'] = validatation_data['code_verification_timeout'].isoformat()
    requestobj.session['unverified_details'] = validatation_data
    
    requestobj.session.save()

def delete_from_session(requestobj):
    try:
        del requestobj.session['unverified_details']
    except KeyError:
        print("no such session key")

def delete_from_cookie(responseobj,cookie_item):
     try:
        responseobj.delete_cookie(cookie_item)
     except:
          print("no such cookie key") 

def check_code_verification_timeout(session_data):
     if session_data:
        expiry_time_str = session_data['code_verification_timeout']
        expiry_time = datetime.fromisoformat(expiry_time_str)
        current_time = timezone.now()
        if current_time>= expiry_time:
              delete_from_session(session_data)
              return True
        elif current_time < expiry_time:
              return False
     else:
          return True
     


def validate_code_email(client_code,client_email,session_email):
     if not client_code:
          return "Your input is empty"
     elif client_code and len(client_code)<4:
          return "Your input canot be less than 4"
     elif client_code and len(client_code)==4 and client_email=="No Email":
          return "You do not have account or your code has expired"             
     elif client_code and len(client_code)==4 and client_email!="No Email":
          
          if session_email ==client_email:
              return "client data is validated successfully"
          elif session_email!=client_email:
              return "Your email is invalid"
          
          
                    
                    