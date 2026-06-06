# Java Virtual Thread (JDK 21+)

## 1. Virtual Thread란?

JDK 21에서 정식 도입된 경량 스레드. 기존 플랫폼 스레드(OS 스레드)의 한계를 극복하기 위해 설계되었다.

| 구분 | 플랫폼 스레드 | Virtual Thread |
|------|-------------|----------------|
| 메모리 | 스택 ~1MB | 수백 바이트~수 KB |
| 생성 비용 | 높음 (OS 커널 호출) | 낮음 (JVM 힙에 객체 생성) |
| 최대 수 | 수천 개 수준 | 수백만 개 가능 |
| 스케줄링 | OS 스케줄러 | JVM 스케줄러 (ForkJoinPool) |
| GC | 불가 (OS 자원) | 가능 (일반 자바 객체) |

## 2. 핵심 구조: Carrier Thread와 마운트/언마운트

```
Virtual Thread  ──mount──▶  Carrier Thread  ──1:1──▶  OS Thread
                ◀─unmount──
```

- **Carrier Thread**: Virtual Thread를 실제 실행하는 플랫폼 스레드. `ForkJoinPool`의 워커 스레드로, 기본 개수는 CPU 코어 수와 동일하다.
- **마운트(Mount)**: Virtual Thread가 Carrier Thread 위에 올라가 실행되는 것.
- **언마운트(Unmount)**: 블로킹 호출(I/O, sleep 등) 시 Virtual Thread가 Carrier Thread에서 내려오는 것. Carrier Thread는 즉시 다른 Virtual Thread를 실행할 수 있다.

이 마운트/언마운트 비용은 OS 컨텍스트 스위칭보다 훨씬 저렴하여, 대량의 스레드를 운용해도 스래싱(Thrashing)이 발생하지 않는다.

## 3. 예제 코드 설명

### 3.1 VirtualThreadsDemo.java - 기본 사용법

`Thread.ofVirtual().unstarted(runnable)`로 Virtual Thread를 생성하는 가장 기본적인 방법을 보여준다.

```java
Thread virtualThread = Thread.ofVirtual().unstarted(runnable);
virtualThread.start();
virtualThread.join();
```

- 1000개의 Virtual Thread를 생성하고 실행한다.
- 출력에서 `ForkJoinPool-1-worker-N` 형태의 Carrier Thread 이름을 확인할 수 있다.
- 소수의 Carrier 스레드(워커)가 1000개의 Virtual Thread를 번갈아 실행한다.

### 3.2 VirtualThreadsWithBlockingCalls.java - 블로킹 호출 시 동작

블로킹 호출 전후로 Carrier Thread가 바뀔 수 있음을 보여준다.

```java
// sleep 전: VirtualThread[#21]/runnable@ForkJoinPool-1-worker-1
Thread.sleep(1000);
// sleep 후: VirtualThread[#21]/runnable@ForkJoinPool-1-worker-3  (워커가 바뀔 수 있음)
```

- `Thread.sleep()` 호출 시 Virtual Thread는 언마운트된다.
- sleep이 끝나면 아무 Carrier Thread에 다시 마운트되므로, 워커 번호가 달라질 수 있다.
- 스케줄링 순서는 비결정적(non-deterministic)이다.

### 3.3 VirtualThreadPerTask.java - 작업당 스레드 모델

`Executors.newVirtualThreadPerTaskExecutor()`를 사용하여 작업당 하나의 Virtual Thread를 생성하는 패턴을 보여준다.

```java
try (ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        executorService.submit(() -> blockingIoOperation());
    }
}
```

- 1만 개의 작업 각각에 Virtual Thread를 생성한다.
- 플랫폼 스레드로 동일하게 하면 OOM(OutOfMemoryError)으로 크래시되지만, Virtual Thread는 정상 동작한다.
- `try-with-resources` 블록이 닫힐 때 모든 작업이 완료될 때까지 대기한다 (`ExecutorService`가 `AutoCloseable` 구현).

## 4. Virtual Thread와 스레드 안전성

