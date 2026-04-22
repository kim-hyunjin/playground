from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    
    # 비밀번호 노출을 막기 위해 쓰기 전용으로 설정
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "avatar",
            "superhost",
            "password",
        )
        read_only_fields = ("id", "superhost", "avatar")

    def validate_first_name(self, value):
        return value.upper()

    def create(self, validated_data):
        password = validated_data.get("password")
        user = super().create(validated_data)
        user.set_password(password) # 해싱알고리즘을 사용해 비밀번호 설정
        user.save()
        return user

# class RelatedUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = (
#             "username",
#             "first_name",
#             "last_name",
#             "email",
#             "avatar",
#             "superhost"
#         )

# class ReadUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         exclude = (
#             "groups",
#             "user_permissions",
#             "password",
#             "last_login",
#             "is_superuser",
#             "is_staff",
#             "is_active",
#             "date_joined",
#             "favs",
#         )

# class WriteUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ("username", "first_name", "last_name", "email")

#     def validate_first_name(self, value):
#         print(value)
#         return value.upper()