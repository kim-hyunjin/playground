---
title: 외부 API 연동 뉴스 뷰어 만들기
date: 2026-04-24
category: Frontend
tags:
  - React
  - axios
  - async-await
  - custom-hook
summary: axios를 사용하여 외부 뉴스 API를 연동하고, 비동기 작업을 처리하기 위한 async/await 문법과 커스텀 Hook 활용법을 익힙니다.
---

# 외부 API를 연동하여 뉴스 뷰어 만들기

비동기 작업의 핵심 개념을 이해하고 실전 API를 연동해 봅니다.

### 비동기 작업의 이해

서버의 API를 호출할 때 응답이 올 때까지 기다리지 않고 다음 작업을 수행하기 위해 비동기적으로 처리합니다.

1. **Callback**: 전통적인 방식이지만 중첩 시 '콜백 지옥'이 발생할 수 있습니다.
2. **Promise**: 콜백 지옥을 해결하기 위해 도입되었으며 `.then`, `.catch`로 흐름을 제어합니다.
3. **async/await**: Promise를 더 직관적이고 동기적인 코드처럼 작성할 수 있게 해줍니다.

### axios로 API 호출하기

`axios`는 가장 널리 사용되는 HTTP 클라이언트 라이브러리입니다.

```bash
yarn add axios
```

```javascript
const onClick = async () => {
  try {
    const response = await axios.get('https://newsapi.org/...');
    setData(response.data);
  } catch (e) {
    console.log(e);
  }
};
```

### 선택적 URL 파라미터

라우트 설정 시 `?`를 사용하여 파라미터를 선택적으로 만들 수 있습니다.

```javascript
<Route path="/:category?" component={NewsPage} />
```

### 커스텀 Hook (usePromise) 만들기

비동기 요청 상태(loading, resolved, error)를 관리하는 로직을 재사용하기 위해 커스텀 Hook을 작성할 수 있습니다.

```javascript
export default function usePromise(promiseCreator, deps) {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const result = await promiseCreator();
        setResolved(result);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    process();
  }, deps);

  return [loading, resolved, error];
}
```

> **주의**: `useEffect`에 등록하는 함수 자체를 `async`로 작성하면 안 됩니다. 내부에서 따로 비동기 함수를 만들어 호출해야 합니다.
