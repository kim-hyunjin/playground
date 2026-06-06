# 28_2 - CSV 문자열을 객체로 전환하는 기능을 도메인 객체로 이전 

## 학습 목표 

- 코드를 메서드로 추출할 수 있다.(리팩토링)
- 메서드를 역할에 맞춰 다른 클래스로 이동할 수 있다.(리팩토링)
- 스태틱 메서드의 용도를 이해하고 활용할 수 있다.
- 인스턴스 메서드의 용도를 이해하고 활용할 수 있다.

## 실습 소스 및 결과

- src/main/java/com/eomcs/lms/App.java 변경
- src/main/java/com/eomcs/lms/domain/Board.java 변경
- src/main/java/com/eomcs/lms/domain/Member.java 변경
- src/main/java/com/eomcs/lms/domain/Lesson.java 변경
  
## 실습  

### 훈련 1: 게시물 데이터를 CSV 문자열로 다루는 코드를 Board 클래스로 옮겨라.  

- Board.java
  - CSV 문자열을 가지고 Board 객체를 생성하는 valueOf() 를 추가한다.
  - Board 객체를 가지고 CSV 문자열을 리턴하는 toCsvString() 를 추가한다.
- App.java
  - loadBoardData() 를 변경한다.
  - saveBoardData() 를 변경한다.
  
### 훈련 2: 회원 데이터를 CSV 문자열로 다루는 코드를 Member 클래스로 옮겨라.  

- Member.java
  - CSV 문자열을 가지고 Member 객체를 생성하는 valueOf() 를 추가한다.
  - Member 객체를 가지고 CSV 문자열을 리턴하는 toCsvString() 를 추가한다.
- App.java
  - loadMemberData() 를 변경한다.
  - saveMemberData() 를 변경한다.
  
### 훈련 3: 수업 데이터를 CSV 문자열로 다루는 코드를 Lesson 클래스로 옮겨라.  

- Lesson.java
  - CSV 문자열을 가지고 Lesson 객체를 생성하는 valueOf() 를 추가한다.
  - Lesson 객체를 가지고 CSV 문자열을 리턴하는 toCsvString() 를 추가한다.
- App.java
  - loadLessonData() 를 변경한다.
  - saveLessonData() 를 변경한다.
  
  
#### 실행 결과

`App`을 실행한 후 회원 데이터를 입력한다.
```
명령> /member/add
번호? 1
이름? 홍길동
...

명령> quit
안녕!
```

종료한 후에 다시 `App`을 실행하면 이전에 입력한 내용을 확인할 수 있다.
```
명령> /member/list
  1, 홍길동      , 2019-01-01 ~ 2019-05-05,  160
```

### 훈련 3: 게시글 데이터를 파일에 보관하라.

- App.java
    - 애플리케이션을 실행했을 때 파일에서 게시글 데이터를 읽어오는 `loadBoardData()`를 정의한다.
    - 애플리케이션을 종료할 때 게시글 데이터를 파일에 저장하는 `saveBoardData()`를 정의한다.
    - 게시글 데이터를 저장할 ArrayList 객체는 위에서 만든 메서드에서 접근할 수 있도록 스태틱 필드로 전환한다.

#### 실행 결과

`App`을 실행한 후 회원 데이터를 입력한다.
```
명령> /board/add
번호? 1
내용? 안녕하세요.
저장하였습니다.

명령> /board/add
번호? 2
내용? 게시글을 올려주세요.
저장하였습니다.

명령> /board/list
  1, 안녕하세요.              , 2019-01-01, 0
  2, 게시글을 올려주세요.        , 2019-01-01, 0

명령> quit
안녕!
```

종료한 후에 다시 `App`을 실행하면 이전에 입력한 내용을 확인할 수 있다.
```
명령> /board/list
  1, 안녕하세요.              , 2019-01-01, 0
  2, 게시글을 올려주세요.        , 2019-01-01, 0

명령> 
```













