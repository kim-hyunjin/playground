**어플리케이션**

    function의 집합
    ex) airbnb room 어플리케이션
    - room 생성하기
    - room 검색하기
    - room 삭제하기
    - room 수정하기
    - room 페이지 보여주기
    - room 업로드
    - room 리뷰하기
    - room 예약하기
    ...

    ex) 리뷰 어플리케이션
    - 리뷰 작성하기
    - 리뷰 삭제하기
    - 리뷰 수정하기
    - 리뷰 나열하기
    ...

    ex) 유저 어플리케이션
    - 로그인
    - 로그아웃
    - 메시지 기능
    - 팔로우 기능
    - 룸 리스트

`devide & conquer 방식을 사용할 것이다.`

    ex) list 어플리케이션은 오직    list만 다룬다.
    ex) 예약 어플리케이션은 예약만  다룬다.

`여러 작은 function 집합을 만들고 이 모든걸 합해서 config에 import할 것임`

<Tip>
한 문장으로 어플리케이션을 표현할 수 있어야 한다.

**어플리케이션 만들기**

    \$django-admin startapp rooms(반드시 복수형으로)

`react같은 library는 그저 build하기 위해 가져다 마음껏 사용할 수 있지만, django와 같은 framework를 사용할 때는 framework의 룰에 따라야 한다.`

\$django-admin startapp을 했을 때 장고가 생성한 파일이나 폴더들은 이름을 변경하거나 삭제해선 안된다. 추가생성은 가능.

- urls.py는 url을 컨트롤.
- view.py는 사용자 화면을 컨트롤
- models.py에는 데이터베이스
  등등

_User App_

장고에서 제공하는 user모델을 커스텀 user모델로 대체하기

- users의 models.py에서 모델 만들기
  - models에 작성한 내용을 장고가 form으로 만들어준다.
  - 그리고 database에 migration과 함께 form에 필요한 정보를 요청.
- settings.py 에서 AUTH_USER_MODEL = 'myapp.Myuser' 추가
- \$python manage.py makemigrations
- \$python manage.py migrate
  장고에서 우리가 만든 폴더를 인식하게하려면 setting.py에 등록해줘야한다.

장고는 데이터베이스와 통신. ORM(Object Relational Mapping) 탑재

**User App Recap**
models.py에 django에서 기본으로 제공하는 field 적용.<br>
모든 field는 데이터베이스로 들어감.<br>
장고가 알아서 sql문으로 바꿔줌.<br>

admin.py에서 model을 가져오려면 resister해줘야 함.<bre>
이를 위해 class필요.

<pre>
@admin.register(models.User)
class CustomUserAdmin(UserAdmin):
</pre>
