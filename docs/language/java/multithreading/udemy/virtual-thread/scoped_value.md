## ThreadLocal vs ScopedValue (JDK 21)

1. ThreadLocal이란?
   ThreadLocal은 각 스레드마다 독립적인 변수 사본을 가질 수 있게 해주는 Java의 클래스입니다.
```java   
ThreadLocal<String> userContext = new ThreadLocal<>();
userContext.set("user123");
String user = userContext.get(); // "user123"
```

플랫폼 스레드(OS 스레드) 환경에서는 스레드 수가 수백~수천 개 정도로 제한적이라 큰 문제가 없었습니다.

---

### 2. Virtual Thread에서 왜 문제가 될까?

Virtual Thread(JDK 21 도입)는 OS 스레드가 아닌 **JVM이 관리하는 경량 스레드**입니다.

**핵심 문제: 스레드 수의 차이**

| 구분 | 플랫폼 스레드 | Virtual Thread |
|------|------------|---------------|
| 생성 비용 | 높음 (MB 단위) | 매우 낮음 (KB 단위) |
| 동시 운용 수 | 수백 ~ 수천 | **수백만** 개 가능 |

`ThreadLocal`은 각 스레드 객체 내부의 `ThreadLocalMap`에 데이터를 저장합니다. Virtual Thread가 100만 개 생성되면, **100만 개의 ThreadLocalMap**이 힙 메모리에 존재하게 됩니다.
```java
Virtual Thread 1 → ThreadLocalMap { userContext: "user1", dbConnection: ... }
Virtual Thread 2 → ThreadLocalMap { userContext: "user2", dbConnection: ... }
...
Virtual Thread 1,000,000 → ThreadLocalMap { ... }  ← 메모리 폭발!
```
추가적인 문제점:

ThreadLocal은 remove()를 명시적으로 호출하지 않으면 메모리 누수 발생 가능
Virtual Thread는 수명이 짧고 많이 생성/소멸되어 관리가 더 어려움
값을 변경할 수 있어(mutable) 불변성 보장이 안됨


### 3. ScopedValue란? (JDK 21, Preview → JDK 23 정식)
ScopedValue는 특정 코드 범위(scope) 안에서만 값을 공유하도록 설계된 새로운 API입니다.
```java
// ScopedValue 선언 (보통 static final로)
static final ScopedValue<String> USER_CONTEXT = ScopedValue.newInstance();

// 사용: run() 블록 안에서만 값이 유효
ScopedValue.where(USER_CONTEXT, "user123")
  .run(() -> {
    processRequest(); // 이 안에서는 USER_CONTEXT.get() == "user123"
  }); // 블록을 벗어나면 자동으로 값이 사라짐
```
### 4. ThreadLocal vs ScopedValue 비교
| 항목        |ThreadLocal|ScopedValue|
|-----------|-----------|-----------|
| 값의 생명주기   |수동 관리 (remove())|스코프 종료 시 자동 해제|
| 변경 가능성    |가능 (mutable)|불변 (immutable)|
| 메모리 효율    |Virtual Thread에서 낭비 심함|경량, 효율적|
| 자식 스레드 상속 |InheritableThreadLocal 필요|자동 상속 지원|
| 가독성       |암묵적 전달|명시적 범위 표현|

### 5. 실제 사용 시나리오 예시
ThreadLocal 방식 (문제 있음):
```java
// 요청마다 Virtual Thread 생성 → 메모리 누수 위험
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
executor.submit(() -> {
      userThreadLocal.set(getUser()); // 설정
      handleRequest();
      userThreadLocal.remove(); // 깜빡하면 메모리 누수!
   });
```

ScopedValue 방식 (권장):
```java
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
executor.submit(() -> {
   ScopedValue.where(USER_CONTEXT, getUser())
              .run(() -> handleRequest()); // 블록 끝나면 자동 정리
});
```
### 6. 결론 및 마이그레이션 가이드

- 기존 플랫폼 스레드 환경: ThreadLocal 계속 사용 가능하나 remove() 습관화 필요
- Virtual Thread 환경: 가능한 한 ScopedValue로 전환 권장
- 전환이 어려운 경우: ThreadLocal 사용량을 최소화하고, 저장하는 객체의 크기를 작게 유지