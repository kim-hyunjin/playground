from django.urls import path
from . import views
# from . import viewsets
from rest_framework.routers import DefaultRouter

app_name = "rooms"

router = DefaultRouter()
router.register("", views.RoomViewSet)
urlpatterns = router.urls

# urlpatterns = [
#     # path("list/", views.ListRoomsView.as_view()),
#     path("", views.RoomsView.as_view()),
#     path("search/", views.room_search),
#     path("<int:pk>/", views.RoomView.as_view()),
# ]