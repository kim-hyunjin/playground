# 컴포넌트 성능 최적화
### 느려지는 원인 분석
컴포넌트는 다음과 같은 상황에서 리렌더링이 발생한다.
1. 자신이 전달받은 props가 변경될 때
2. 자신의 state가 바뀔 때
3. 부모 컴포넌트가 리렌더링될 때
4. forceUpdate 함수가 실행될 때

현재 앱에서 '할 일 1'의 항목을 체크할 경우 App 컴포넌트 state가 변경되면서 App 컴포넌트가 리렌더링 된다.<br/>
부모 컴포넌트가 리렌더링되었으니 TodoList 컴포넌트가 리렌더링되고 그 안의 무수한 컴포넌트들도 리렌더링 된다.<br/>
'할 일 1'의 항목은 리렌더링되어야 하는 것이 맞지만 나머지는 리렌더링될 필요가 없다.<br/>
불필요한 리렌더링을 방지해 성능을 최적화해줘야 한다.

### React.memo를 사용하여 컴포넌트 성능 최적화
컴포넌트의 리렌더링을 방지할 때는 7장에서 배운 shouldComponentUpdate 라이프사이클 메서드를 사용하면 된다. <br/>
하지만 함수형 컴포넌트에서는 사용할 수 없다. 대신 React.memo라는 함수를 사용한다.
```
export default React.memo(TodoListItem);
```
이렇게하면 TodoListItem 컴포넌트는 props가 바뀌지 않으면 리렌더링 하지 않는다.

### useState의 함수형 업데이트
기존에 setTodos 함수를 사용할 때는 새로운 상태를 파라미터로 넣어 주었다.
setTodos를 사용할 때 새로운 상태를 파라미터로 넣는 대신, 상태 업데이트를 어떻게 할지 정의해주는 업데이트 함수를 넣을 수도 있다. -> 함수형 업데이트
```
기존
setNumber(number+1)

함수형 업데이트
const onIncrease = useCallback(
  () => setNumber(prevNumber => prevNumber + 1), []
);
```
```
기존
const onRemove = useCallback(
      id => {
        setTodos(todos.filter(todo => todo.id !== id));
      }, [todos]
    );

함수형 업데이트
const onRemove = useCallback(
      id => {
        setTodos(todos => todos.filter(todo => todo.id !== id));
      }, []
    );
```

#### 개발환경에서의 성능
yarn start를 통해 개발서버를 구동하고 있는데, 실제 프로덕션에서 구동될 때보다 처리속도가 느리다.
```
프로덕션 모드로 구동하기
$ yarn build
$ yarn global add serve
$ serve -s build
```

### useReducer 사용하기
useState의 함수형 업데이트를 사용하는 대신, useReducer를 사용해도 된다.
```
function todoReducer(todos, action) {
  switch(action.type) {
    case 'INSERT':
      return todos.concat(action.todo);
    case 'REMOVE':
      return todos.filter(todo => todo.id !== action.id);
    case 'TOGGLE':
      return todos.map(todo => todo.id === action.id ? {...todo, checked: !todo.checked} : todo);
    default:
      return todos;
  }
}

// useReducer 두번째 파라미터로 초기 상태를 넣어주어야 한다.
const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);

const onInsert = useCallback(
    text => {
      const todo = {
        id: nextId.current,
        text,
        checked: false,
      };
      dispatch({type: 'INSERT', todo});
      nextId.current += 1;
    }, []
  );
```
useReducer를 사용하는 방법은 상태를 업데이트하는 로직을 모아서 컴포넌트 바깥에 둘 수 있다는 장점이 있다.


### 불변성의 중요성
```
todos.map(todo => todo.id === action.id ? {...todo, checked: !todo.checked} : todo);
```
기존 데이터를 수정할 때 직접 수정하지 않고, 새로운 배열을 만든 다음에 새로운 객체를 만들기 때문에 React.memo를 사용했을 때 props 변경 여부를 알아내 리렌더링 성능을 최적화해줄 수 있다.<br/>
이렇게 기존의 값을 직접 수정하지 않으면서 새로운 값을 만들어내는것을 '불변성을 지킨다'고 한다.
```
const arr = [1, 2, 3, 4, 5];

const nextArrBad = arr; // 똑같은 배열을 가리킴
nextArrBad[0] = 100;
console.log(arr === nextArrBad);
> true

const nextArrGood = [...arr]; // 내부의 값을 복사
nextArrGood[0] = 100;
console.log(arr === nextArrGood);
> false
```
```
const obj = {
  foo: 'bar',
  value: 1
};

const nextObjBad = obj; // 똑같은 객체를 가리킴

nextObjBad.value = nextObjBad.value + 1;
console.log(obj === nextObjBad);
> true

const nextObjBad = {
  ...obj, // 기존에 있던 내용을 복사
  value: obj.value + 1 // 새로운 값으로 덮어 씀.
};
console.log(obj === nextObjGood);
> false
```
불변성이 지켜지지 않으면 객체 내부의 값이 새로워져도 바뀐 것을 감지하지 못한다. => React.memo에서 서로 비교하여 최적화하는 것이 불가해짐.<br/>
하지만 배열 혹은 객체의 구조가 복잡하다면 불변성을 유지하면서 업데이트하는 것도 까다로워진다. 이런 경우 immer라는 라이브러리의 도움을 받아 편하게 작업할 수 있다.

### TodoList 컴포넌트 최적화하기
```
export default React.memo(TodoList);
```
리스트에 관련된 컴포넌트를 최적화할때는 리스트 내부에서 사용하는 컴포넌트도 최적화하고, 리스트로 사용되는 컴포넌트 자체도 최적화해주는 것이 좋다.

### react-virtualized
현재 컴포넌트가 맨 처음 렌더링될 때 2,500개 컴포넌트 중 2,491개 컴포넌트는 스크롤하기 전에는 보이지 않음에도 불구하고 렌더링이 이루어진다.<br/>
react-virtualized를 사용하면 리스트 컴포넌트에서 스크롤되기 전 보이지 않는 컴포넌트는 렌더링하지 않고 크기만 차지하게끔 할 수 있다.
```
$ yarn add react-virtualized
```
```
const TodoList = ({todos, onRemove, onToggle}) => {
  const rowRenderer = useCallback(
    ({index, key, style}) => {
      const todo = todos[index];
      return (
        <TodoListItem todo={todo} key={key} onRemove={onRemove} onToggle={onToggle} style={style} />
      );
    }, [onRemove, onToggle, todos]
  );
  return (
    <List
      className="TodoList"
      width={512} // 전체 크기
      height={513} // 전체 높이
      rowCount={todos.length}
      rowHeight={57}
      rowRenderer={rowRenderer} // 항목을 렌더링할 함수
      list={todos} // 배열
      style={{outline: 'none'}} // List에 기본 적용되는 outline 스타일 제거
    />
  )
};
```
리액트 컴포넌트의 렌더링은 기본적으로 빠르기 때문에 일일이 React.memo를 작성할 필요는 없다. 단, 리스트와 관련된 컴포넌트를 만들 때 보여줄 항목이 100개 이상이고 업데이트가 자주 발생한다면 꼭 최적화해줘야 한다.