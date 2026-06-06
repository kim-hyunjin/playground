---
title: Hooks
date: 2026-04-24
category: Frontend
tags:
  - React
  - Hooks
  - useState
  - useEffect
  - useReducer
summary: 함수형 컴포넌트에서 상태 관리와 최적화를 가능하게 하는 다양한 Hooks의 종류와 사용법을 정리합니다.
---

# Hooks

Hooks는 리액트 v16.8에 새로 도입된 기능입니다. 함수형 컴포넌트에서도 상태 관리를 할 수 있는 `useState`, 렌더링 직후 작업을 설정하는 `useEffect` 등의 기능을 제공합니다.

### useState

함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해줍니다.
`useState` 함수의 파라미터에는 상태의 기본값을 넣어줍니다. 이 함수가 호출되면 배열을 반환합니다. 첫 번째 원소는 상태값, 두 번째 원소는 상태를 설정하는 함수입니다.

### useEffect

리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook입니다. 클래스형 컴포넌트의 `componentDidMount`와 `componentDidUpdate`를 합친 형태입니다.

#### 마운트될 때만 실행

`useEffect`에서 설정한 함수를 컴포넌트가 화면에 맨 처음 렌더링될 때만 실행하고, 업데이트될 때는 실행하지 않으려면 함수의 두 번째 파라미터로 비어있는 배열(`[]`)을 넣어주면 됩니다.

#### 특정 값이 업데이트될 때만 실행

```javascript
// 클래스 컴포넌트의 경우
componentDidUpdate(prevProps, prevState) {
  if (prevProps.value !== this.props.value) {
    doSomething();
  }
}

// useEffect의 경우
useEffect(() => {
  console.log(name);
}, [name]);
```

#### 뒷정리하기

`useEffect`는 기본적으로 렌더링된 직후마다 실행되며, 두 번째 파라미터 배열에 무엇을 넣었는지에 따라 실행 조건이 달라집니다.
컴포넌트가 언마운트되기 전, 업데이트되기 직전에 어떠한 작업을 수행하고 싶다면 `useEffect`에서 뒷정리 함수를 반환해주어야 합니다.
언마운트될 때만 뒷정리 함수를 호출하고 싶다면 두 번째 파라미터에 빈 배열을 넣으면 됩니다.

### useReducer

`useState`보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해 주고 싶을 때 사용하는 Hook입니다.
리듀서는 **현재 상태**, 그리고 **업데이트를 위해 필요한 정보를 담은 액션 값**을 전달받아 새로운 상태를 반환하는 함수입니다. 새로운 상태를 만들 때는 반드시 불변성을 지켜줘야 합니다.

```javascript
function reducer(state, action) {
  return { ...state, /* 업데이트 로직 */ }; // 불변성을 지키면서 업데이트한 새로운 상태를 반환.
}
```

액션 값은 주로 다음과 같은 형태로 이루어져 있습니다.

```javascript
{
  type: 'INCREMENT',
  // 다른 값들이 있다면 추가로 들어감.
}
```

리덕스에서 사용하는 액션 객체는 어떤 액션인지 알려주는 `type` 필드가 꼭 필요하지만, `useReducer`에서 사용하는 액션 객체는 `type`이 필수적이지 않습니다.

### useMemo

함수형 컴포넌트 내부에서 발생하는 연산을 최적화할 수 있습니다. 렌더링하는 과정에서 특정 값이 바뀌었을 때만 연산을 실행하고, 원하는 값이 바뀌지 않았다면 이전에 연산했던 결과를 다시 사용하는 방식입니다.

### useCallback

`useCallback`은 `useMemo`와 상당히 비슷합니다. 주로 렌더링 성능을 최적화해야 하는 상황에 사용합니다. 이벤트 핸들러 함수를 필요할 때만 생성할 수 있습니다.

```javascript
// 다음 두 코드는 완전히 똑같은 코드입니다.
useCallback(() => {
  console.log('hello world!');
}, []);

useMemo(() => {
  const fn = () => {
    console.log('hello world!');
  };
  return fn;
}, []);
```

- 숫자, 문자열, 객체처럼 일반 값을 재사용하려면 `useMemo` 사용.
- 함수를 재사용하려면 `useCallback` 사용.

### useRef

함수형 컴포넌트에서 ref를 쉽게 사용할 수 있도록 해줍니다.

### 커스텀 Hooks

여러 컴포넌트에서 비슷한 기능을 공유할 경우, Hook으로 작성하여 로직을 재사용할 수도 있습니다.
