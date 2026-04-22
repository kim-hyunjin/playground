# 외부 API를 연동하여 뉴스 뷰어 만들기

### 비동기 작업의 이해
Ajax 기법을 사용하여 서버의 API를 호출. 작업을 동기적으로 처리하면 요청이 끝날 때까지 기다리는 동안 중지 상태가 되어 다른 작업을 할 수 없다. ==> 비동기로 처리하여 문제 해결.

### 콜백 함수
비동기 작업을 할 때 흔히 사용되는 방법.
```
function increase(number, callback) {
  setTimeout(() => {
    const result = number + 10;
    if(callback) {
      callback(result);
    }
  }, 1000)
}

increase(0, result => {
  console.log(result);
});
```

```
콜백 함수 중첩
increase(0, result => {
  console.log(result);
  increase(result, result => {
    console.log(result);
    increase(result, result => {
      console.log(result);
      increase(result, result => {
        console.log(result);
      });
    });
  });
});

이렇게 콜백 안에 또 콜백을 넣어 중첩하는 것을 콜백 지옥이라고 부른다.
```

### Promise
Promise는 콜백 지옥 같은 코드가 형성되지 않게 ES6에 도입된 기능이다.
```
function increase(number) {
  const promise = new Promise((resolve, reject) => {
    // resolve는 성공, reject는 실패
    setTimeout(() => {
      const result = number + 10;
      if (result > 50) {
        const e = new Error('NumberToBig');
        return reject(e);
      }
      resolve(result);
    }, 1000);
  });
  return promise
}

increase(0)
  .then(number => {
    console.log(number);
    return increase(number); // Promise를 리턴하면
  })
  .then(number => { // .then으로 처리 가능
    console.log(number);
    return increase(number);
  })
  .then(number => {
    console.log(number);
    return increase(number);
  })
  .then(number => {
    console.log(number);
    return increase(number);
  })
  .catch(e => { // 에러 발생 시 .catch를 통해 알 수 있음
    console.log(e);
  })
```

### async/await
async/await은 Promise를 더 쉽게 사용할 수 있도록 ES2017(ES8)에 적용된 문법.
```
function increase(number) {
  (...)
}

async function runTasks() {
  try {
    let result = await increase(0);
    console.log(result);
    result = await increase(result);
    console.log(result);
    result = await increase(result);
    console.log(result);
    result = await increase(result);
    console.log(result);
    result = await increase(result);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}
```

### axios로 API 호출해 데이터 받아 오기
axios는 현재 가장 많이 사용되고 있는 자바스크립트 HTTP 클라이언트다. HTTP 요청을 Promise 기반으로 처리한다는 것이 특징이다.
```
yarn add axios
```

### Route 적용하기
index.js
```
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

App.js
```
<Route path="/:category?" component={NewsPage} />

뒤에 붙은 ?의 의미 : category 값이 선택적이라는 의미
```

NewsPage.js
```
const NewsPage = ({match}) => {
  const category = match.params.category || 'all';

  return (
    <>
      <Categories />
      <NewsList category={category} />
    </>
  );
};
```

Categories.js
```
import React from 'react';
import styled from 'styled-components';
import {NavLink} from 'react-router-dom';

const Category = styled(NavLink)`(...)`;

{categories.map(c => (
  <Category
    key={c.name}
    activeClassName="active"
    exact={c.name === 'all'}
    to={c.name === 'all' ? '/' : `/${c.name}`}
  >{c.text}</Category>
))}
```

NavLink로 만들어진 Category 컴포넌트에 to 값은 "/카테고리이름"으로 설정.<br/>
전체보기의 경우 "/all" 대신 "/"로 설정. to 값이 "/"를 가리키고 있을 때는 exact 값을 true로 해줘야 한다.

### 커스텀 Hook 만들기
```
import {useState, useEffect} from 'react';

export default function usePromise(promiseCreator, deps) {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    process();
    // eslint-disable-next-line
  }, deps);

  return [loading, resolved, error];
}

```
커스텀 Hook을 사용하면 NewsList에서 대기 중 상태 관리와 useEffect 설정을 직접 하지 않아도 된다.
<br/>

**주의사항
- useEffect에 등록하는 함수는 async로 작성하면 안된다. 그 대신 함수 내부에 async 함수를 따로 만들어 줘야 한다.