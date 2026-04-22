# 28_3 - 파일 포맷으로 JSON 도입하기

## 학습 목표 

- 외부 라이브러리를 가져와서 프로젝트에 적용할 수 있다.
- JSON 포맷의 사용이점을 이해한다.
- Google JSON 라이브러리를 사용할 수 있다.

## JSON 데이터 포맷 특징
- 문자열로 데이터를 표현한다.
- '{property:value}' 방식으로 객체의 값을 저장한다.
- binary방식에 비해 데이터가 커지는 문제가 있지만, 모든 프로그래밍 언어에서 다룰 수 있다.
  그래서 cross platform(OS, programming language...)간에 데이터를 교환할 때 많이 사용한다.
<pre>
JSON(제이슨[1], JavaScript Object Notation)은 
속성-값 쌍( attribute–value pairs and array data types (or any other serializable value)) 
또는 "키-값 쌍"으로 이루어진 데이터 오브젝트를 전달하기 위해 인간이 읽을 수 있는 텍스트를 사용하는 
개방형 표준 포맷이다. 비동기 브라우저/서버 통신 (AJAX)을 위해, 넓게는 XML(AJAX가 사용)을 대체하는 
주요 데이터 포맷이다. 특히, 인터넷에서 자료를 주고 받을 때 그 자료를 표현하는 방법으로 알려져 있다. 
자료의 종류에 큰 제한은 없으며, 특히 컴퓨터 프로그램의 변수값을 표현하는 데 적합하다.

본래는 자바스크립트 언어로부터 파생되어 자바스크립트의 구문 형식을 따르지만 언어 독립형 데이터 포맷이다. 
즉, 프로그래밍 언어나 플랫폼에 독립적이므로, 구문 분석 및 JSON 데이터 생성을 위한 코드는 
C, C++, C#, 자바, 자바스크립트, 펄, 파이썬 등 수많은 프로그래밍 언어에서 쉽게 이용할 수 있다.
<위키백과>
</pre>
## 실습 소스 및 결과

- src/main/java/com/eomcs/lms/App.java 변경
- Google JSON 라이브러리를 사용할 수 있다.
  
## 실습  소스 및 결과
- build.gradle 변경
- src/main/java/com/eomcs/lms/App.java 변경

## 실습

### 훈련 1: Gradle 스크립트 파일에 Google JSON 라이브러리를 추가하라
- json.org 사이트에서 라이브러리 검색
- mavenrepository.com에서 'gson'키워드로 라이브러리 검색
- build.gradle 편집
  - 의존 라이브러리 블록에 gson 정보를 추가한다.
- 이클립스 설정 파일을 갱신한다.
  - 'gradle eclipse' 실행
  - 이클립스에서 해당 프로젝트 refresh
  - 'Referenced Libraries'노드에서 gson 라이브러리 파일이 추가된 것을 확인
  
### 훈련 2: 게시물 데이터를 저장하고 읽을 때 JSON 형식을 사용하라.
- App.java
  - saveBoardData()를 변경한다.
  - loadBoardData()를 변경한다.

### 훈련 3: 회원 데이터를 저장하고 읽을 때 JSON 형식을 사용하라.
- App.java
  - saveMemberData()를 변경한다.
  - loadMemberData()를 변경한다.
  
### 훈련 4: 수업 데이터를 저장하고 읽을 때 JSON 형식을 사용하라.
- App.java
  - saveLessonData()를 변경한다.
  - loadLessonData()를 변경한다.
  
### 훈련 5: Arrays의 메서드를 활용하여 배열을 List 객체로 만들어라.
- App.java
  - 해당 부분의 코드를 변경한다.

  
