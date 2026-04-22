# 15장 Context API
Context API는 리액트 프로젝트에서 전역적으로 사용할 데이터가 있을 때 유용한 기능이다.
- 사용자 로그인 정보
- 애플리케이션 환경 설정
- 테마 등

리덕스, 리액트 라우터, styled-components 등의 라이브러리는 Context API를 기반으로 구현되어있다.
```
<ColorContext.Consumer>
  {value => (
    <div style={{
      width: '64px',
      height: '64px',
      background: value.color
    }}>
    </div>
  )}
</ColorContext.Consumer>
```
Consumer 사이에 중괄호를 열어 그 안에 함수를 넣어줌. - Function as a child, Render Props.

```
    <ColorContext.Provider value={{color: 'red'}}>
      <div className="App">
        <ColorBox />
      </div>
    </ColorContext.Provider>
```
Provider 사용 시 value 값을 명시해 주어야 한다.<br/>
createContext 함수에 파라미터로 넣어준 기본값은 Provider를 사용하지 않았을 때만 사용된다.

### 동적 Context 사용하기
Context의 value에 함수를 전달해 줄 수도 있다.

### useContext Hook 사용하기
useContext Hook을 사용하면 함수형 컴포넌트에서 Context를 아주 편하게 사용할 수 있다. 단, 클래스형 컴포넌트에서는 사용할 수 없다.

### static contextType 사용하기
클래스형 컴포넌트에서 Context를 좀 더 쉽게 사용하고 싶다면 static contextType을 정의하는 방법이 있다.<br/>
static contextType을 정의하면 클래스 메서드에서도 Context에 넣어 둔 함수를 호출할 수 있다.<br/>
그러나 한 클래스에서 하나의 Context밖에 사용하지 못한다는 단점이 있다.