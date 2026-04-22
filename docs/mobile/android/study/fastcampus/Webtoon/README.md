# 웹툰앱 (part2 - chapter 1)


![스크린샷](https://github.com/Fastcampus-Android-Lecture-Project-2023/part2-chapter1/blob/main/screenshot/1.png)
![스크린샷](https://github.com/Fastcampus-Android-Lecture-Project-2023/part2-chapter1/blob/main/screenshot/2.png)

## 이 챕터를 통해 배우는 것

1. WebView 사용하기
2. ViewPager2 사용하기
    1. ViewPager2 를 Fragment 와 함께 쓰기
    2. TabLayoutMediator 를 통해 TabLayout 과 함께 쓰기
3. Fragment 
4. SharedPreference
5. Dialog

### Fragment

[https://developer.android.com/guide/components/fragments?hl=ko](https://developer.android.com/guide/components/fragments?hl=ko)

**Android 4대 컴포넌트**

- Activity
- Service
- BroadCast Receiver
- Content Provider

**Activity**

- 사용자와 상호작용하는 화면
- 단일 독립 실행형 모듈 (Activity 끼리는 독립적)
- 재사용이 가능

**Fragment**

여러 개의 프래그먼트를 하나의 액티비티에 결합하여 창이 여러 개인 UI를 빌드할 수 있으며, 하나의 프래그먼트를 여러 액티비티에서 **재사용**할 수 있습니다. 프래그먼트는 액티비티의 모듈식 섹션이라고 생각하면 됩니다. 이는 **자체적인 수명 주기**를 가지고, 자체 입력 이벤트를 수신하고, 액티비티 실행 중에 추가 및 삭제가 가능합니다

- Activity 에 결합하여 → 독립적으로 사용할 수는 없음.
- 자체적인 수명주기를 가지고 → Activity 와는 별개의 수명주기를 가짐.

### Viewpager2

[https://developer.android.com/training/animation/screen-slide-2?hl=ko](https://developer.android.com/training/animation/screen-slide-2?hl=ko)

- 하나의 전체화면에서 다른 전체화면으로 전환할 때 사용
- 내부 구현은 RecyclerView 로 이루어짐

## 웹툰앱

- ViewPager2 를 이용해 N개의 Fragment 를 구성함
- 각 Fragment 는 WebView 를 전체화면으로 구성함
- TabLayout 과 ViewPager2 를 연동하고, Tab 이름을 동적으로 바꿀 수 있음
- 웹툰의 마지막 조회 시점을 로컬에 저장하고, 앱 실행 시 불러옴
