# favorite_places

## 빌드 문제

1. location 라이브러리 코틀린 버전 문제

### how to fix

```text
android studio에서
flutter plugins 중 location-4.4.0을 찾아 build.gradle에서 ext.kotlin_version 값을 다음과 같이 변경
ext.kotlin_version = '1.5.20'
```

## 환경변수 셋팅

1. root경로에 .env 파일 추가
2. build_runner 실행

```bash
flutter pub run build_runner build
```
