---
title: "Java Virtual Thread는 만능이 아니다: 처리량은 높이고 지연 시간은 그대로인 이유"
date: 2026-07-19
category: "Language"
categories:
  - Language
  - Java
  - Concurrency
tags:
  - Java
  - Virtual Thread
  - Project Loom
  - Concurrency
  - JDK 21
summary: "플랫폼 스레드의 I/O 병목에서 출발해 Virtual Thread의 마운트·언마운트 원리와 처리량, 지연 시간, 올바른 사용 기준을 살펴봅니다."
---

# Java Virtual Thread는 만능이 아니다

Virtual Thread를 소개할 때 흔히 "아주 가벼운 스레드"라고 설명합니다. 틀린 말은 아니지만, 이 설명만으로는 언제 사용해야 하는지 판단하기 어렵습니다.

Virtual Thread가 해결하는 핵심 문제는 **작업 하나의 실행 시간을 줄이는 것**이 아닙니다. I/O를 기다리는 작업을 아주 많이 동시에 유지할 때, 플랫폼 스레드가 차지하던 비용을 줄여 **전체 처리량(throughput)**을 높이는 것입니다.

이 차이를 이해하려면 먼저 전통적인 스레드 모델이 I/O 앞에서 어떤 한계를 갖는지 살펴봐야 합니다.

## Thread-Per-Task 모델의 딜레마

서버가 요청 하나마다 독립된 스레드를 할당한다고 생각해 봅시다. 각 요청은 데이터베이스를 조회하거나 다른 서버의 HTTP 응답을 기다립니다.

```java
void handleRequest() {
    var user = userRepository.findById(1L); // I/O 대기
    var result = paymentClient.getHistory(user); // I/O 대기
    render(result);
}
```

이 구조는 이해하기 쉽습니다. 코드는 위에서 아래로 실행되고, 예외 처리와 디버깅도 자연스럽습니다. 문제는 플랫폼 스레드가 운영체제 스레드와 거의 1:1로 대응한다는 점입니다.

### 작업마다 플랫폼 스레드를 만들면

`Executors.newCachedThreadPool()`처럼 필요할 때마다 스레드를 늘리는 방식은 작은 규모에서 높은 동시성을 제공합니다.

예를 들어 1초 동안 대기하는 작업 1,000개에 스레드 1,000개를 할당하면, 모든 작업은 대략 비슷한 시점에 끝날 수 있습니다. 그러나 작업을 계속 늘리면 네이티브 스레드와 스택 메모리, 운영체제 자원 한계에 도달합니다.

```text
unable to create native thread:
possibly out of memory or process/resource limits reached
```

동시 요청 수가 그대로 스레드 수가 되기 때문에 부하가 시스템의 스레드 한계로 전파됩니다.

### 고정 크기 풀로 제한하면

스레드 수를 제한하면 애플리케이션이 갑자기 죽는 문제는 완화할 수 있습니다.

```java
ExecutorService executor = Executors.newFixedThreadPool(1_000);
```

하지만 이번에는 작업이 큐에서 기다립니다. 1초짜리 작업 10,000개를 1,000개의 스레드가 처리한다면 이상적인 경우에도 약 10번의 묶음으로 나뉩니다. 시스템은 안정적이지만 처리량이 스레드 풀 크기에 묶입니다.

플랫폼 스레드를 늘리면 자원 사용량과 컨텍스트 스위칭 비용이 커지고, 줄이면 I/O를 기다리는 동안 처리 가능한 요청 수도 줄어듭니다. 이것이 전통적인 Thread-Per-Task 모델의 딜레마입니다.

## 논블로킹 I/O라는 해법과 비용

이 문제는 오래전부터 존재했고, Netty나 Reactor 같은 논블로킹 방식이 대안으로 사용됐습니다. 적은 수의 스레드가 이벤트를 처리하므로 스레드 폭증과 불필요한 컨텍스트 스위칭을 피할 수 있습니다.

