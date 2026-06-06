---
title: "React ref: DOM에 이름 달기"
date: 2026-04-24
category: Frontend
tags: [React, ref, DOM Manipulation, createRef]
summary: 리액트에서 DOM에 직접 접근해야 할 때 사용하는 ref의 사용법과 주의사항을 알아봅니다.
---

# 5장 ref: DOM에 이름 달기

리액트 프로젝트 내부에서 DOM을 꼭 직접적으로 건드려야 할 때 **ref**를 사용합니다.

#### DOM을 꼭 사용해야 하는 상황
- 특정 input에 포커스 주기
- 스크롤 박스 조작하기
- Canvas 요소에 그림 그리기 등

---

### 1. 콜백 함수를 통한 ref 설정

ref를 만드는 가장 기본적인 방법입니다. ref를 달고자 하는 요소에 ref라는 콜백 함수를 props로 전달해 주면 됩니다. 이 함수는 파라미터로 받은 ref를 컴포넌트의 멤버 변수로 설정합니다.

```javascript
<input ref={(ref) => { this.input = ref }} />
```

---

### 2. createRef를 통한 ref 설정

리액트에 내장되어 있는 `createRef` 함수를 사용하는 방법입니다. 이 기능은 리액트 v16.3부터 도입되었으며, 이전 버전에서는 작동하지 않습니다.

```javascript
class RefSample extends React.Component {
  input = React.createRef();

  handleFocus = () => {
    // ref에 설정해둔 DOM에 접근하려면 .current를 사용하면 됩니다.
    this.input.current.focus();
  }

  render() {
    return (
      <div>
        <input ref={this.input} />
      </div>
    );
  }
}
```

---

### ⚠️ 주의 사항: 컴포넌트 간의 교류

서로 다른 컴포넌트끼리 교류할 때 ref를 사용한다면 이는 **잘못** 사용된 것입니다. ref를 과도하게 사용하면 앱 규모가 커질수록 로직이 스파게티처럼 꼬여 유지보수가 불가능해질 수 있습니다.

컴포넌트끼리 데이터를 교류할 때는 언제나 **부모 - 자식** 흐름으로 데이터를 전달하는 것이 리액트의 정석적인 방법입니다.
