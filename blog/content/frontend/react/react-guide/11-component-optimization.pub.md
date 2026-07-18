---
title: 컴포넌트 성능 최적화
date: 2026-04-24
category: Frontend
tags:
  - React
  - optimization
  - React.memo
  - useCallback
  - react-virtualized
summary: 리액트 컴포넌트의 리렌더링 원인을 분석하고, React.memo와 함수형 업데이트, 그리고 react-virtualized를 사용하여 앱의 성능을 최적화하는 방법을 배웁니다.
---

# 컴포넌트 성능 최적화

### 리렌더링이 발생하는 상황

1. 전달받은 `props`가 변경될 때
2. 자신의 `state`가 바뀔 때
3. 부모 컴포넌트가 리렌더링될 때
4. `forceUpdate` 함수가 실행될 때

불필요한 리렌더링은 앱의 성능을 저하시키므로, 적절한 최적화가 필요합니다.

### React.memo를 사용한 최적화

컴포넌트의 `props`가 바뀌지 않았다면 리렌더링을 방지합니다.

```javascript
export default React.memo(TodoListItem);
```

### useState의 함수형 업데이트

`useCallback` 사용 시 의존성 배열에서 상태를 제거할 수 있어 함수가 새로 생성되는 것을 방지합니다.

```javascript
// 기존 방식 (의존성 배열에 todos 포함)
const onRemove = useCallback(id => {
  setTodos(todos.filter(todo => todo.id !== id));
}, [todos]);

// 함수형 업데이트 방식 (의존성 배열 비움)
const onRemove = useCallback(id => {
  setTodos(todos => todos.filter(todo => todo.id !== id));
}, []);
```

### useReducer 사용하기

상태 업데이트 로직을 컴포넌트 외부로 분리할 수 있습니다.

```javascript
function todoReducer(todos, action) {
  /* ...업데이트 로직... */
}
const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);
```

### 불변성의 중요성

기존 데이터를 직접 수정하지 않고 새로운 객체나 배열을 생성하여 업데이트해야 합니다. 그래야 `React.memo`가 변경 사항을 올바르게 감지하여 최적화할 수 있습니다.

```javascript
const nextArr = [...arr]; // 얕은 복사를 통한 불변성 유지
```

### react-virtualized를 이용한 리스트 최적화

수천 개의 항목이 있는 리스트에서 화면에 보이는 부분만 렌더링하여 초기 렌더링 성능과 메모리 사용량을 획기적으로 개선합니다.

```javascript
import { List } from 'react-virtualized';

<List
  rowCount={todos.length}
  rowHeight={57}
  rowRenderer={rowRenderer}
  /* ...기타 설정... */
/>
```
