from django.core.management.base import BaseCommand
from rooms.models import RoomType


class Command(BaseCommand):
    help = "This command creates room types"

    def handle(self, *args, **options):
        if(len(RoomType.objects.all()) > 0):
          return
        roomtypes = [
            "주택",
            "아파트",
            "게스트 스위트",
            "게스트용 별채",
            "담무소(이탈리아)",
            "로프트",
            "방갈로",
            "샬레",
            "저택",
            "전원주택",
            "키클라데스 주택(그리스)",
            "타운하우스",
            "통나무집",
            "트룰로(이탈리아)",
            "펜션(한국)",
        ]
        for a in roomtypes:
            RoomType.objects.create(name=a)
        self.stdout.write(self.style.SUCCESS("Room types created!"))