기존 플랫폼 스레드에서 배운 모든 스레드 안전성 개념은 Virtual Thread에도 **동일하게 적용**된다.

- **경쟁 조건(Race Condition)**: Virtual Thread 간에도 동일하게 발생한다.
- **데드락(Deadlock)**: 잘못된 락 순서는 Virtual Thread에서도 데드락을 유발한다.
- **데이터 레이스(Data Race)**: 공유 자원에 대한 비동기 접근 문제도 동일하다.
- **스레드 간 통신**: `wait`/`notify`, `BlockingQueue` 등의 메커니즘도 그대로 사용한다.
- **Lock-free 알고리즘**: `AtomicInteger`, `AtomicReference` 등도 동일하게 적용된다.

Virtual Thread는 **스케줄링 방식만 다를 뿐**, 올바른 실행을 위한 조치와 직관은 플랫폼 스레드와 완전히 동일하다.

## 5. Virtual Thread와 성능

### 5.1 CPU 전용 작업

Virtual Thread는 **성능 이점이 없다**. CPU 바운드 작업의 병렬성은 Carrier Thread 수(= CPU 코어 수)에 의해 제한된다.

### 5.2 지연 시간(Latency)

Virtual Thread는 **지연 시간 개선에 도움이 되지 않는다**. Virtual Thread의 유일한 성능 이점은 **처리량(Throughput)**이다.

### 5.3 짧고 빈번한 블로킹 호출

짧고 빈번한 블로킹 호출은 매우 비효율적이지만, Virtual Thread가 플랫폼 스레드보다 더 나은 선택이다.

| 방식 | 오버헤드 |
|------|---------|
| Thread-Per-Task (플랫폼 스레드) | OS 컨텍스트 스위치 발생 |
| Thread-Per-Task (Virtual Thread) | 마운트/언마운트만 발생 (훨씬 가벼움) |

**해결 방법**: 짧은 I/O 작업을 배치(batch)로 묶어, 빈번하지 않은 하나의 긴 I/O 작업으로 변환한다.

## 6. Virtual Thread가 적합한 경우

- **I/O 바운드 작업**: DB 쿼리, HTTP 요청, 파일 I/O 등 대기 시간이 긴 작업
- **높은 동시성이 필요한 서버**: 수만 개의 동시 요청을 처리하는 웹 서버

## 7. Virtual Thread가 부적합한 경우

- **CPU 바운드 작업**: 연산 집약적 작업은 Carrier Thread 수(= CPU 코어 수) 이상의 병렬성을 얻을 수 없다.
- **synchronized 블록 내 블로킹**: `synchronized` 내부에서 블로킹 시 Carrier Thread가 함께 블로킹된다 (pinning 현상). `ReentrantLock`으로 대체하면 해결된다.

## 8. Best Practice

- **고정 크기 풀을 만들지 말 것**: Virtual Thread에 풀링(pooling)은 불필요하다. `Executors.newVirtualThreadPerTaskExecutor()`를 사용하는 것이 권장된다.
- **항상 데몬 스레드**: Virtual Thread는 항상 데몬 스레드이다. `virtualThread.setDaemon(false)`를 호출하면 예외가 발생한다.
- **우선순위 변경 불가**: `virtualThread.setPriority(...)`를 호출해도 아무 효과가 없다. 항상 기본 우선순위로 동작한다.
- `ThreadLocal` 사용 시 주의: Virtual Thread 수가 매우 많을 수 있으므로 메모리 낭비 위험이 있다. JDK 21의 `ScopedValue`를 고려하자.

## 9. 관측성(Observability)과 디버깅

- Carrier Thread는 개발자에게 **숨겨져** 있다. 우리가 다루는 것은 Virtual Thread이다.
- 브레이크포인트 설정 및 스레드 상태 검사 방법은 플랫폼 스레드와 동일하다.
- **주의**: 수천~수백만 개의 Virtual Thread가 존재할 수 있으므로, 스레드 안전성 가이드라인과 모범 사례를 반드시 준수해야 한다.