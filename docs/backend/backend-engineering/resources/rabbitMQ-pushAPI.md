# RabbitMQ Push API (Consumer/구독자) 가이드

> 출처: RabbitMQ 공식 문서 — Consumers 페이지

---

## 목차

1. [용어 정의](#1-용어-정의)
2. [기본 개념](#2-기본-개념)
3. [Consumer 태그](#3-consumer-태그)
4. [Consumer 생명주기](#4-consumer-생명주기)
5. [Consumer 등록 — Push API](#5-consumer-등록--push-api)
6. [메시지 속성 및 전달 메타데이터](#6-메시지-속성-및-전달-메타데이터)
7. [승인(Acknowledgement) 모드](#7-승인acknowledgement-모드)
8. [Prefetch — 동시 전달 수 제한](#8-prefetch--동시-전달-수-제한)
9. [Consumer Capacity 메트릭](#9-consumer-capacity-메트릭)
10. [Consumer 취소 (구독 해제)](#10-consumer-취소-구독-해제)
11. [Pull API와의 차이](#11-pull-api와의-차이)
12. [전달 승인 타임아웃](#12-전달-승인-타임아웃)
13. [배타적 소비 (Exclusivity)](#13-배타적-소비-exclusivity)
14. [단일 활성 Consumer (Single Active Consumer)](#14-단일-활성-consumer-single-active-consumer)
15. [Consumer 활성 상태](#15-consumer-활성-상태)
16. [Consumer 우선순위](#16-consumer-우선순위)
17. [예외 처리](#17-예외-처리)
18. [동시성 고려사항](#18-동시성-고려사항)

---

## 1. 용어 정의

**Consumer(소비자)** 란 메시지를 소비하고 승인(acknowledge)하는 애플리케이션(또는 인스턴스)을 말한다. 동일한 애플리케이션이 메시지를 발행(publish)하는 **Publisher**가 될 수도 있다.

메시징 프로토콜에서 지속적인 구독(subscription) 개념을 **Subscription** 또는 **Consumer**라고 부른다. RabbitMQ는 두 용어를 모두 지원하지만 공식 문서에서는 **Consumer**를 주로 사용한다.

> Consumer는 메시지 전달이 시작되기 전에 반드시 등록되어야 하며, 애플리케이션에 의해 취소될 수 있는 구독 단위이다.

---

## 2. 기본 개념

RabbitMQ는 메시지 브로커로서 Publisher로부터 메시지를 받아 라우팅하고, 큐(queue)에 저장하거나 Consumer에게 즉시 전달한다.

- Consumer는 **큐(queue)로부터** 메시지를 소비한다.
- 메시지를 소비하려면 반드시 큐가 존재해야 한다.
- Consumer가 등록되면 큐에 준비된 메시지가 있을 경우 **즉시 전달이 시작**된다.
- 등록 시점에 큐가 비어있다면, 새 메시지가 큐에 들어올 때 처음으로 전달된다.
- **존재하지 않는 큐**에서 소비를 시도하면 `404 Not Found` 채널 예외가 발생하고 해당 채널이 닫힌다.

---

## 3. Consumer 태그

모든 Consumer에는 **고유 식별자(Consumer Tag)** 가 부여된다. 클라이언트 라이브러리는 이 태그를 사용해 전달된 메시지에 대해 어떤 핸들러를 호출할지 결정한다.

- 프로토콜마다 부르는 이름이 다르지만 (Consumer Tag, Subscription ID 등), RabbitMQ 문서는 **Consumer Tag**를 사용한다.
- Consumer 태그는 **Consumer 취소(cancel)** 시에도 사용된다.

---

## 4. Consumer 생명주기

Consumer는 **장기 실행(long-lived)** 을 목적으로 설계되었다. 하나의 Consumer가 수명 동안 여러 메시지를 받는 것이 정상이며, 단일 메시지를 소비하기 위해 Consumer를 등록하는 것은 비효율적이다.

- Consumer는 보통 **애플리케이션 시작 시** 등록한다.
- 연결(connection)이나 애플리케이션이 살아있는 동안 유지된다.
- WebSocket 클라이언트(Web STOMP, Web MQTT 플러그인), 모바일 클라이언트처럼 동적으로 등록/해제할 수도 있다.

### 연결 복구 (Connection Recovery)

연결이 끊기면 메시지 전달이 중단된다. 일부 클라이언트 라이브러리(Java, .NET, Bunny 등)는 **자동 연결 복구** 기능을 제공한다.

자동 복구가 없는 경우 권장 복구 순서는 다음과 같다:

1. 연결(Connection) 복구
2. 채널(Channel) 복구
3. 큐(Queue) 복구
4. 익스체인지(Exchange) 복구
5. 바인딩(Binding) 복구
6. Consumer 복구

> Consumer는 항상 마지막에 복구한다 — 대상 큐와 바인딩이 준비된 후에 등록해야 한다.

---

## 5. Consumer 등록 — Push API

애플리케이션은 RabbitMQ가 큐에 쌓인 메시지를 **자동으로 밀어보내도록(push)** 구독을 등록할 수 있다. 이 방식을 **Push API** 또는 **구독(Subscription)** 이라고 한다.

### 동작 흐름

```
애플리케이션 → 큐에 Consumer 등록 (subscribe)
                    ↓
RabbitMQ → 메시지가 있을 때마다 Consumer에게 자동 push
                    ↓
사용자 정의 핸들러(함수 또는 인터페이스 구현체) 호출
```

- 구독 성공 시 **구독 식별자(Consumer Tag)** 가 반환된다.
- 이 태그는 나중에 Consumer를 취소할 때 사용한다.

### 클라이언트별 예제 참조

| 클라이언트 | 참조 문서 |
|---|---|
| Java | Java client guide |
| .NET | .NET client guide |

---

## 6. 메시지 속성 및 전달 메타데이터

메시지 전달 시 **전달 정보(delivery info)** 와 **메시지 속성(message properties)** 이 함께 제공된다.

### 전달/라우팅 정보 (RabbitMQ가 설정)

| 속성 | 타입 | 설명 |
|---|---|---|
| Delivery tag | 양의 정수 | 전달 식별자 (Confirms에서 사용) |
| Redelivered | Boolean | 이전에 전달된 후 재큐잉된 경우 `true` |
| Exchange | String | 메시지를 라우팅한 Exchange |
| Routing key | String | Publisher가 사용한 라우팅 키 |
| Consumer tag | String | Consumer(구독) 식별자 |

### 메시지 속성 (Publisher가 설정)

| 속성 | 타입 | 설명 | 필수 |
|---|---|---|---|
| Delivery mode | Enum (1 or 2) | 2: persistent(영속), 1: transient(일시적) | **Yes** |
| Type | String | 애플리케이션 정의 메시지 타입 (예: `orders.created`) | No |
| Headers | Map | 임의의 헤더 맵 | No |
| Content type | String | 콘텐츠 타입 (예: `application/json`) | No |
| Content encoding | String | 콘텐츠 인코딩 (예: `gzip`) | No |
| Message ID | String | 임의의 메시지 ID | No |
| Correlation ID | String | 요청-응답 상관관계 ID | No |
| Reply To | String | 응답 큐 이름 | No |
| Expiration | String | 메시지별 TTL | No |
| Timestamp | Timestamp | 발행자가 설정한 타임스탬프 | No |
| User ID | String | 사용자 ID (설정 시 검증됨) | No |
| App ID | String | 애플리케이션 이름 | No |

### 메시지 타입 (Type 속성)

- Publisher와 Consumer 간 약속된 **임의의 문자열**이다.
- RabbitMQ는 이 필드를 검증하거나 사용하지 않는다.
- 일반적으로 점(`.`) 구분 네이밍 컨벤션을 사용한다: `orders.created`, `logs.line`, `profiles.image.changed`
- Consumer가 처리할 수 없는 타입의 메시지를 받은 경우 **반드시 로그**를 남겨야 한다.

### Content Type & Encoding

- `Content-Type`: 메시지 페이로드 역직렬화 방식 안내 (예: `application/json`)
- `Content-Encoding`: 디코딩 방식 안내 (예: `gzip`)
- RabbitMQ 자체는 이 필드들을 검증/사용하지 않으며, **애플리케이션 및 플러그인이 해석**한다.
- 여러 인코딩은 쉼표(`,`)로 구분하여 지정한다.

---

## 7. 승인(Acknowledgement) 모드

Consumer 등록 시 두 가지 전달 모드 중 하나를 선택한다:

| 모드 | 설명 |
|---|---|
| **자동 (Automatic)** | 승인 불필요 — "fire and forget" 방식 |
| **수동 (Manual)** | 클라이언트가 명시적으로 승인해야 함 |

> 자세한 내용은 별도의 Consumer Acknowledgements / Publisher Confirms 문서를 참조한다.

---

## 8. Prefetch — 동시 전달 수 제한

수동 승인 모드에서 Consumer는 **동시에 "in flight" 상태인 메시지 수**를 제한할 수 있다. 이를 통해 Consumer 과부하를 방지한다.

- "In flight" = 네트워크 전송 중이거나 전달되었지만 아직 미승인 상태
- `basic.qos` 설정으로 제어한다.

> 자세한 내용은 별도의 Prefetch 문서를 참조한다.

---

## 9. Consumer Capacity 메트릭

RabbitMQ Management UI 및 Prometheus 스크래핑 엔드포인트에서 **Consumer Capacity** (이전 명칭: Consumer Utilisation) 메트릭을 제공한다.

- 큐가 Consumer에게 **즉시 메시지를 전달할 수 있는 시간 비율**을 나타낸다.
- 100% 미만일 경우 아래를 고려할 수 있다:
  - Consumer(애플리케이션 인스턴스) 수 증가
  - 전달 처리 시간 단축
  - Consumer 채널의 prefetch 값 증가
- Consumer가 없는 큐: **0%**
- Consumer가 있으나 메시지 흐름이 없는 큐: **100%** (어떤 수의 Consumer도 이 전달률을 유지할 수 있음)

> Consumer Capacity는 힌트일 뿐이다. 실제 규모 계획을 위해 애플리케이션 자체의 상세 메트릭을 수집해야 한다.

---

## 10. Consumer 취소 (구독 해제)

Consumer를 취소하려면 해당 **Consumer Tag**가 필요하다.

- 취소 후에는 새로운 메시지가 해당 Consumer에게 전달되지 않는다.
- 단, 취소 이전에 이미 전달된 "in flight" 메시지는 취소되지 않는다 (버리지 않음).

| 클라이언트 | 참조 문서 |
|---|---|
| Java | Java client guide |
| .NET | .NET client guide |

---

## 11. Pull API와의 차이

AMQP 0-9-1에서는 `basic.get`으로 메시지를 **하나씩 가져오는(pull)** 방식도 지원하지만 **비권장**이다.

| 구분 | Push API (Consumer) | Pull API (basic.get) |
|---|---|---|
| 방식 | RabbitMQ가 자동으로 push | 애플리케이션이 직접 poll |
| 효율성 | **높음** | **매우 낮음** |
| 적합한 상황 | 대부분의 경우 | 특수한 경우에만 |
| 권장 여부 | **강력 권장** | **비권장** |

> 메시지 발행이 산발적이고 큐가 비어있는 시간이 긴 시스템에서 Pull 방식은 극도로 비효율적이다. 의심스러울 때는 **항상 장기 실행 Consumer(Push API)** 를 사용하라.

---

## 12. 전달 승인 타임아웃

RabbitMQ는 Consumer가 오랫동안 승인하지 않는 경우(버그, 블로킹 등)를 감지하기 위해 **타임아웃을 강제** 한다.

- **기본값: 30분**
- 타임아웃 초과 시:
  - 채널이 `PRECONDITION_FAILED` 예외와 함께 닫힘
  - 노드에 오류 로그 기록
  - 해당 채널의 모든 미처리 전달 메시지가 **재큐잉(requeue)** 됨

### 설정 (`rabbitmq.conf`)

```ini
# 30분 (밀리초)
consumer_timeout = 1800000

# 1시간 (밀리초)
consumer_timeout = 3600000
```

### 타임아웃 비활성화 (비권장)

```erlang
%% advanced.config
[
  {rabbit, [
    {consumer_timeout, undefined}
  ]}
].
```

> 완전 비활성화보다는 몇 시간과 같이 **높은 값을 설정**하는 것을 권장한다.

---

## 13. 배타적 소비 (Exclusivity)

AMQP 0-9-1 클라이언트에서 Consumer 등록 시 `exclusive` 플래그를 `true`로 설정하면 해당 큐의 **유일한 Consumer**가 될 수 있다.

- 등록 시점에 이미 다른 Consumer가 있으면 실패한다.
- Exclusive Consumer가 취소되거나 죽으면, 소비를 계속하기 위해 **애플리케이션이 새 Consumer를 등록해야** 한다.
- 연속성이 중요한 경우 [Single Active Consumer](#14-단일-활성-consumer-single-active-consumer)가 더 적합할 수 있다.

---

## 14. 단일 활성 Consumer (Single Active Consumer)

큐에서 **한 번에 하나의 Consumer만 활성화**되도록 보장하며, 활성 Consumer가 취소되거나 죽으면 자동으로 다른 Consumer로 페일오버한다.

메시지 도착 순서대로 처리해야 할 때 유용하다.

### 동작 순서

1. 큐를 선언하고 여러 Consumer가 거의 동시에 등록된다.
2. **최초 등록된 Consumer가 단일 활성 Consumer**가 되어 메시지를 받는다. 나머지는 대기 상태.
3. 활성 Consumer가 취소되거나 죽으면 → 다른 등록된 Consumer 중 하나가 **자동으로 새 활성 Consumer**가 된다.

### Java 클라이언트 설정 예제

```java
Channel ch = ...;
Map<String, Object> arguments = new HashMap<String, Object>();
arguments.put("x-single-active-consumer", true);
ch.queueDeclare("my-queue", false, false, false, arguments);
```

### Exclusive Consumer와의 비교

| 구분 | Exclusive Consumer | Single Active Consumer |
|---|---|---|
| 페일오버 | 애플리케이션이 직접 처리 | **자동 처리** |
| 관리 용이성 | 낮음 | **높음** |

### 주의사항

- 활성 Consumer 선택은 **랜덤** (우선순위 적용 시에도 마찬가지)
- `exclusive` 플래그와 함께 사용 불가
- 활성 Consumer가 `basic.qos`로 인해 바쁜 경우, 다른 Consumer는 무시되고 메시지가 큐에 쌓인다.
- **Policy로는 활성화 불가** — 큐 선언 시 `x-single-active-consumer` 인수로만 설정 가능 (Policy는 동적 특성으로 인해 적합하지 않음)

---

## 15. Consumer 활성 상태

Management UI 및 `list_consumers` CLI 커맨드에서 `active` 플래그를 확인할 수 있다.

| 큐 타입 | Single Active Consumer | active 값 |
|---|---|---|
| Classic 큐 | 비활성 | 항상 `true` |
| Quorum 큐 | 비활성 | 기본 `true`, 연결 노드 다운 의심 시 `false` |
| 모든 큐 | 활성 | 현재 활성 Consumer만 `true`, 나머지는 `false` |

---

## 16. Consumer 우선순위

기본적으로 활성 Consumer들은 **라운드로빈(round-robin)** 방식으로 메시지를 받는다.

Consumer 우선순위를 사용하면:
- **높은 우선순위 Consumer**가 활성 상태인 동안 메시지를 먼저 받는다.
- 높은 우선순위 Consumer가 블로킹(예: prefetch 제한)된 경우에만 낮은 우선순위 Consumer가 메시지를 받는다.
- 같은 높은 우선순위의 Consumer가 여러 개 있으면 라운드로빈으로 분배된다.

> 자세한 내용은 별도의 Consumer Priority 문서를 참조한다.

---

## 17. 예외 처리

Consumer는 메시지 처리 중 발생하는 **모든 예외를 직접 처리**해야 한다.

- 예외는 **로그로 기록하고 무시(ignore)** 하는 것이 원칙이다.
- 의존 서비스 불가 등으로 처리 불가 시:
  - 명확히 **로그에 기록**한다.
  - 처리 가능해질 때까지 **스스로 취소(cancel)** 한다.
  - 이를 통해 Consumer의 비가용 상태를 RabbitMQ와 모니터링 시스템에 알린다.

---

## 18. 동시성 고려사항

### 클라이언트 동시성

- 대부분의 클라이언트 라이브러리(Java, .NET, Go, Erlang 등)는 **스레드 풀**을 통해 비동기 Consumer 작업을 처리한다.
- Java, .NET 클라이언트는 **단일 채널 내 전달 순서를 보장**한다. (단, 동시 처리 시 스레드 간 경쟁 조건(race condition) 발생 가능)
- Bunny 등 일부 클라이언트는 경쟁 조건 방지를 위해 **단일 스레드 디스패치 풀**을 사용하기도 한다.
- 순차 처리가 반드시 필요한 애플리케이션은 **동시성 계수를 1**로 설정하거나 직접 동기화를 구현해야 한다.
- 동시 처리가 가능한 경우 **사용 가능한 CPU 코어 수**만큼 동시성을 활용할 수 있다.

### 큐 병렬성

- **단일 RabbitMQ 큐는 단일 코어에 바인딩**된다.
- CPU 활용도를 높이려면 **여러 큐를 사용**해야 한다.
- 병렬성 향상을 위한 플러그인:
  - **Sharding 플러그인**
  - **Consistent Hash Exchange 플러그인**

---

## 요약

| 핵심 개념 | 설명 |
|---|---|
| Push API | RabbitMQ가 Consumer에게 자동으로 메시지를 전달하는 구독 방식 |
| Consumer Tag | Consumer 식별자, 취소 시 사용 |
| 승인 모드 | 자동(fire & forget) 또는 수동(명시적 ack) |
| Prefetch | 수동 모드에서 동시 "in flight" 메시지 수 제한 |
| 승인 타임아웃 | 기본 30분, 초과 시 채널 닫힘 및 메시지 재큐잉 |
| Single Active Consumer | 자동 페일오버를 지원하는 단일 활성 Consumer 패턴 |
| 동시성 | 스레드 풀 기반, 큐 병렬성을 위해 복수 큐 사용 권장 |