다만 순차적인 업무 로직이 콜백이나 반응형 체인으로 바뀌면서 코드의 작성, 디버깅, 프로파일링이 어려워질 수 있습니다.

```java
return userRepository.findById(id)
    .flatMap(paymentClient::getHistory)
    .map(this::render);
```

논블로킹 모델은 여전히 유효합니다. Virtual Thread의 목적은 이를 없애는 것이 아니라, **익숙한 동기식 코드를 유지하면서도 많은 I/O 작업을 감당할 수 있는 선택지**를 제공하는 것입니다.

## Virtual Thread의 실행 구조

Virtual Thread는 JDK가 스케줄링하는 `Thread`입니다. 실행할 때는 carrier라고 부르는 플랫폼 스레드 위에 올라갑니다.

```text
Virtual Thread  ── mount ──▶  Carrier Thread  ──▶  OS Thread
                ◀ unmount ──
```

- **마운트(mount)**: Virtual Thread가 carrier 위에서 코드를 실행합니다.
- **언마운트(unmount)**: Virtual Thread가 지원되는 블로킹 작업을 만나 carrier에서 내려옵니다.
- **재마운트(remount)**: 작업을 다시 실행할 수 있게 되면 사용 가능한 carrier 위에서 이어서 실행합니다.

Virtual Thread가 I/O를 기다리는 동안 carrier는 다른 Virtual Thread를 실행할 수 있습니다. 수많은 요청이 동시에 대기하더라도 그 수만큼 운영체제 스레드를 점유할 필요가 없습니다.

```java
Thread virtualThread = Thread.ofVirtual().unstarted(() -> {
    System.out.println("Hello from a virtual thread");
});

virtualThread.start();
virtualThread.join();
```

대부분의 서버 코드에서는 작업을 직접 시작하기보다 작업당 Virtual Thread를 만드는 executor를 사용하기 편합니다.

```java
try (ExecutorService executor =
         Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        executor.submit(this::blockingIoOperation);
    }
}
```

이 executor는 제출된 작업마다 새로운 Virtual Thread를 만듭니다. `try-with-resources` 블록을 벗어날 때는 제출한 작업이 끝날 때까지 기다립니다.

## 왜 처리량은 늘고 지연 시간은 그대로일까

Virtual Thread의 효과를 이해하려면 처리량과 지연 시간을 분리해야 합니다.

- **지연 시간(latency)**: 요청 하나가 시작해서 끝날 때까지 걸리는 시간
- **처리량(throughput)**: 일정 시간 동안 완료할 수 있는 요청의 수

외부 API가 응답하는 데 500ms가 걸린다면 플랫폼 스레드를 Virtual Thread로 바꿔도 그 API가 더 빨리 응답하지는 않습니다. 요청 하나의 지연 시간은 여전히 약 500ms 이상입니다.

달라지는 것은 동시에 기다릴 수 있는 요청의 수입니다. 플랫폼 스레드 200개로 요청을 처리했다면 그 이후의 요청은 큐에서 기다렸습니다. Virtual Thread는 훨씬 많은 요청이 각자의 I/O를 동시에 기다리게 할 수 있습니다. 따라서 같은 시간에 완료하는 전체 요청 수가 늘어납니다.

```text
플랫폼 스레드 풀
요청 1~200   : 실행 또는 I/O 대기
요청 201~N   : executor 큐에서 대기

Virtual Thread
요청 1~N     : 각 Virtual Thread에서 실행 또는 I/O 대기
carrier      : 실행 가능한 작업을 번갈아 수행
```

Virtual Thread가 애플리케이션의 **대기 비용을 싸게 만드는 것**이지, 데이터베이스나 네트워크 자체를 빠르게 만드는 것은 아닙니다.

## CPU-bound 작업에는 왜 도움이 되지 않을까

이미지 인코딩, 암호화, 대규모 계산처럼 CPU를 계속 사용하는 작업은 언마운트되어 기다릴 시간이 거의 없습니다. 결국 동시에 실행할 수 있는 작업 수는 CPU 코어와 carrier의 수에 의해 제한됩니다.

