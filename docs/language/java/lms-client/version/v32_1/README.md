# 32_1 - 자바 클라이언트 프로젝트 만들기 

## 학습목표
- gradle을 이용하여 자바 프로젝트를 만들 수 있다.
- elipse로 import 할 수 있다.

## 실습 소스 및 결과
- src/main/java/com/eomcs/lms/ClientApp.java 추가

## 실습

### 훈련 1: 프로젝트 폴더를 생성하라
- bitcamp-study/bitcamp-project-client 디렉토리 생성

### 훈련 2: 프로젝트 폴더에 자바 프로젝트 만들기
- $gradle init 실행

### 훈련 3: 이클립스 IDE로 import하라
- build.gradle 변경
  - eclipse 플러그인 추가
  - java compile 설정
- $gradle eclipse 실행
  - gradle을 실행하여 이클립스 설정 파일 생성
- 이클립스에서 프로젝트 폴더 import

### 훈련4: 프로젝트 시작 클래스를 변경
- ClientApp.java 생성
  - 기존 App.java의 클래스 이름을 변경 후 소스코드 정리
