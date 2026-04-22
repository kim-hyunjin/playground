# Hooks
Hooks는 리액트 v16.8에 새로 도입된 기능. 함수형 컴포넌트에서도 상태 관리를 할 수 있는 useState, 렌더링 직후 작업을 설정하는 useEffect 등의 기능을 제공. 

### useState
함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해준다.<br/>
useState 함수의 파라미터에는 상태의 기본값을 넣어준다.<br/>
이 함수가 호출되면 배열을 반환한다. 첫번째 원소는 상태값, 두번째 원소는 상태를 설정하는 함수이다.

### useEffect
리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook. 클래스형 컴포넌트의 componentDidMount와 componentDidUpdate를 합친 형태.<br/>

#### 마운트될 때만 실행
useEffect에서 설정한 함수를 컴포넌트가 화면에 맨 처음 렌더링될 때만 실행하고, 업데이트될 때는 실행하지 않으려면 함수의 두번째 파라미터로 비어있는 배열을 넣어주면 된다.

#### 특정 값이 업데이트 될때만 실행
```
클래스 컴포넌트의 경우
componentDidUpdate(prevProps, prevState) {
  if (prevProps.value !== this.props.value) {
    doSomething();
  }
}

useEffect의 경우
useEffect의 두번째 파라미터로 전달되는 배열에 검사하고 싶은 값을 넣어준다.

useEffect(() => {
  console.log(name);
}, [name])
```

#### 뒷정리하기
useEffect는 기본적으로 렌더링된 직후마다 실행되며, 두번째 파라미터 배열에 무엇을 넣었는지에 따라 실행조건이 달라진다.<br/>
컴포넌트가 언마운트되기 전, 업데이트되기 직전에 어떠한 작업을 수행하고 싶다면 useEffect에서 뒷정리 함수를 반환해주어야 한다.<br/>
언마운트될 때만 뒷정리 함수를 호출하고 싶다면 두번째 파라미터에 빈 배열을 넣으면 된다.


### useReducer
useState보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해 주고 싶을 때 사용하는 Hook.<br/>
리듀서는 <b>현재 상태</b>, 그리고 <b>업데이트를 위해 필요한 정보를 담은 액션 값</b>을 전달 받아 새로운 상태를 반환하는 함수이다.<br/>
새로운 상태를 만들 때는 반드시 불변성을 지켜줘야 한다.
```
function reducer(state, action) {
  return {...}; // 불변성을 지키면서 업데이트한 새로운 상태를 반환.
}
```
액션 값은 주로 다음과 같은 형태로 이루어져있다.
```
{
  type: 'INCREMENT',
  // 다른 값들이 있다면 추가로 들어감.
}

리덕스에서 사용하는 액션 객체는 어떤 액션인지 알려주는 type 필드가 꼭 필요하다.
반면, useReducer에서 사용하는 액션 객체는 type이 필수적이지 않다.
```
useReducer의 첫 번째 파라미터에는 리듀서 함수를 넣고, 두번째 파라미터에는 해당 리듀서의 기본값을 넣어준다.
```
const [state, dispatch] = useReducer(reducer, {value:0});
// state는 현재 가리키고 있는 상태, dispatch는 액션을 발생시키는 함수이다.
// dispatch(action)과 같은 형태로, 함수 안에 파라미터로 액션 값을 넣어주면 리듀서 함수가 호출되는 구조다.
```
useReducer를 사용했을 때 가장 큰 장점은 컴포넌트 업데이트 로직을 컴포넌트 바깥으로 빼낼 수 있다는 것이다.

### useMemo
함수형 컴포넌트 내부에서 발생하는 연산을 최적화할 수 있다. 렌더링하는 과정에서 특정 값이 바뀌었을 때만 연산을 실행하고, 원하는 값이 바뀌지 않았다면 이전에 연산했던 결과를 다시 사용하는 방식.

### useCallback
useCallback은 useMemo와 상당히 비슷하다. 주로 렌더링 성능을 최적화해야하는 상황에 사용한다. 이벤트 핸들러 함수를 필요할 때만 생성할 수 있다.
```
다음 두 코드는 완전히 똑같은 코드이다.
useCallback(() => {
  console.log('hello world!);
}, []);

useMemo(() => {
  const fn = () => {
    console.log('hello world);
  };
  return fn;
}, []);
```
- 숫자, 문자열, 객체처럼 일반값을 재사용하려면 useMemo 사용.
- 함수를 재사용하려면 useCallback 사용.

### useRef
함수형 컴포넌트에서 ref를 쉽게 사용할 수 있도록 해준다.

### 커스텀 Hooks
여러 컴포넌트에서 비슷한 기능을 공유할 경우, Hook로 작성하여 로직을 재사용할 수도 있다.<br/>
다양한 커스텀 Hooks
- https://nikgraf.github.io/react-hooks/
- https://github.com/rehooks/awesome-react-hooks