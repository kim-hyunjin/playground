# part1-chapter4
응급의료정보 앱

데이터 저장 및 불러오기

<img src="https://user-images.githubusercontent.com/24618293/197409325-89013c32-5221-41cc-a94a-bc8db9afa916.gif" width="300">

전화 앱 실행하기

<img src="https://user-images.githubusercontent.com/24618293/197409413-d9e5c63b-a931-49c2-8043-c463c13ac826.gif" width="300">

데이터 삭제하기

<img src="https://user-images.githubusercontent.com/24618293/197409416-b8a2bfd9-10b9-426b-aaa1-1558eb1fc7e3.gif" width="300">

# Chapter 0. 개요

### 구현기능

- 다양한 유저정보
    - 이름
    - 생년월일
    - 혈액형
    - 비상연락처
    - 기타
- 화면 전환
- 다른 앱 실행
- 데이터 저장

---

# Chapter 1. 학습 목표

- 다양한 위젯을 사용하고, 테마를 이용하여 일관성 있는 UI 를 그릴 수 있다.
    - ConstraintLayout 과 다양한 위젯을 활용
    - Style 을 통한 일관성 있는 UI 구성
    - Adapter 에 대한 이해
    - 간단한 데이터 저장
    - 다른 화면으로 이동
    - 다른 앱 실행
- UI
    - ConstraintLayout
        - guideLine
    - Sytle
    - Theme
    - ImageView
    - RadioButton
    - CheckBox
    - [Spinner](https://developer.android.com/guide/topics/ui/declaring-layout?hl=ko#AdapterViews)
    - DatePickerDialog
- Kotlin
    - const val
    - with
- Android
    - [Manifest](https://developer.android.com/guide/topics/manifest/manifest-intro)
    - [Intent](https://developer.android.com/guide/components/intents-filters?hl=ko)
        - [화면 전환](https://developer.android.com/training/basics/firstapp/starting-activity?hl=ko)
        - [전화 앱 실행](https://developer.android.com/guide/components/intents-common?hl=ko#DialPhone)
    - [SharedPreference](https://developer.android.com/training/data-storage/shared-preferences?hl=ko)
    - Toast


# Chapter 2. 한 걸음 더
    1. Intent 로 할 수 있는 다양한 동작에 대해 학습해보세요
        - https://developer.android.com/reference/android/content/Intent?hl=ko
    2. Manifest 에 들어가는 다양한 값들에 대해 학습해보세요
        - https://developer.android.com/guide/topics/manifest/manifest-intro#reference
    3. Kotlin 의 다양한 ScopeFunction 에 대해 학습해보세요
        - https://kotlinlang.org/docs/scope-functions.html
