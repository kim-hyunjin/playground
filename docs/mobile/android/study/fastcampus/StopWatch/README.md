# part1-chapter6
스톱워치 앱 구현

<img src="https://user-images.githubusercontent.com/24618293/198325565-594f835b-0d2c-4eb4-bd19-2a7e93d12e10.gif" width="300">

# Chapter 0. 개요

### 구현기능

- 스톱워치 기능
    - 0.1초 마다 숫자 업데이트
    - 시작, 일시정지, 정지
    - 정지 전 다이얼로그 알람
- 시작 전 카운트 다운 추가
- 카운트 다운 3초전 알림음
- 랩타임 기록

---

# Chapter 1. 학습 목표

- 안드로이드 UI 스레드를 이해하고, UI 를 그릴 수 있다
    - 시간에 따라 숫자 표현하기
    - 코틀린 코드로 동적으로 View 추가하기
- UI
    - ConstaintLayout
    - ProgressBar
- Android
    - [AlertDialog](https://developer.android.com/guide/topics/ui/dialogs?hl=ko)
    - Thread
    - runOnUiThread
    - [ToneGenerator](https://developer.android.com/reference/android/media/ToneGenerator)
    - addView

---

## [Thread](https://developer.android.com/guide/components/processes-and-threads?hl=ko#Threads)

- 스레드 : 작업 공간
- 메인 스레드 (UI 스레드) : 애플리케이션이 실행되면서 안드로이드 시스템이 생성하는 스레드로, UI 를 그리는 역할
- 작업자 스레드 (Worker Thread) : 메인스레드 이외의 스레드

### 규칙

1. UI 스레드를 차단하지 마세요.
    - 앱이 일정시간 동안 반응이 없을 경우 [ANR](https://developer.android.com/training/articles/perf-anr?hl=ko) (Application Not Responding)
2. UI 스레드 외부에서 Android UI 도구 키트에 액세스하지 마세요.
    - Exception
    
![thread](https://user-images.githubusercontent.com/24618293/198324676-b592f822-cd9d-40e7-a8cf-04a5e0e46dc1.png)


### 해결  방법

- [Activity.runOnUiThread(Runnable)](https://developer.android.com/reference/android/app/Activity?hl=ko#runOnUiThread(java.lang.Runnable))
- [View.post(Runnable)](https://developer.android.com/reference/android/view/View?hl=ko#post(java.lang.Runnable))
- [View.postDelayed(Runnable, long)](https://developer.android.com/reference/android/view/View?hl=ko#postDelayed(java.lang.Runnable,%20long))
- [Handler](https://developer.android.com/reference/android/os/Handler)


# Chapter 2. 한 걸음 더

1. Handler 를 통해서, UI 스레드 작업 해보세요
2. Handler 를 통해서 메시지를 전송 해보세요
