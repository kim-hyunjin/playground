# 모바일 앱 개발: Flutter, React Native, 그리고 Native의 세계

본 프로젝트는 다양한 플랫폼에서 사용자에게 최고의 모바일 경험을 제공하기 위한 기술들을 실습한 공간입니다. **크로스 플랫폼(Flutter, RN)**과 **네이티브(Android, iOS)** 개발 방식을 비교하며 각 기술의 장단점을 탐구합니다.

---

## 🚀 1. 크로스 플랫폼 (Cross-Platform)

하나의 코드베이스로 iOS와 Android 앱을 동시에 개발하는 효율적인 방식입니다.

### Flutter (Dart)
Google이 만든 UI 툴킷으로, 모든 UI를 **Widget**으로 구성하며 높은 성능과 일관된 디자인을 제공합니다.

```dart
// mobile/flutter/meals_app/lib/screens/categories.dart 예시
class CategoriesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GridView(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2),
      children: [
        for (final category in availableCategories)
          CategoryGridTile(category: category)
      ],
    );
  }
}
```

### React Native (JS/TS)
React의 철학을 모바일에 적용하여, 네이티브 컴포넌트를 직접 제어합니다. 웹 개발자에게 친숙한 환경을 제공합니다.

```tsx
// mobile/react-native/meals-app/App.tsx 예시
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Categories" component={CategoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## 📱 2. 네이티브 개발 (Native Development)

각 OS가 제공하는 최신 기능과 최상의 성능을 낼 수 있는 방식입니다.

- **Android (Kotlin/Java):** Fastcampus 강의 프로젝트들을 통해 실무 수준의 아키텍처(MVVM, Clean Architecture) 실습.
- **iOS (Swift):** SwiftUI와 UIKit을 활용한 애플 생태계 최적화 앱 개발 학습.

---

## 📂 주요 실습 프로젝트 리스트

| 프로젝트명 | 플랫폼 | 핵심 주제 |
| :--- | :--- | :--- |
| **Meals App** | Flutter & RN | 내비게이션, 상태 관리, 리스트 렌더링 |
| **Expense Tracker** | Flutter & RN | 데이터 입력, 차트 시각화, 로컬 저장소 |
| **Chat App** | Flutter | Firebase 연동 실시간 채팅, 푸시 알림 |
| **Airbnb Clone** | React Native | 지도 API 연동, 복잡한 레이아웃 설계 |
| **StarBucks Clone** | Android | 네이티브 UI 컴포넌트 및 애니메이션 실습 |

---

## 📈 학습 포인트
- **Declarative UI:** 상태(State)의 변화에 따라 UI가 자동으로 업데이트되는 선언적 프로그래밍 패러다임 습득.
- **Navigation:** 플랫폼별 페이지 이동 및 데이터 전달(Deep Link 등) 처리.
- **State Management:** Provider, Riverpod(Flutter) vs Redux, Context API(RN) 비교 분석.

---
*본 저장소는 멀티 디바이스 환경에서 사용자에게 끊김 없는 경험을 선사하기 위한 기술적 도전들을 기록합니다.*
