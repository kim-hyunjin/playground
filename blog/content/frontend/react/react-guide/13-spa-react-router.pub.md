---
title: SPA와 리액트 라우터
date: 2026-04-24
category: Frontend
tags:
  - React
  - SPA
  - react-router-dom
  - routing
summary: 싱글 페이지 애플리케이션(SPA)의 개념을 이해하고, 리액트 라우터를 사용하여 다양한 경로에 따라 컴포넌트를 렌더링하는 방법을 학습합니다.
---

# SPA (Single Page Application)

SPA는 서버로부터 매번 새로운 HTML을 받아오는 대신, 최초 한 번만 페이지를 로딩하고 이후에는 필요한 데이터만 받아와 자바스크립트로 화면을 업데이트하는 방식입니다.

### 리액트 라우팅

싱글 페이지라고 해서 화면이 한 종류인 것은 아닙니다. 브라우저의 주소 상태에 따라 다양한 화면을 보여주는 것을 **라우팅**이라고 합니다.

- **장점**: 필요한 부분만 업데이트하므로 사용자 경험(UX)이 매끄럽고 서버 부하가 줄어듭니다.
- **단점**: 앱 규모가 커지면 초기 자바스크립트 파일이 커지며(코드 스플리팅으로 해결), SEO 대응이 어려울 수 있습니다(SSR로 해결).

### 리액트 라우터 적용하기

```bash
yarn add react-router-dom
```

#### 기본 컴포넌트

- **BrowserRouter**: HTML5 History API를 사용하여 페이지를 새로고침하지 않고 주소를 변경합니다.
- **Route**: 특정 주소 규칙에 따라 컴포넌트를 렌더링합니다. (`<Route path="/about" component={About} />`)
- **Link**: 클릭 시 다른 주소로 이동시켜 줍니다. `a` 태그와 달리 페이지를 새로 불러오지 않습니다.

### URL 파라미터와 쿼리

- **파라미터**: `/profiles/gildong` 형태. `match.params`로 조회합니다.
- **쿼리**: `/about?detail=true` 형태. `location.search`로 조회하며 `qs` 라이브러리를 사용해 객체로 변환합니다.

### 주요 기능

- **Switch**: 여러 `Route` 중 일치하는 첫 번째 라우트만 렌더링합니다.
- **NavLink**: 현재 경로와 일치할 경우 특정 스타일이나 클래스를 적용합니다.
- **withRouter**: 라우트가 아닌 컴포넌트에서도 `match`, `location`, `history` 객체에 접근할 수 있게 해주는 HoC입니다.

```javascript
export default withRouter(MyComponent);
```
