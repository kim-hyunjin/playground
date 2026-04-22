# Django REST Framework 기반 Airbnb 클론: 효율적인 RESTful API 설계

본 프로젝트는 **Python**의 대표적인 웹 프레임워크인 **Django**와 **Django REST Framework (DRF)**를 활용하여, 에어비앤비(Airbnb)의 숙소 예약 시스템을 REST API 형태로 구현한 프로젝트입니다.

---

## 🏗 시스템 구조 및 데이터 모델링

마이크로서비스와 유사한 독립적인 앱 구조(`rooms`, `users`, `core`)를 통해 유지보수성을 높였습니다.

### 1. 추상화된 베이스 모델 (Abstract Base Model)
모든 데이터 모델에서 공통으로 사용되는 `created` 및 `modified` 필드를 `CoreModel`로 정의하여 중복을 제거하였습니다.

```python
# core/models.py
class CoreModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
```

### 2. 숙소 및 사진 모델
숙소(`Room`)와 사진(`Photo`) 간의 **1:N 관계**를 설정하고, `related_name`을 활용하여 역참조를 최적화하였습니다.

```python
# rooms/models.py
class Room(CoreModel):
    name = models.CharField(max_length=140)
    price = models.IntegerField()
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="rooms")

class Photo(CoreModel):
    file = models.ImageField()
    room = models.ForeignKey("rooms.Room", related_name="photos", on_delete=models.CASCADE)
```

---

## 🔑 핵심 구현 기술

### 1. DRF ViewSet을 이용한 생산성 극대화
`ModelViewSet`을 활용하여 숙소 정보의 조회, 생성, 수정, 삭제(CRUD) API를 단 몇 줄의 코드로 구현하였습니다.

```python
# rooms/viewsets.py
from rest_framework import viewsets
from .models import Room
from .serializers import RoomSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
```

### 2. Serializer를 통한 데이터 변환 및 검증
클라이언트로부터 받은 JSON 데이터를 파이썬 객체로 변환(Deserialization)하고, 모델 데이터를 JSON으로 변환(Serialization)하는 과정을 엄격한 유효성 검증과 함께 처리합니다.

### 3. 인증 및 권한 관리 (Authentication & Permissions)
- **JWT 인증:** 사용자 로그인을 통해 발급된 토큰을 검증하여 요청의 유효성을 판단합니다.
- **Custom Permissions:** 숙소 정보의 수정/삭제는 해당 숙소의 소유자만 가능하도록 커스텀 권한을 설정하였습니다.

---

## 🛠 주요 도구 및 라이브러리
- **Django:** 웹 프레임워크의 근간.
- **Django REST Framework:** RESTful API 구축을 위한 툴킷.
- **Pillow:** 이미지 업로드 및 처리를 위한 라이브러리.
- **Pipenv:** 파이썬 패키지 및 가상환경 관리.

---

## 📈 학습 포인트
- **ORM(Object-Relational Mapping):** 복잡한 SQL 쿼리 없이 파이썬 코드로 데이터베이스를 제어하는 방법.
- **RESTful API Design:** 리소스 중심의 URL 설계와 HTTP Method의 올바른 활용.
- **Admin Customization:** Django Admin 패널을 커스터마이징하여 관리 도구를 구축하는 방법.

---
*본 프로젝트는 DRF를 통해 현대적인 백엔드 API 서버를 빠르고 견고하게 구축하는 방법을 익히기 위해 제작되었습니다.*
