from django.core.management.base import BaseCommand
from rooms.models import HouseRule


class Command(BaseCommand):
    help = "This command creates room types"

    def handle(self, *args, **options):
        if(len(HouseRule.objects.all()) > 0):
          return
        houseRule = [
            "흡연금지",
            "반려동물 동반 불가",
            "파티나 이벤트 금지",
            "어린이와 유아에게 적합하지 않음",
            "키패드(으)로 셀프 체크인"
        ]
        for a in houseRule:
            HouseRule.objects.create(name=a)
        self.stdout.write(self.style.SUCCESS("House rules created!"))