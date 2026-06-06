# 31_3 - 애플리케이션을 시작하거나 종료할 때 안내 문구를 출력하기

## 학습목표

- `Observer` 디자인 패턴에 따라 기능을 추가할 수 있다.

## 실습 소스 및 결과

- src/main/java/com/eomcs/lms/GreetingListener.java 추가
- src/main/java/com/eomcs/lms/App.java 변경

## 실습

### 훈련 1: 애플리케이션이 시작하거나 종료할 때 안내 문구를 출력할 옵저버를 만들라

- GreetingListener.java 추가
  - ApplicationContextListener를 구현한다.
  - 안내문구를 출력한다.