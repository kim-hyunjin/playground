---
title: React 이벤트 핸들링 (Event Handling)
date: 2026-04-24
category: Frontend
tags: [React, JavaScript, Event Handling, SyntheticEvent]
summary: 리액트에서의 이벤트 핸들링 방식과 주의사항, 그리고 SyntheticEvent에 대해 알아봅니다.
---

# 4장 이벤트 핸들링

### 이벤트 사용할 때 주의 사항

1. **이벤트 이름은 카멜 표기법으로 작성한다.**
2. **이벤트에 실행할 자바스크립트 코드가 아닌 함수 형태의 값을 전달한다.**
3. **DOM 요소에만 이벤트를 설정할 수 있다.** 직접 만든 컴포넌트에는 props로 전달만 해줄 수 있습니다.

### 이벤트 종류

자세한 이벤트 종류는 [React 공식 문서](https://reactjs.org/docs/events.html)를 참고하세요.

### SyntheticEvent

`SyntheticEvent`는 웹브라우저의 네이티브 이벤트를 감싸는 객체입니다.
SyntheticEvent는 이벤트가 끝나고 나면 이벤트가 초기화되므로 정보를 참조할 수 없습니다. 따라서 만약 비동기적으로 이벤트 객체를 참조할 일이 있다면 `e.persist()` 함수를 호출해주어야 합니다.

### 임의 메서드 만들기

#### 1. 기본 방식

클래스형 컴포넌트에서 메서드를 바인딩하는 기본 방식입니다.

```javascript
  constructor(props) {
    super(props);
    // 함수가 호출될 때 this는 호출부에 따라 결정되므로,
    // 클래스의 임의 메서드가 특정 HTML 요소의 이벤트로 등록되는 과정에서
    // 메서드와 this의 관계가 끊어져 버린다.
    // 때문에 임의 메서드가 이벤트로 등록되어도 this를 컴포넌트 자신으로 제대로 가리키기 위해 메서드를 this와 바인딩 하는 작업이 필요하다.
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  handleClick(e) {
    alert(this.state.message);
    this.setState({
      message: ''
    });
  }
```

#### 2. Property Initializer Syntax 사용

화살표 함수를 사용하여 바인딩을 간소화하는 방식입니다.

```javascript
  handleChange = (e) => {
    this.setState({
      message: e.target.value
    });
  }

  handleClick = (e) => {
    alert(this.state.message);
    this.setState({
      message: ''
    });
  }
```
