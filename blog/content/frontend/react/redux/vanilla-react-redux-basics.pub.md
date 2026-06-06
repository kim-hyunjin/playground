---
title: Vanilla Redux와 React-Redux 기초
date: 2026-04-24
category: Frontend
tags: [Redux, React-Redux, State Management, JavaScript]
summary: Redux의 핵심 개념인 Store, Reducer, Action과 React-Redux의 connect 사용법을 알아봅니다.
---

# Redux Basics

Redux가 가장 잘하는 것은 바로 **데이터(state) 관리**입니다.

### 핵심 개념

- **Store**: 데이터(상태)를 저장하는 유일한 저장고입니다.
- **Reducer**: 데이터를 변경하는 유일한 함수입니다.
- **Action**: Reducer 안에서 수행할 행위를 정의한 객체입니다. Action은 반드시 **Plain Object**여야 하며, `type` 속성을 반드시 가지고 있어야 합니다.

#### Reducer의 파라미터

```javascript
const reducer = (state, action) => {
  // state를 기반으로 action에 따라 새로운 상태를 생성
  return newState;
}
```

#### Store의 주요 내장 함수

- `dispatch`: 파라미터로 넘겨받은 action을 가지고 reducer를 실행합니다.
- `getState`: 현재 store에 저장된 데이터를 리턴합니다.
- `subscribe`: 리스너 함수를 등록합니다. store 안의 데이터가 변경될 때마다 실행됩니다.

---

### ⚠️ IMPORTANT: Immutability (불변성)

**Reducer에서 직접 state에 변형을 주지 마세요!** 항상 새로운 객체를 리턴해야 합니다.

```javascript
// BAD: state를 직접 수정
const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD:
      return state.push(action.text); // 기존 배열이 수정됨
    // ...
  }
}

// GOOD: 새로운 객체/배열 리턴
const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD:
      return [...state, { text: action.text }]; // 새로운 배열 생성
    // ...
  }
}
```

---

# React Redux

Store의 데이터가 변경될 때 리액트 컴포넌트를 리렌더링하려면 `react-redux` 라이브러리를 사용합니다.

### Provider
`Provider`를 사용하면 그 자식 컴포넌트들이 `connect()` 호출을 통해 Redux store에 접근할 수 있게 됩니다.

```javascript
import { Provider } from 'react-redux';
import store from './myStore';

<Provider store={store}>
  <App />
</Provider>
```

### connect
컴포넌트와 리덕스 스토어를 연결해줍니다.

**기본 형태:** `connect(mapStateToProps, mapDispatchToProps)(Component)`

#### 1. mapStateToProps
리덕스 스토어의 `state`를 컴포넌트의 `props`로 매핑합니다.

```javascript
const mapStateToProps = (state, ownProps) => {
  return {
    something: state.someData
  }
}
```

#### 2. mapDispatchToProps
`dispatch` 함수를 사용하여 특정 액션을 발생시키는 함수를 컴포넌트의 `props`로 매핑합니다.

```javascript
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSomething: () => dispatch({ type: 'SOME_ACTION' })
  }
}
```

#### 연결하기
```javascript
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```
