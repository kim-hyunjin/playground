# 깃헙 레포지토리 조회 (part2 - chapter 4)

![1](https://github.com/Fastcampus-Android-Lecture-Project-2023/part2-chapter4/blob/main/screenshot/1.png)
![2](https://github.com/Fastcampus-Android-Lecture-Project-2023/part2-chapter4/blob/main/screenshot/2.png)

## 이 챕터를 통해 배우는 것

1. Retrofit
2. Github Open API
3. RecyclerView
4. ListAdapter
5. Handler

### Retrofit

https://square.github.io/retrofit/

OKHttp 를 네트워크 레이어로 활용하는 상위호환 라이브러리

네트워크 통신을 편하게 할 수 있도록 도와주는 기능이 많이 있음

### Github Open API

https://docs.github.com/ko/rest

API : 애플리케이션 프로그래밍 인터페이스

REST : Representational State Transfer, 일종의 네트워크에서 통신을 관리하기 위한 아키텍쳐

Github 에서 제공하는 API를 자유롭게 활용할 수 있다.

### RecyclerView

https://developer.android.com/guide/topics/ui/layout/recyclerview?hl=ko

RecyclerView는 이러한 개별 요소를 *재활용*
합니다. 항목이 스크롤되어 화면에서 벗어나더라도 RecyclerView는 뷰를 제거하지 않습니다. 대신 RecyclerView는 화면에서 스크롤된 새 항목의 뷰를 재사용합니다. 이렇게 뷰를 재사용하면 앱의 응답성을 개선하고 전력 소모를 줄이기 때문에 성능이 개선됩니다.

RecyclerView의 항목은 [LayoutManager](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.LayoutManager?hl=ko) 클래스를 통해 정렬됩니다

레이아웃을 결정했으면 `Adapter` 및 `ViewHolder`를 구현해야 합니다. `ViewHolder`는 목록에 있는 개별 항목의 레이아웃을 포함하는 `View`의 래퍼입니다. `Adapter`는 필요에 따라 `ViewHolder` 객체를 만들고 이러한 뷰에 데이터를 설정하기도 합니다. 뷰를 데이터에 연결하는 프로세스를 *바인딩*이라고 합니다.
