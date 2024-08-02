from .base import *

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/django_static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)