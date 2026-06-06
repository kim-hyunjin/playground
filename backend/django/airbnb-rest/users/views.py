# from rest_framework import permissions
# from rest_framework.views import APIView
# from rest_framework.permissions import IsAuthenticated
import jwt
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny
from users.models import User
from users.serializers import UserSerializer
from .permissions import IsSelf
from rooms.serializers import RoomSerializer
from rooms.models import Room



class UsersViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAdminUser]
        elif self.action == "create" or self.action == "retrieve" or self.action == "favs":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsSelf]

        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["post"])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        encoded_jwt = jwt.encode({"pk": user.pk}, settings.SECRET_KEY, algorithm="HS256")
        return Response(data={"token": encoded_jwt, "id": user.pk})

    @action(detail=True)
    def favs(self, request, pk): # detail=True 인 경우 id값이 파라미터로 넘어온다.
        user = self.get_object() # 현재 뷰가 보여주는 object를 리턴
        serialized_favs = RoomSerializer(user.favs.all(), many=True, context={"request": request}).data
        return Response(serialized_favs)

    @favs.mapping.put # favs 액션에 put메소드 추가하기
    def toggle_favs(self, request, pk):
        pk = request.data.get("pk", None)
        if pk is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = self.get_object()
            room = Room.objects.get(pk=pk)
            if room in user.favs.all():
                user.favs.remove(room)
            else:
                user.favs.add(room)
            return Response()
        except Room.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


'''
class UsersView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        new_user = serializer.save()
        return Response(UserSerializer(new_user).data)


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response()


class FavsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = RoomSerializer(user.favs.all(), many=True).data
        return Response(serializer)

    def put(self, request):
        pk = request.data.get("pk", None)
        if pk is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = request.user
            room = Room.objects.get(pk=pk)
            if room in user.favs.all():
                user.favs.remove(room)
            else:
                user.favs.add(room)
            return Response()
        except Room.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    encoded_jwt = encode({"pk": user.pk}, settings.SECRET_KEY, algorithm="HS256")
    return Response(data={"token": encoded_jwt})
'''