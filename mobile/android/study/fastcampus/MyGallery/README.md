# part1-chapter8
나만의 앨범 구현 

<img src="https://user-images.githubusercontent.com/24618293/199804174-c1b39ac8-2b7b-4af9-abcd-157e1399dafc.gif" width="300">

<img src="https://user-images.githubusercontent.com/24618293/199804389-afc8058a-f2e5-419c-9649-decaa26cfb4d.gif" width="300">

<img src="https://user-images.githubusercontent.com/24618293/199804539-1e6e0aad-564d-477e-80bb-7b32c7145221.gif" width="300">


# 개요

- 권한 처리
- 갤러리 이미지 가져오기
- 여러가지 타입의 리스트 구현해보기

---

# 학습 목표

- 갤러리에 있는 이미지를 가져오고, 다양한 이미지를 UI 에 보여 줄 수 있다
    - 갤러리에 있는 이미지를 가져오기 위한 권한 확인
    - 갤러리에서 가져온 이미지를 리스트에 업데이트
    - 다양한 타입의 아이템이 있는 리스트 구현
    - 나만의 액자 UI 만들기
    - 커스텀 툴바
- UI
    - RecyclerView, [ListAdapter](https://developer.android.com/reference/androidx/recyclerview/widget/ListAdapter)
        - Multiple item type
    - [ViewPager2](https://developer.android.com/training/animation/screen-slide-2?hl=ko)
    - [Toolbar](https://developer.android.com/guide/fragments/appbar?hl=ko)
    - selector, drawable
- Kotlin
    - seald class, data class
- Android
    - [Permission](https://developer.android.com/training/permissions/requesting)
    - [Storage Access Framework](https://developer.android.com/guide/topics/providers/document-provider)
    - registerForActivityResult
    
# 한 걸음 더

- drawable 을 이용해 다양한 도형을 그려보세요.
- ListAdapter 와 RecyclerView.Adapter 의 차이에 복습해보세요.
