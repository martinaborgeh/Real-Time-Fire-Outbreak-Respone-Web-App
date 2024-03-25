from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
import re


@deconstructible
class CustomEmailValidator:
    def __init__(self, domain="gmail.com"):
        self.domain = domain

    def __call__(self, value):
        if not re.match(fr"^[a-zA-Z0-9._%+-]+@{self.domain}$", value):
            raise ValidationError(
                f"Enter a valid school email address with the domain {self.domain}",
                code="invalid_email",
            )