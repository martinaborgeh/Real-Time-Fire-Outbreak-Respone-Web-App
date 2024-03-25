#Standard Python Modules
import random
import string

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
    requestobj.session['unverified_details'] = validatation_data
    
    requestobj.session.save()
    