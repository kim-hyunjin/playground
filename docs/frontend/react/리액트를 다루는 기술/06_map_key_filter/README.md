# 컴포넌트 반복

### map사용하기
```
const IterationSample = () => {
  const names = ['눈사람', '얼음', '눈', '바람'];
  const nameList = names.map(name => <li>{name}</li>);
  return <ul>{nameList}</ul>;
};
```

### key
컴포넌트 배열을 렌더링했을 때 어떤 원소에 변동이 있었는지 알아내기 위해 key를 사용.<br/>
key가 없을 때는 Virtual DOM을 비교하는 과정에서 리스트를 순차적으로 비교.<br/>
하지만 key가 있다면 이 값을 사용해 어떤 변화가 일어났는지 더욱 빠르게 알아낼 수 있다.

#### key 설정
```
const IterationSample = () => {
  const names = ['눈사람', '얼음', '눈', '바람'];
  const nameList = names.map((name, index) => <li key={index}>{name}</li>); // map함수에 전달되는 콜백 함수의 인수인 index 값을 사용.
  return <ul>{nameList}</ul>;
};
```

### 배열 업데이트 시 불변성 유지
리액트에서 상태를 업데이트할 때는 기존 상태를 그대로 두면서 새로운 값을 상태도 설정해야 한다. - 불변성 유지.<br/>
불변성 유지를 해 주어야 리액트 컴포넌트의 성능을 최적화할 수 있다.<br/>
이러한 이유로 배열에 새 항목을 추가할 때 push대신 concat을 사용한다. push는 기존 배열 자체를 변경하지만, concat은 새로운 배열을 만들어 주기 때문이다.<br/>
반대로 배열에서 항목을 삭제할 때는 filter를 사용하며 된다.

+ key값은 언제나 유일해야 한다.