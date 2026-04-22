    프로젝트마다 별도의 개발환경을 만들기 위해 pipenv를 사용.
    python을 설치하면 기본으로 함께 설치되는 pip는 우리가 설치할 django나 다른 패키지들을 전역으로설치한다.
    전역으로 설치하면 개별 프로젝트를 독립적으로관리하기 어렵다.

**개발환경 준비**

    0) python 설치(3.7)
    1) pipenv를 설치
    2) 프로젝트 폴더에서 $pipenv --three //파이썬3 버전을 사용할 것이라고 pipenv에게 알려주기
    ==> Pipfile이 생성됨. package.json같은 파일임.
    3) #pipenv shell    //독립적인 프로젝트 관리를 위한 쉘(버블) 안에 들어가기. Launching subshell in virtual environment…
    4) $pipenv install Django==2.2.5
    5) $django-admin
    6) gitignore 파일 만들기
        - googling : gitignore python

**장고 프로젝트 만들기**

    1) $ django-admin startproject config
        -> config폴더와 manage.py파일 생성됨
        -> 바깥 config폴더 이름을 Aconfig(다른이름도 ok)로 바꾸기
        -> 안에 있는 config폴더와 manage.py 밖으로 꺼내기
        -> Aconfig 삭제

**vscode 설정하기**

    -> 인터프리터 버전 설정
    -> Linter(소스코드에서 에러가 생길 부분을 미리 감지)
        - pylint, flake8(우리는 이걸 사용)
    -> Linter는 python pep(코드 쓸 때 권장사항)을 준수
    <https://www.python.org/dev/peps/pep-0008/>
    -> formatter - 소스코드를 이쁘게 정리해줌.
        -black

**config폴더**

    폴더 안 __init__.py 파일이 있어야 다른 곳에서 파이썬 패키지처럼 쓸 수 있음.
    settings.py 안 TIME_ZONE = 'Asia/Seoul'으로 수정.

**서버 구동**

    \$python manage.py runserver

**관리자 계정 만들기**

    \$python manage.py createsuperuser

<http://127.0.0.1:8000/admin/>

**장고와 데이터베이스 동기화**

    \$python manage.py migrate