Virtual Thread 10,000개를 만들어도 CPU 코어가 8개라면 10,000개의 계산이 한꺼번에 수행되는 것은 아닙니다. 오히려 불필요한 스케줄링 비용만 추가될 수 있습니다.

CPU-bound 작업에는 코어 수를 고려한 제한된 병렬 처리 방식이 더 적합합니다.

```java
int processors = Runtime.getRuntime().availableProcessors();
ExecutorService cpuPool = Executors.newFixedThreadPool(processors);
```

정리하면 다음과 같습니다.

| 작업 특성 | Virtual Thread 효과 |
|---|---|
| DB, HTTP, 파일 I/O처럼 대기가 긴 작업 | 높은 동시성과 처리량에 유리 |
| 요청 하나의 외부 I/O 응답 시간 | 직접 줄이지 못함 |
| CPU를 계속 사용하는 계산 | 처리 성능상의 이점이 거의 없음 |
| 짧은 작업을 매우 많이 실행 | 실제 병목과 측정 결과를 확인해야 함 |

## Virtual Thread를 풀링하지 말아야 하는 이유

플랫폼 스레드 풀은 비싼 스레드를 재사용하고 동시에 사용하는 자원의 수를 제한하는 두 역할을 했습니다. Virtual Thread는 생성 비용이 낮기 때문에 재사용하려고 풀에 넣을 필요가 없습니다.

동시 접근을 제한해야 한다면 Virtual Thread의 수가 아니라 **실제 희소 자원**을 제한해야 합니다. 예를 들어 데이터베이스 연결 수가 50개라면 커넥션 풀이 이미 동시 DB 접근을 제한합니다. 외부 API 호출량을 제어하려면 세마포어나 rate limiter를 사용할 수 있습니다.

```java
Semaphore permits = new Semaphore(20);

String callExternalApi() throws InterruptedException {
    permits.acquire();
    try {
        return httpClient.send(request, bodyHandler).body();
    } finally {
        permits.release();
    }
}
```

작업을 표현하는 Virtual Thread와 보호해야 할 자원의 동시성 한도를 분리하는 것이 핵심입니다.

## 스레드 안전성은 사라지지 않는다

Virtual Thread는 스케줄링과 자원 사용 방식을 바꾸지만 동시성의 규칙을 바꾸지는 않습니다.

- 공유 가변 상태에는 여전히 경쟁 조건이 발생합니다.
- 락 순서가 잘못되면 여전히 데드락이 발생합니다.
- `AtomicInteger`, `AtomicReference`, `BlockingQueue` 같은 도구도 그대로 유효합니다.
- 실행 순서는 비결정적이며, 블로킹 전후에 같은 carrier에서 실행된다는 보장도 없습니다.

```java
System.out.println(Thread.currentThread());
Thread.sleep(1_000);
System.out.println(Thread.currentThread());
```

`sleep` 이후 Virtual Thread는 이전과 다른 carrier 위에서 실행을 재개할 수 있습니다. 따라서 carrier의 이름이나 identity에 의존하는 코드를 작성해서는 안 됩니다.

## Pinning은 JDK 버전을 구분해서 보자

초기 Virtual Thread 구현에서는 `synchronized` 블록이나 메서드 안에서 블로킹할 때 Virtual Thread가 carrier에서 언마운트되지 못하는 **pinning**이 중요한 주의점이었습니다. JDK 21을 기준으로 운영한다면 긴 I/O 구간을 `synchronized` 안에 두지 않는지 확인할 필요가 있습니다.

