---
title: immer를 사용해 불변성 더 쉽게 유지하기
date: 2026-04-24
category: Frontend
tags:
  - React
  - immer
  - immutability
  - produce
summary: 복잡한 객체나 배열의 상태를 업데이트할 때 불변성을 편리하게 유지할 수 있게 도와주는 immer 라이브러리의 사용법을 알아봅니다.
---

# immer를 사용해 불변성 더 쉽게 유지하기

리액트에서 상태를 업데이트할 때는 불변성을 지키는 것이 중요합니다. 하지만 객체의 구조가 깊어지면 불변성을 유지하며 코드를 작성하는 것이 매우 까다로워집니다. `immer` 라이브러리를 사용하면 마치 기존 상태를 직접 수정하는 것처럼 코드를 작성해도 불변성을 유지하며 새로운 상태를 생성해 줍니다.

### 설치하기

```bash
yarn add immer
```

### 기본 사용법

`produce` 함수를 사용하여 상태를 업데이트합니다.

```javascript
import produce from 'immer';

const nextState = produce(originalState, draft => {
  // draft는 originalState의 복사본이며, 이를 직접 수정하는 로직을 작성합니다.
  draft.somewhere.deep.inside = 5;
});
```

- 첫 번째 파라미터: 수정하고 싶은 상태
- 두 번째 파라미터: 상태를 어떻게 업데이트할지 정의하는 함수

### 예시: 복잡한 배열 업데이트

```javascript
const nextState = produce(originalState, draft => {
  const todo = draft.find(t => t.id === 2);
  todo.checked = true; // 직접 수정하는 듯한 문법
  
  draft.push({
    id: 3,
    todo: 'immer 적용하기',
    checked: false,
  });

  draft.splice(draft.findIndex(t => t.id === 1), 1);
});
```

### useState의 함수형 업데이트와 immer 함께 쓰기

`produce` 함수에 첫 번째 파라미터를 생략하고 업데이트 함수만 전달하면, 상태 업데이트 함수를 반환합니다. 이를 `useState`의 세터 함수에 전달하여 코드를 더 깔끔하게 만들 수 있습니다.

```javascript
const [data, setData] = useState({ ... });

const onUpdate = useCallback(id => {
  setData(
    produce(draft => {
      const target = draft.find(item => item.id === id);
      target.checked = !target.checked;
    })
  );
}, []);
```
