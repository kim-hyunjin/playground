---
title: Context API를 통한 전역 상태 관리
date: 2026-04-24
category: Frontend
tags:
  - React
  - Context-API
  - Provider
  - Consumer
  - useContext
summary: 리액트 프로젝트에서 전역적으로 사용할 데이터를 효율적으로 관리하기 위한 Context API의 사용법과 useContext Hook 활용법을 알아봅니다.
---

# Context API

Context API는 리액트 프로젝트에서 전역적으로 사용할 데이터(사용자 정보, 테마 설정 등)가 있을 때 유용한 기능입니다. 리덕스, 리액트 라우터, styled-components와 같은 라이브러리들도 내부적으로 Context API를 기반으로 구현되어 있습니다.

### 기본 개념

1. **createContext**: 새로운 Context를 만듭니다.
2. **Provider**: Context의 가치를 하위 컴포넌트들에게 전달합니다. `value` 설정이 필수적입니다.
3. **Consumer**: Context의 변화를 구독하고 데이터를 사용합니다.

### Consumer 사용하기 (Render Props)

```javascript
<ColorContext.Consumer>
  {value => (
    <div style={{ background: value.color }}>
      {/* ... */}
    </div>
  )}
</ColorContext.Consumer>
```

### useContext Hook 사용하기

함수형 컴포넌트에서는 `useContext` Hook을 사용하여 훨씬 간결하게 Context 데이터를 조회할 수 있습니다.

```javascript
const value = useContext(ColorContext);
return <div style={{ background: value.color }} />;
```

### 동적 Context 사용하기

Context의 `value`에 상태뿐만 아니라 함수를 전달하여, 하위 컴포넌트에서 전역 상태를 업데이트할 수도 있습니다.

### 클래스형 컴포넌트에서의 사용

- **static contextType**: 클래스 메서드에서도 Context에 접근할 수 있게 해주지만, 한 클래스에서 하나의 Context만 사용할 수 있다는 제약이 있습니다.
