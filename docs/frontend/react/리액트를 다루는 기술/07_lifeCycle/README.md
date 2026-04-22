# 컴포넌트의 라이프사이클
모든 리액트 컴포넌트에는 라이프사이클(수명 주기)이 존재한다.<br/>
컴포넌트를 처음으로 렌더링할 때 어떤 작업을 처리해야 하거나
컴포넌트를 업데하기 전후로 어떤 작업을 처리해야 할 때, 또 불필요한 업데이트를 방지하고자 할 때 라이프사이클 메서드를 사용한다.
- 라이프사이클 메서드는 클래스형 컴포넌트에서만 사용할 수 있다.
- 함수형 컴포넌트에서는 Hooks 기능을 사용해 비슷한 작업을 처리할 수 있다.

#### 컴포넌트를 마운트할 때 호출하는 메서드
```
constructor => getDerivedStateFromProps => render => componentDidMount
```
- constructor : 컴포넌트를 새로 만들 때마다 호출되는 클래스 생성자 메서드
- getDerivedStateFromProps : props에 있는 값을 state에 넣을 때 사용하는 메서드
- render : 우리가 준비한 UI를 렌더링하는 메서드
- componentDidMount : 컴포넌트가 웹 브라우저상에 나타난 후 호출하는 메서드

### 업데이트
컴포넌트는 다음과 같은 총 네 가지 경우에 업데이트한다.
- props가 바뀔 때
- state가 바뀔 때
- 부모 컴포넌트가 리렌더링될 때
- this.forceUpdate로 강제로 렌더링을 트리거할 때

#### 컴포넌트를 업데이트할 때 호출하는 메서드
```
  props, state가 바뀌거나 부모 컴포넌트가 리렌더링될 때 => getDerivedStateFromProps => shouldComponentUpdate => true 반환 시 render, false 반환 시 여기서 작업 취소 => getSnapshotBeforeUpdate => 실제 DOM 변화 => componentDidUpdate
```
- shouldComponentUpdate : 컴포넌트가 리렌더링 해야 할지 말아야 할지 결정하는 메서드. true를 반환하면 다음 라이프사이클 메서드를 계속 실행하고, false를 반환하면 작업을 중지한다(컴포넌트가 리렌더링되지 않음). 만약 this.forceUpdate() 함수를 호출한다면 이 과정을 생략하고 바로 render함수를 호출.
- getSnapshotBeforeUpdate : 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출.

### 언마운트
- componentWllUnmount : 컴포넌트가 웹 브라우저상에서 사라지기 전에 호출하는 메서드.

### 에러 잡아내기
- componentDidCatch : 에러 발생시 componentDidCatch 메서드 호출
