import jwt
from django.conf import settings
from rest_framework import authentication
from users.models import User

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        try:
            token = request.META.get("HTTP_AUTHORIZATION") # HTTP 헤더에 있는 값 가져오기
            if token is None:
                return None
            xjwt, jwt_token = token.split(" ") # Authorization: X-JWT jwt_token
            decoded = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=["HS256"])
            pk = decoded.get("pk")
            user = User.objects.get(pk=pk)
            return (user, None)
        except (ValueError, jwt.exceptions.DecodeError, User.DoesNotExist):
            return None