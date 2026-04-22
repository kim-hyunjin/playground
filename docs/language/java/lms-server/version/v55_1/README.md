# 55_1 JavaEE 의 Servlet 기술 도입하기


## 학습목표

- JavaEE/JavaSE/JavaME 기술의 특징을 이해한다.
- JavaEE 기술의 용도와 버전에 대해 이해한다.
- JavaEE implements(WAS: Web Application Server)의 상용버전과 무료 버전을 안다.
- JavaEE 버전과 WAS 버전의 관계를 이해한다.
- Tomcat Servlet Container를 설치하고 설정할 수 있다.
- Servlet 기술에 따라 클라이언트 요청을 처리할 클래스를 만들 수 있다.
- 웹 애플리케이션 서블릿 컨테이너에 배치할 수 있다.
- 웹 애플리케이션을 실행할 수 있다.

## 실습 소스 및 결과

- build.gradle 변경
- src/main/java/com/eomcs/lms/ContextLoaderListener.java 변경
- src/main/java/com/eomcs/lms/context 폴더 삭제
- src/main/java/com/eomcs/lms/servlet/XxxServlet.java 변경
- src/main/java/com/eomcs/lms/ServerApp.java 삭제

## 실습  

### 훈련1: Servlet 컨테이너를 설치 및 설정한다.

- tomcat.apache.org에서 톰캣 서블릿 컨테이너를 다운로드 한다.
- 특정 폴더에 압축을 풀고, 설정한다.
  - 관리자 ID와 비밀번호를 등록한다.
  $톰캣홈/conf/tomcat-users.xml
  - 관리자 로그인을 활성화 시킨다.
## 톰캣 서버 설정

### 서버 포트 번호 변경
- $TOMCAT_HOME/conf/server.xml 변경
  Connector 태그의 port 값을 변경 - "9999"

## tomcat 관리자 아이디 등록하기
- $TOMCAT_HOME/conf/tomcat-users.xml 파일에 role 및 user 추가
```
<role rolename="tomcat"/>
<role rolename="manager-gui"/>
<role rolename="admin-gui"/>
<user username="tomcat" password="1111" roles="tomcat,manager-gui,admin-gui"/>

```

  $톰캣홈/conf/Catalina/localhost 폴더에 manager.xml 파일 추가하고 다음과 같이 작성한다.
```
<?xml version="1.0" encoding="UTF-8"?>
<Context privileged="true" antiResourceLocking="false"
         docBase="${catalina.home}/webapps/manager">
  <Valve className="org.apache.catalina.valves.RemoteAddrValve"
         allow="^.*$" />
</Context>
```
- 톰캣 서버를 실행하고 웹 브라우저를 통해 접속, 확인한다.

### 훈련2: JavaEE Servlet기술을 사용하기 위한 라이브러리를 프로젝트에 적용한다.
- build.gradle 변경
  - search.maven.org 에서 'servlet-api'를 검색한다.
  - 의존 라이브러리 블록에 추가한다.
  - 'gradle eclipse' 실행
  - 이클립스 설정 파일을 갱신한다.
  - 이클립스 IDE의 프로젝트를 새로고침한다.

### 훈련3: JavaEE의 Servlet 기술을 사용하여 Spring IoC 컨테이너를 준비한다.
- com.eomcs.lms.ContextLoaderListener 변경
  - 서블릿 기술에서 제공하는 ServletContextListener를 구현한다.
  - Spring IoC 컨테이너를 준비한다.
- com.eomcs.lms.context 패키지 삭제


### 훈련4: 기존의 서블릿 클래스를 Java EE의 Servlet 규칙에 따라 변경한다.
- com.eomcs.lms.servlet.XxxServlet.java 변경
- com.eomcs.lms.ServerApp 삭제


### 훈련5: 애플리케이션을 빌드한다.
- build.gradle 변경
  - 웹애플리케이션 배치파일을 생성하기 위해 'war' 플러그인을 추가한다.
- 'gradle build'를 실행한다.
  - 'build/libs/bitcamp-project-server.war' 파일이 생성된다.

### 훈련6: 톰캣 서버에 배치한다.
- $톰캣홈/webapps/ 폴더에 war 파일을 놓는다.
- 톰캣서버를 실행한다.
  - 톰캣 서버는 bitcamp-project-server.war파일과 동일한 이름으로 폴더를 만들고 압축을 푼다.
  ex) $톰캣홈/webapps/bitcamp-project-server

### 훈련7: 웹 애플리케이션을 실행한다.
- board/list 실행
  - http://localhost:포트번호/웹애플리케이션이름/board/list
  - 웹애플리케이션 이름은 webapps/ 폴더에 압축을 푼 디렉토리 이름이다.
  - 예) http://localhost:9999/bitcamp-project-server/board/list
- 새글 링크 클릭
  - 화면을 찾을 수 없다.
  - 이유? 링크에 절대 경로를 사용한다.
  - webapps에 애플리케이션을 배치하면 기본으로 프로젝트명이 애플리케이션 이름이 된다.
  - 이 webapps에 있는 서블릿을 실행하려면 항상
  - 웹 애플리케이션 이름을 사용하여 실행해야 한다.
  - ex) /bitcamp-project-server/board/list
  - 해결책? 상대경로를 지정한다.

### 훈련8: URL 링크를 상대 경로로 바꾼다.

- com.eomcs.lms.servlet.XxxServlet 변경
  - 절대 경로 대신 상대 경로로 바꾼다.