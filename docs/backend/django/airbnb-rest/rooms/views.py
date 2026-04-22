# from rest_framework.generics import ListAPIView, RetrieveAPIView
# from rest_framework import pagination
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status
# from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action, api_view
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer
from .permissions import IsOwner

class RoomViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwner]
        return [permission() for permission in permission_classes] # permission_classes의 permission을 모두 실행한 결과값을 담은 배열을 리턴

    @action(detail=False) # /rooms 에만 적용하기 위해 detail=False설정
    def search(self, request): # /rooms/search/
        max_price = request.GET.get("max_price", None)
        min_price = request.GET.get("min_price", None)
        beds = request.GET.get("beds", None)
        bedrooms = request.GET.get("bedrooms", None)
        bathrooms = request.GET.get("bathrooms", None)
        lat = request.GET.get("lat", None)
        lng = request.GET.get("lng", None)

        filter_kwargs = {}
        if max_price is not None:
            filter_kwargs["price__lte"] = max_price
        if min_price is not None:
            filter_kwargs["price__gte"] = min_price
        if beds is not None:
            filter_kwargs["beds__gte"] = beds
        if bedrooms is not None:
            filter_kwargs["bedrooms__gte"] = bedrooms
        if bathrooms is not None:
            filter_kwargs["bathrooms__gte"] = bathrooms
        if lat is not None and lng is not None:
            filter_kwargs["lat__gte"] = float(lat) - 0.005
            filter_kwargs["lat__lte"] = float(lat) + 0.005
            filter_kwargs["lng__gte"] = float(lng) - 0.005
            filter_kwargs["lng__lte"] = float(lng) + 0.005
        
        try:
            rooms = Room.objects.filter(**filter_kwargs)
        except ValueError:
            rooms = Room.objects.all()
            
        # paginator = self.paginator # ViewSet의 기본 페이지네이터 사용(PageNumberPaginator)
        # results = paginator.paginate_queryset(rooms, request)
        serialized_room = RoomSerializer(rooms, many=True, context={"request": request}).data
        return Response(serialized_room)

# @api_view(["GET", "POST"])
# def list_rooms(request):
#     if request.method == "GET":
#         rooms = Room.objects.all()
#         serialized_rooms = RoomSerializer(rooms, many=True).data
#         return Response(data=serialized_rooms)
#     elif request.method == "POST":
#         if not request.user.is_authenticated:
#             return Response(status=status.HTTP_401_UNAUTHORIZED)

#         serializer = WriteRoomSerializer(data=request.data)
#         if serializer.is_valid():
#             # create()나 update() 메소드를 직접 호출하면 안된다. 대신 save() 메소드를 호출하면 내부적으로 알아서 판단해 create또는 update를 호출한다.
#             room = serializer.save(user=request.user)
#             return Response(data=RoomSerializer(room).data, status=status.HTTP_200_OK)
#         else:
#             return Response(dara=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
class OwnPagination(PageNumberPagination):
    page_size = 20

class RoomsView(APIView):

    def get(self, request):
        paginator = OwnPagination()
        rooms = Room.objects.all()
        results = paginator.paginate_queryset(rooms, request)
        serialized_rooms = RoomSerializer(results, many=True).data
        return paginator.get_paginated_response(serialized_rooms)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = RoomSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # create()나 update() 메소드를 직접 호출하면 안된다. 대신 save() 메소드를 호출하면 내부적으로 알아서 판단해 create또는 update를 호출한다.
        room = serializer.save(user=request.user)
        return Response(data=RoomSerializer(room).data, status=status.HTTP_200_OK)

class RoomView(APIView):

    def get_room(self, pk):
        try:
            room = Room.objects.get(pk=pk)
            return room
        except Room.DoesNotExist:
            return None

    def get(self, request, pk):
        room = self.get_room(pk)
        if room is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = RoomSerializer(room).data
        return Response(serializer)

    def put(self, request, pk):
        room = self.get_room(pk)
        if room is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if room.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        serializer = RoomSerializer(room, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        room = serializer.save()       
        return Response(RoomSerializer(room).data)

    def delete(self, request, pk):
        room = self.get_room(pk)
        if room.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if room is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        room.delete()
        return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def room_search(request):
    max_price = request.GET.get("max_price", None)
    min_price = request.GET.get("min_price", None)
    beds = request.GET.get("beds", None)
    bedrooms = request.GET.get("bedrooms", None)
    bathrooms = request.GET.get("bathrooms", None)
    lat = request.GET.get("lat", None)
    lng = request.GET.get("lng", None)

    # Django queryset filter 만들기
    filter_kwargs = {}
    if max_price is not None:
        filter_kwargs["price__lte"] = max_price
    if min_price is not None:
        filter_kwargs["price__gte"] = min_price
    if beds is not None:
        filter_kwargs["beds__gte"] = beds
    if bedrooms is not None:
        filter_kwargs["bedrooms__gte"] = bedrooms
    if bathrooms is not None:
        filter_kwargs["bathrooms__gte"] = bathrooms
    if lat is not None and lng is not None:
        filter_kwargs["lat__gte"] = float(lat) - 0.005
        filter_kwargs["lat__lte"] = float(lat) + 0.005
        filter_kwargs["lng__gte"] = float(lng) - 0.005
        filter_kwargs["lng__lte"] = float(lng) + 0.005
    
    paginator = OwnPagination()
    try:
        rooms = Room.objects.filter(**filter_kwargs) # **를 사용하면 dictionary가 price__lte='30', beds__gte='2', bathrooms__gte='2'와 같이 된다.
    except ValueError:
        rooms = Room.objects.all()
        
    results = paginator.paginate_queryset(rooms, request)
    serialized_room = RoomSerializer(results, many=True, context={"request": request}).data
    return paginator.get_paginated_response(serialized_room)
'''