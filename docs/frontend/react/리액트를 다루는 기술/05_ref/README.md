# 5장 ref: DOM에 이름 달기
DOM을 꼭 직접적으로 건드려야 할 때 ref를 사용한다.
#### DOM을 꼭 사용해아 하는 상황
- 특정 input에 포커스 주기
- 스크롤 박스 조작하기
- Canvas 요소에 그림 그리기 등

### 콜백 함수를 통한 ref 설정
ref를 만드는 가장 기본적인 방법임. ref를 달고자 하는 요소에 ref라는 콜백함수를 props로 전달해 주면 된다.
```
  <input ref={(ref) => {this.superman=ref}} />
```

### createRef를 통한 ref 설정
리액트에 내장되어 있는 createRef 함수를 사용하는 방법이다. (리액트 v16.3부터 도입. 이전 버전에서는 작동하지 않는다.)
```
  class RefSample extends React.Component {
    superman = React.createRef();

    handleFocus = () => {
      // ref에 설정해둔 DOM에 접근하려면 .current를 사용하면 된다.
      this.superman.current.focus();
    }

    render() {
      return (
        <div>
          <input ref={this.superman}>
        </div>
      )
    }
  }
```

서로 다른 컴포넌트끼리 교류할 때 ref를 사용한다면 이는 <b>잘못</b> 사용된 것이다. => 앱 규모가 커지면 스파게티처럼 꼬여 유지 보수가 불가능하다. 컴포넌트끼리 데이터를 교류할 때는 언제나 데이터를 부모 - 자식 흐름으로 교류해야 한다.