하지만 이 조언을 모든 JDK에 그대로 적용하면 안 됩니다. [JEP 491](https://openjdk.org/jeps/491)은 `synchronized`와 관련된 pinning을 제거했으며 JDK 24에 반영됐습니다. 최신 JDK에서는 단지 pinning을 피하려는 목적으로 `synchronized`를 `ReentrantLock`으로 바꿀 필요가 없습니다.

네이티브 코드나 foreign function 실행처럼 Virtual Thread가 여전히 pin될 수 있는 경우는 남아 있습니다. 운영 환경의 JDK 버전과 실제 JFR 측정 결과를 함께 확인하는 편이 안전합니다.

## ThreadLocal은 신중하게 사용한다

Virtual Thread도 `ThreadLocal`을 지원합니다. 다만 Virtual Thread를 아주 많이 만들 수 있기 때문에, 각 스레드에 크거나 수명이 긴 객체를 복사해 두는 패턴은 메모리 사용량을 크게 만들 수 있습니다.

요청 범위의 읽기 전용 컨텍스트를 전달해야 한다면 사용 중인 JDK에서 `ScopedValue`의 상태를 확인하고 대안으로 검토할 수 있습니다. 무조건적인 치환보다는 프레임워크 호환성과 객체 수명을 먼저 측정해야 합니다.

## 적용하기 좋은 경우와 피해야 할 경우

### 적용하기 좋은 경우

- 요청마다 독립적인 동기식 코드가 실행되는 서버
- DB 쿼리, HTTP 호출, 파일 I/O 등 블로킹 대기가 많은 작업
- 플랫폼 스레드 풀 크기 때문에 요청이 오래 큐잉되는 서비스
- 반응형 체인의 복잡성을 줄이면서 높은 동시성이 필요한 코드

### 먼저 다른 병목을 확인할 경우

- 대부분의 시간이 CPU 계산에 사용되는 작업
- 데이터베이스 커넥션이나 외부 API 한도가 실제 병목인 서비스
- 사용 중인 라이브러리가 블로킹 구간에서 Virtual Thread와 잘 협력하지 않는 경우
- 스레드마다 큰 `ThreadLocal` 객체를 유지하는 코드

Virtual Thread를 도입했다고 백프레셔나 용량 계획이 사라지는 것도 아닙니다. 더 많은 요청을 동시에 받아들일 수 있게 된 만큼, 데이터베이스와 외부 서비스에 전달되는 부하도 함께 커질 수 있습니다.

## 도입 전후에 측정할 것

단순히 플랫폼 스레드를 Virtual Thread로 바꾼 뒤 평균 응답 시간만 비교하면 효과를 놓치기 쉽습니다. 최소한 다음 항목을 함께 확인해야 합니다.

1. 초당 완료 요청 수와 동시 요청 수
2. 평균뿐 아니라 p95, p99 응답 시간
3. executor 큐 대기 시간
4. 데이터베이스 커넥션 풀 대기 시간
5. CPU 사용률과 메모리 사용량
6. pinning 및 긴 블로킹 구간에 대한 JFR 이벤트

낮은 부하에서는 두 모델의 차이가 거의 보이지 않을 수 있습니다. Virtual Thread의 장점은 I/O 대기가 겹치는 높은 동시성 구간에서 드러납니다.

## 마치며

Virtual Thread는 "더 빠른 스레드"라기보다 **기다리는 작업을 더 저렴하게 표현하는 스레드**입니다.

I/O-bound 서버에서는 Thread-Per-Task의 읽기 쉬운 구조를 유지하면서 높은 동시성을 얻을 수 있습니다. 반면 CPU-bound 작업을 빠르게 만들거나 외부 시스템의 응답 시간을 줄여 주지는 않습니다. 또한 Virtual Thread가 늘어난 만큼 하류 시스템에 더 큰 부하를 보낼 수 있으므로 자원별 동시성 제한은 여전히 필요합니다.

도입 판단은 간단한 질문에서 시작할 수 있습니다.

> 우리 애플리케이션은 CPU를 사용하느라 느린가, 아니면 I/O를 기다리느라 많은 플랫폼 스레드를 붙잡고 있는가?

두 번째에 가깝다면 Virtual Thread를 실험해 볼 이유가 충분합니다.

## 참고 자료

- [JEP 444: Virtual Threads](https://openjdk.org/jeps/444)
- [JEP 491: Synchronize Virtual Threads without Pinning](https://openjdk.org/jeps/491)
- [Oracle Java 21 문서: Virtual Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
