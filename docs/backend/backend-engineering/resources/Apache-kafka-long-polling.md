# Apache Kafka Long Polling 완전 가이드

## 목차

1. [개요](#1-개요)
2. [Short Polling vs Long Polling](#2-short-polling-vs-long-polling)
3. [Kafka Long Polling의 동작 원리](#3-kafka-long-polling의-동작-원리)
4. [Fetch 요청 아키텍처](#4-fetch-요청-아키텍처)
5. [Broker Purgatory (퍼거토리)](#5-broker-purgatory-퍼거토리)
6. [핵심 설정 파라미터](#6-핵심-설정-파라미터)
7. [성능 튜닝: 처리량 vs 지연시간](#7-성능-튜닝-처리량-vs-지연시간)
8. [Prefetch 최적화](#8-prefetch-최적화)
9. [주요 주의사항 및 흔한 실수](#9-주요-주의사항-및-흔한-실수)
10. [설정 예시 및 권장 값](#10-설정-예시-및-권장-값)
11. [요약](#11-요약)

---

## 1. 개요

Apache Kafka는 기본적으로 **Pull 기반(소비자가 브로커에게 데이터를 요청)** 메시지 시스템이다. 이 Pull 방식의 단점은 브로커에 데이터가 없을 때 소비자가 빈 응답을 계속 받으며 빈번하게 요청을 반복하는 **Tight Loop** 문제가 발생한다는 것이다.

Kafka는 이 문제를 해결하기 위해 **Long Polling** 메커니즘을 도입했다. Long Polling을 통해 소비자는 브로커에게 "데이터가 있거나 타임아웃이 될 때까지 응답을 보내지 마라"고 지시할 수 있어, 불필요한 네트워크 오버헤드와 CPU 소비를 줄일 수 있다.

> **참고**: Long Polling은 Kafka 초기 버전부터 이슈(`KAFKA-48`)로 논의되었으며, 현재는 `fetch.min.bytes`와 `fetch.max.wait.ms` 두 파라미터로 제어된다.

---

## 2. Short Polling vs Long Polling

### Short Polling (기존 방식)

```
Consumer ──── Fetch Request ────► Broker
Consumer ◄─── Empty Response ─── Broker  (데이터 없음)
Consumer ──── Fetch Request ────► Broker
Consumer ◄─── Empty Response ─── Broker  (데이터 없음)
Consumer ──── Fetch Request ────► Broker
Consumer ◄─── Data Response ──── Broker  (데이터 있음)
```

- 브로커에 데이터가 없으면 즉시 빈 응답을 반환한다.
- 소비자가 루프 안에서 계속 요청을 반복하므로 CPU와 네트워크 자원이 낭비된다.
- 높은 빈도의 요청은 브로커에도 부담이 된다.

### Long Polling (현재 방식)

```
Consumer ──── Fetch Request (min.bytes=1MB, wait=500ms) ────► Broker
             [데이터가 부족하면 Broker가 Purgatory에서 대기]
                     ... 최대 500ms 대기 ...
Consumer ◄──────────── Data Response (조건 충족 시) ─────── Broker
```

- 소비자는 최소 데이터 크기(`fetch.min.bytes`)와 최대 대기 시간(`fetch.max.wait.ms`)을 지정한다.
- 브로커는 조건이 충족되거나 타임아웃이 될 때까지 응답을 보류한다.
- 요청 빈도가 줄어들어 네트워크 효율성과 처리량이 모두 향상된다.

| 비교 항목 | Short Polling | Long Polling |
|---|---|---|
| **응답 방식** | 즉시 반환 (데이터 없어도) | 조건 충족 또는 타임아웃 후 반환 |
| **리소스 사용** | 높음 (반복 요청) | 낮음 (대기 중 차단) |
| **네트워크 효율** | 낮음 | 높음 |
| **구현 복잡도** | 단순 | 브로커 Purgatory 필요 |
| **설정 파라미터** | 없음 | `fetch.min.bytes`, `fetch.max.wait.ms` |

---

## 3. Kafka Long Polling의 동작 원리

Kafka 소비자가 `poll(Duration)`을 호출하면 내부적으로 아래 과정이 진행된다.

```
┌─────────────────────────────────────────────┐
│             Consumer poll() 호출             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│    캐시된 레코드가 있는가?                    │
│    (이전 Prefetch 데이터)                    │
└─────┬──────────────────────┬────────────────┘
      │ YES                  │ NO
      ▼                      ▼
┌──────────┐    ┌─────────────────────────────┐
│ 즉시 반환 │    │    Broker에 Fetch Request 전송│
└──────────┘    └──────────────┬──────────────┘
                               │
                               ▼
               ┌───────────────────────────────┐
               │  fetch.min.bytes 충족 여부 확인 │
               └──────────┬──────┬─────────────┘
                          │ YES  │ NO
                          │      ▼
                          │  ┌──────────────────────────┐
                          │  │  Purgatory에 요청 보관    │
                          │  │  타이머 시작               │
                          │  └────────┬─────────────────┘
                          │           │
                          │    fetch.min.bytes 충족 OR
                          │    fetch.max.wait.ms 만료
                          │           │
                          └─────┬─────┘
                                ▼
               ┌───────────────────────────────┐
               │     응답 생성 및 소비자에 전송  │
               │     (Zero-Copy 전송)           │
               └───────────────────────────────┘
```

### 핵심 흐름 요약

1. 소비자가 Fetch 요청을 브로커에 보낸다.
2. 브로커는 요청 즉시 `fetch.min.bytes`를 충족하는 데이터가 있는지 확인한다.
3. **데이터가 충분하면**: 즉시 응답을 반환하고 Purgatory를 거치지 않는다.
4. **데이터가 부족하면**: 요청을 **Purgatory**에 보관하고, 두 조건 중 먼저 충족되는 쪽에 반응한다.
   - `fetch.min.bytes`만큼 데이터가 쌓이면 응답 반환
   - `fetch.max.wait.ms` 시간이 초과되면 응답 반환
5. 응답은 **Zero-Copy** 방식으로 디스크 → 소켓 버퍼로 직접 전송된다.

---

## 4. Fetch 요청 아키텍처

Kafka의 Fetch 요청은 두 부분으로 구성된다.

- **Request Metadata**: 요청 설정 정보 (파티션, 오프셋, 최소 바이트, 최대 대기 시간 등)
- **Fetch Request Data**: 실제 메시지 데이터

### 중요한 내부 동작: poll()과 fetch는 분리되어 있다

`consumer.poll()` 호출이 항상 브로커에 Fetch 요청을 보내는 것은 아니다. 두 동작은 내부적으로 분리되어 있으며, 이전에 받아온 데이터가 캐시에 있으면 Fetch 요청 없이 바로 반환한다.

### Zero-Copy 전송

브로커는 데이터를 메모리에 복사하지 않고 디스크에서 소켓 버퍼로 직접 전송하는 **Zero-Copy** 방식을 사용한다. 이는 대용량 데이터 처리 시 성능을 크게 향상시킨다.

```
[일반 복사]
디스크 → 커널 버퍼 → 애플리케이션 버퍼 → 소켓 버퍼 → 네트워크

[Zero-Copy]
디스크 → 커널 버퍼 ──────────────────────► 소켓 버퍼 → 네트워크
```

---

## 5. Broker Purgatory (퍼거토리)

**Purgatory**는 즉시 처리할 수 없는 요청을 임시로 보관하는 브로커 내부의 자료구조다. 이름처럼 "연옥"에서 조건이 충족되길 기다리는 요청들이 머무는 공간이다.

### Purgatory의 역할

- I/O 스레드를 블로킹하지 않으면서 요청을 대기시킨다.
- Long Polling Fetch 요청을 효율적으로 관리한다.
- Producer 요청(`acks=all`로 모든 레플리카의 확인을 기다리는 경우)도 관리한다.

### Purgatory 내부 구조: Hierarchical Timing Wheels

Kafka는 수많은 대기 요청을 효율적으로 관리하기 위해 **계층적 타이밍 휠(Hierarchical Timing Wheels)** 알고리즘을 사용한다.

```
[타이밍 휠 구조]

밀리초 단위 휠:  [0][1][2]...[999]
초 단위 휠:     [0][1][2]...[59]
분 단위 휠:     [0][1][2]...[59]
...
```

- 만료 시간이 가까운 요청은 하위 휠에, 먼 요청은 상위 휠에 배치한다.
- 타임아웃 도달 시 상위 휠에서 하위 휠로 이동(cascade)된다.
- 이를 통해 O(1) 시간복잡도로 타이머를 관리할 수 있다.

### Purgatory 처리 흐름

```
Fetch Request 수신
       │
       ▼
데이터 충분? ──► YES ──► 즉시 응답 큐로 이동
       │
      NO
       │
       ▼
Purgatory에 요청 저장
+ 타이밍 휠에 타이머 등록
       │
       ▼
[fetch.min.bytes 충족] OR [fetch.max.wait.ms 만료]
       │
       ▼
Purgatory에서 꺼내어 응답 생성
       │
       ▼
응답 큐 → 네트워크 스레드 → 소비자에게 전송
```

---

## 6. 핵심 설정 파라미터

### `fetch.min.bytes`

| 항목 | 내용 |
|---|---|
| **기본값** | 1 byte |
| **역할** | 브로커가 응답하기 전 최소한 보유해야 할 데이터 크기 |
| **동작** | 데이터가 이 크기 미만이면 Purgatory에서 대기 |
| **효과** | 값을 높이면 → 처리량 증가, 지연시간 증가 |

```properties
# 예: 최소 16KB가 쌓일 때까지 대기
fetch.min.bytes=16384
```

### `fetch.max.wait.ms`

| 항목 | 내용 |
|---|---|
| **기본값** | 500ms |
| **역할** | `fetch.min.bytes`가 충족되지 않을 때 브로커가 최대 기다리는 시간 |
| **동작** | 이 시간이 지나면 데이터가 부족해도 응답 반환 |
| **효과** | 값을 높이면 → 배치 크기 증가, 지연시간 증가 |

```properties
# 예: 최대 1초 대기 (기본값의 2배)
fetch.max.wait.ms=1000
```

### 두 파라미터의 관계

`fetch.min.bytes`와 `fetch.max.wait.ms`는 **OR 조건**으로 동작한다. 둘 중 **먼저 충족되는 조건**에 따라 응답이 반환된다.

```
시간 →
─────────────────────────────────────────────►
  [Fetch 요청 수신]
       │
       │  fetch.max.wait.ms = 500ms
       │◄────────────────────────────────────►│
       │                                      │
       │  데이터가 fetch.min.bytes에 도달하면  │  타임아웃
       │  이 시점에 즉시 응답                 │  에 응답
       └──────►[응답]    OR                   └──►[응답]
```

### 기타 관련 파라미터

| 파라미터 | 기본값 | 설명 |
|---|---|---|
| `fetch.max.bytes` | 52428800 (50MB) | Fetch 요청당 최대 반환 데이터 크기 |
| `max.partition.fetch.bytes` | 1048576 (1MB) | 파티션당 최대 반환 데이터 크기 |
| `max.poll.records` | 500 | `poll()` 호출당 최대 반환 레코드 수 |
| `max.poll.interval.ms` | 300000 (5분) | `poll()` 호출 간 최대 허용 시간 |
| `request.timeout.ms` | 30000 (30초) | 브로커 응답 대기 최대 시간 |

---

## 7. 성능 튜닝: 처리량 vs 지연시간

Long Polling 파라미터는 **처리량(Throughput)**과 **지연시간(Latency)** 사이의 트레이드오프를 조절한다.

### 높은 처리량 최적화 (배치 처리, 대량 데이터)

```properties
fetch.min.bytes=65536          # 64KB 이상 쌓일 때까지 대기
fetch.max.wait.ms=1000         # 최대 1초 대기
max.poll.records=1000          # 한 번에 최대 1000개 레코드
fetch.max.bytes=104857600      # 최대 100MB
```

**효과**: 적은 수의 큰 배치를 가져와 네트워크 오버헤드 감소, CPU 사용률 감소

### 낮은 지연시간 최적화 (실시간 처리)

```properties
fetch.min.bytes=1              # 기본값, 데이터가 있으면 즉시 반환
fetch.max.wait.ms=100          # 최대 100ms만 대기
max.poll.records=100           # 소규모 배치
```

**효과**: 데이터가 도착하면 즉시 처리, 낮은 end-to-end 지연시간

### 타임아웃 체인 (중요!)

Long Polling 환경에서 타임아웃 값들 간의 논리적 순서가 반드시 지켜져야 한다.

```
request.timeout.ms > poll.timeout.ms ≥ fetch.max.wait.ms
```

또한 `max.poll.interval.ms`는 아래 전체 사이클을 커버할 수 있어야 한다.

```
max.poll.interval.ms > (배치 Fetch 시간 + 처리 시간 + 오프셋 커밋 시간)
```

---

## 8. Prefetch 최적화

Kafka 소비자는 현재 배치를 처리하는 동안 **미리 다음 배치를 가져오는(Prefetch)** 최적화를 수행한다.

```
[처리 흐름]

poll() → [배치 1 수신] → 애플리케이션 처리 중...
                            │
                            └─ (백그라운드에서 배치 2 미리 Fetch)

poll() → [배치 2 즉시 반환] → 애플리케이션 처리 중...
                                 │
                                 └─ (백그라운드에서 배치 3 미리 Fetch)
```

이 Prefetch 덕분에 `poll()`이 항상 Fetch 요청을 트리거하지는 않으며, 이미 캐시된 데이터를 즉시 반환하는 경우도 많다.

---

## 9. 주요 주의사항 및 흔한 실수

### 1. `fetch.min.bytes` 과도하게 높게 설정

- 데이터 유입량이 적을 경우 항상 `fetch.max.wait.ms`까지 기다리게 된다.
- 불필요하게 지연시간이 높아진다.

### 2. `max.poll.interval.ms` 타임아웃 초과

- 메시지 처리가 `max.poll.interval.ms`보다 오래 걸리면 소비자 그룹에서 제외(Rebalance)된다.
- 파티션이 다른 소비자에게 재할당되며, 최악의 경우 중복 처리가 발생한다.
- **해결책**: `max.poll.records`를 줄이거나 `max.poll.interval.ms`를 늘린다.

### 3. `FETCH_MAX_WAIT_MS`를 과도하게 높게 설정

- 수십 분 단위의 긴 대기 시간은 `DisconnectException` 등의 오류를 유발할 수 있다.
- 연결 타임아웃 설정(`connections.max.idle.ms`)과 함께 신중하게 조정해야 한다.

### 4. `poll()` 메서드 서명 주의

```java
// ❌ Deprecated: 타임아웃을 지정해도 무한 대기 가능
consumer.poll(1000);

// ✅ 권장: Duration 타입 사용, 지정한 시간 후 빈 결과 반환
consumer.poll(Duration.ofMillis(1000));
```

### 5. 자동 커밋과 수동 커밋

정확히 한 번 처리(Exactly Once)가 필요하다면 자동 커밋을 비활성화하고, 처리 완료 후 수동으로 오프셋을 커밋해야 한다.

```properties
enable.auto.commit=false
```

---

## 10. 설정 예시 및 권장 값

### 실시간 이벤트 스트리밍 (낮은 지연시간 중시)

```properties
fetch.min.bytes=1
fetch.max.wait.ms=100
max.poll.records=100
max.poll.interval.ms=30000
enable.auto.commit=false
```

### 배치 데이터 파이프라인 (높은 처리량 중시)

```properties
fetch.min.bytes=65536
fetch.max.wait.ms=1000
max.poll.records=1000
fetch.max.bytes=52428800
max.poll.interval.ms=600000
enable.auto.commit=false
```

### Spark / 빅데이터 프레임워크 연동

```properties
fetch.min.bytes=1048576       # 1MB
fetch.max.wait.ms=2000        # 2초
max.poll.interval.ms=900000   # 15분 (처리 시간이 길 수 있음)
max.poll.records=5000
```

---

## 11. 요약

Apache Kafka의 Long Polling은 Pull 방식의 단점인 빈 응답 반복 문제를 해결하는 핵심 메커니즘이다.

**Long Polling의 3가지 핵심 요소**

1. **`fetch.min.bytes`** — 크기 기반 배치: 지정 크기만큼 데이터가 쌓이면 응답
2. **`fetch.max.wait.ms`** — 시간 기반 배치: 지정 시간이 지나면 응답
3. **Purgatory** — 브로커 내 대기 자료구조: Hierarchical Timing Wheels로 효율적 관리

이 세 요소가 **Zero-Copy 전송**, **Prefetch 최적화**와 결합되어 Kafka가 높은 처리량과 낮은 지연시간을 동시에 달성할 수 있는 기반이 된다.

```
[Kafka Long Polling 전체 그림]

Consumer                    Broker                    Log (Disk)
   │                           │                           │
   │── Fetch(min=1MB, wait=500ms) ──►│                     │
   │                           │── 데이터 부족 ──► Purgatory│
   │                           │                    ↕ 대기  │
   │                           │◄─ 데이터 쌓임 ──── Log ───│
   │                           │── Purgatory에서 꺼냄       │
   │◄── Response (Zero-Copy) ──│                           │
   │                           │                           │
   │ [처리 중...]               │                           │
   │── 다음 Fetch (Prefetch) ──►│                           │
   │                           │                           │
```

---

*참고 자료*

- [Confluent: Inside the Kafka Black Box - Consumer Fetch Requests](https://www.confluent.io/blog/kafka-producer-and-consumer-internals-4-consumer-fetch-requests/)
- [Apache Kafka JIRA - KAFKA-48: Implement long poll support](https://issues.apache.org/jira/browse/KAFKA-48)
- [Strimzi: Optimizing Kafka consumers](https://strimzi.io/blog/2021/01/07/consumer-tuning/)
- [Conduktor: Kafka Consumer Important Settings](https://www.conduktor.io/kafka/kafka-consumer-important-settings-poll-and-internal-threads-behavior/)
- [Apache Kafka Wiki: Request Purgatory](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=34839465)
- [Medium: Understanding Long Polling in Kafka](https://tahseenrchowdhury.medium.com/understanding-long-polling-in-kafka-a-deep-dive-982c07abef6d)
- [Red Hat AMQ Streams: Kafka Consumer Configuration Tuning](https://access.redhat.com/documentation/en-us/red_hat_amq_streams/2.2/html/kafka_configuration_tuning/con-consumer-config-properties-str)
