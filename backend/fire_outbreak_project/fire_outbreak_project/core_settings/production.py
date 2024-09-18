from .base import *

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/django_static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")
CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS").split(" ")

SESSION_COOKIE_SECURE = bool(os.environ.get("SESSION_COOKIE_SECURE"))  # Only send session cookie over HTTPS
SESSION_COOKIE_HTTPONLY = bool(os.environ.get("SESSION_COOKIE_HTTPONLY"))  # Prevent JavaScript from accessing session cookie
SESSION_COOKIE_SAMESITE = os.environ.get("SESSION_COOKIE_SAMESITE")  # Protect against CSRF by limiting cross-site cookies
CSRF_COOKIE_SECURE = bool(os.environ.get("CSRF_COOKIE_SECURE"))
CSRF_COOKIE_HTTPONLY = bool(os.environ.get("CSRF_COOKIE_HTTPONLY"))
CSRF_COOKIE_SAMESITE = os.environ.get("CSRF_COOKIE_SAMESITE")
SESSION_COOKIE_AGE = os.environ.get("SESSION_COOKIE_AGE") # 1 hour
SESSION_EXPIRE_AT_BROWSER_CLOSE = bool(os.environ.get("SESSION_EXPIRE_AT_BROWSER_CLOSE"))
CSRF_COOKIE_AGE = os.environ.get("CSRF_COOKIE_AGE")
CSRF_COOKIE_DOMAIN = os.environ.get("CSRF_COOKIE_DOMAIN")
CSRF_USE_SESSIONS = os.environ.get("CSRF_USE_SESSIONS")