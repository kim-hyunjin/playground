---
title: "Spring Boot와 React로 구현하는 SSE 실시간 알림"
date: 2026-08-03
category: "Backend"
categories:
  - "Backend"
  - "Spring"
  - "Real-time Communication"
tags:
  - "sse"
  - "spring-boot"
  - "react"
  - "sse-emitter"
  - "event-source"
summary: "Spring MVC의 SseEmitter와 React의 EventSource를 연결해 실시간 알림을 브로드캐스트하고, 연결 수명주기와 재연결 시 주의점을 살펴봅니다."
draft: false
---

웹 화면에 서버의 상태 변화나 알림을 즉시 반영해야 한다고 해서 항상 WebSocket이 필요한 것은 아니다. 데이터가 주로 서버에서 브라우저로 흐른다면 **Server-Sent Events(SSE)** 가 더 단순한 선택일 수 있다.

이 글에서는 `backend/spring/sse-example`의 코드를 바탕으로 다음 흐름을 구현하고 해설한다.

```text
React EventSource ── GET /api/notifications/stream ──► Spring Boot
                  ◄── connected / notification ────── SseEmitter

React form ─────── POST /api/notifications ─────────► Spring Boot
모든 브라우저      ◄── notification 브로드캐스트 ──── NotificationService
```

예제는 Java 17과 Spring Boot, React와 TypeScript로 구성되어 있다. 서버 연결 직후 확인 이벤트를 보내고, 3초 간격의 데모 이벤트 또는 사용자가 발행한 알림을 연결된 모든 브라우저에 전달한다.

## SSE를 선택한 이유

SSE는 서버가 `text/event-stream` 응답을 닫지 않고 이벤트를 연속해서 기록하는 방식이다. 브라우저는 내장 API인 `EventSource`로 이 스트림을 구독한다.

| 항목 | SSE | WebSocket |
|---|---|---|
| 통신 방향 | 서버 → 클라이언트 중심 | 양방향 |
| 브라우저 API | `EventSource` | `WebSocket` |
| 데이터 형식 | UTF-8 텍스트 이벤트 | 텍스트 또는 바이너리 프레임 |
| 재연결 | 브라우저가 기본 지원 | 애플리케이션에서 구현 |
| 잘 맞는 사례 | 알림, 진행률, 상태 피드 | 채팅, 협업 편집, 게임 |

이 예제에서 브라우저가 서버로 알림을 발행할 때는 일반 `POST` 요청을 사용하고, 서버가 여러 브라우저에 결과를 전파할 때만 SSE를 사용한다. 요청과 실시간 스트림의 역할이 명확히 나뉜다.

## 프로젝트 구조와 전체 흐름

핵심 파일만 추리면 다음과 같다.

```text
sse-example/
├─ server/
│  └─ src/main/java/com/example/sse/
│     ├─ config/WebConfig.java
│     └─ notification/
│        ├─ NotificationController.java
│        ├─ NotificationService.java
│        ├─ NotificationEvent.java
│        ├─ PublishNotificationRequest.java
│        └─ DemoNotificationScheduler.java
└─ client/
   └─ src/
      ├─ useSseNotifications.ts
      └─ App.tsx
```

연결부터 이벤트 표시까지의 순서는 다음과 같다.

1. React가 마운트되면 `EventSource`로 `/api/notifications/stream`에 연결한다.
2. Spring은 클라이언트마다 `SseEmitter`를 만들고 메모리의 맵에 보관한다.
3. 서버는 연결 직후 `connected` 이벤트를 한 번 보낸다.
4. 스케줄러 또는 `POST /api/notifications`가 알림을 발행한다.
5. 서비스가 현재 등록된 모든 `SseEmitter`에 `notification` 이벤트를 보낸다.
6. React 훅이 JSON을 파싱해 최근 이벤트 목록을 갱신한다.
7. 연결 완료, 타임아웃, 오류가 발생하면 서버가 해당 emitter를 제거한다.

## 서버: 스트림 엔드포인트 열기

컨트롤러는 SSE 구독, 알림 발행, 현재 연결 수 조회라는 세 API를 제공한다.

```java
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return notificationService.connect();
    }

    @PostMapping
    public NotificationEvent publish(
            @Valid @RequestBody PublishNotificationRequest request
    ) {
        return notificationService.publish(request.message());
    }

    @GetMapping("/connections")
    public Map<String, Integer> connections() {
        return Map.of("count", notificationService.connectedClientCount());
    }
}
```

핵심은 `GET /stream`의 응답 타입이다. `MediaType.TEXT_EVENT_STREAM_VALUE`는 응답의 `Content-Type`을 `text/event-stream`으로 지정한다. 메서드가 반환한 `SseEmitter`를 통해 Spring MVC는 요청 처리를 비동기로 이어가며, 서비스는 나중에도 같은 응답에 이벤트를 보낼 수 있다.

발행 요청은 별도의 record로 검증한다.

```java
public record PublishNotificationRequest(
        @NotBlank(message = "메시지를 입력해 주세요.")
        @Size(max = 200, message = "메시지는 200자 이하여야 합니다.")
        String message
) {
}
```

빈 문자열과 200자를 넘는 메시지는 컨트롤러에 도달하기 전에 Bean Validation에서 거절된다. UI의 `maxLength={200}`만 믿지 않고 서버에서도 같은 제약을 적용하는 점이 중요하다.

## 서버: SseEmitter 등록과 정리

`NotificationService`는 연결된 emitter와 이벤트 번호를 메모리에서 관리한다.

```java
private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
private final AtomicLong eventSequence = new AtomicLong();
private final long emitterTimeout;
```

여러 요청 스레드가 연결을 추가하거나 이벤트를 발행할 수 있으므로 일반 `HashMap` 대신 `ConcurrentHashMap`을 쓴다. 이벤트 ID 역시 원자적으로 증가하도록 `AtomicLong`을 사용한다.

새 브라우저가 연결되면 `connect()`가 호출된다.

```java
public SseEmitter connect() {
    String clientId = UUID.randomUUID().toString();
    SseEmitter emitter = emitterFactory.apply(emitterTimeout);

    emitters.put(clientId, emitter);
    emitter.onCompletion(() -> emitters.remove(clientId));
    emitter.onTimeout(() -> emitters.remove(clientId));
    emitter.onError(error -> emitters.remove(clientId));

    NotificationEvent connected =
            createEvent("connected", "SSE 연결이 완료되었습니다.");

    try {
        emitter.send(toSseEvent(connected));
    } catch (IOException | IllegalStateException error) {
        emitters.remove(clientId);
        emitter.completeWithError(error);
    }

    return emitter;
}
```

여기에는 두 가지 중요한 설계가 들어 있다.

첫째, 연결 직후 `connected` 이벤트를 보낸다. 클라이언트는 HTTP 연결이 열렸다는 사실뿐 아니라 애플리케이션 레벨의 이벤트 수신까지 확인할 수 있다.

둘째, 완료·타임아웃·오류 콜백에서 emitter를 제거한다. 연결이 사라졌는데 맵에 emitter가 계속 남으면 메모리가 쌓이고, 이후 모든 브로드캐스트가 이미 끊어진 연결에 쓰기를 시도하게 된다. 최초 이벤트 전송이 실패하는 경우도 같은 이유로 즉시 제거한다.

타임아웃은 설정 파일에서 30분으로 지정한다.

```yaml
sse:
  emitter-timeout: 1800000
  demo:
    enabled: true
    interval: 3000
```

이 값은 연결의 영구 유지를 뜻하지 않는다. 30분 후 emitter가 타임아웃되면 브라우저의 `EventSource`가 다시 연결할 수 있다.

## 서버: 이벤트 형식과 브로드캐스트

전달할 JSON 데이터는 작은 record로 정의한다.

```java
public record NotificationEvent(
        long id,
        String type,
        String message,
        Instant sentAt
) {
}
```

이 객체를 SSE 프로토콜 필드로 변환하는 코드는 다음과 같다.

```java
private SseEmitter.SseEventBuilder toSseEvent(NotificationEvent event) {
    return SseEmitter.event()
            .id(Long.toString(event.id()))
            .name(event.type())
            .reconnectTime(3_000)
            .data(event);
}
```

각 설정은 실제 스트림에서 다음처럼 표현된다.

```text
id:1
event:connected
retry:3000
data:{"id":1,"type":"connected","message":"SSE 연결이 완료되었습니다.","sentAt":"2026-08-03T09:00:00Z"}

```

| 필드 | 역할 |
|---|---|
| `id` | 브라우저가 마지막으로 받은 이벤트를 식별한다. |
| `event` | 클라이언트가 구독할 이벤트 이름이다. |
| `retry` | 연결이 끊겼을 때 재연결을 시도할 간격이다. |
| `data` | 브라우저의 `MessageEvent.data`로 전달되는 본문이다. |

빈 줄 하나가 이벤트의 끝을 나타낸다. `.data(event)`에 Java 객체를 넘기면 Spring의 메시지 변환기가 JSON으로 직렬화한다.

발행 시에는 하나의 이벤트를 만든 뒤 현재 연결된 모든 emitter에 보낸다.

```java
public NotificationEvent publish(String message) {
    NotificationEvent event = createEvent("notification", message.trim());
    emitters.forEach((clientId, emitter) -> send(clientId, emitter, event));
    return event;
}

private void send(String clientId, SseEmitter emitter, NotificationEvent event) {
    try {
        emitter.send(toSseEvent(event));
    } catch (IOException | IllegalStateException error) {
        emitters.remove(clientId);
        emitter.complete();
    }
}
```

전송에 실패한 연결을 즉시 제거하므로 다음 브로드캐스트에서는 다시 시도하지 않는다. `ConcurrentHashMap` 덕분에 순회 도중 연결을 제거하는 작업도 안전하다.

## 3초마다 데모 이벤트 보내기

예제가 실행 중이라는 사실을 바로 확인할 수 있도록 스케줄러가 서버 시간을 담은 이벤트를 발행한다.

```java
@Component
@ConditionalOnProperty(
        name = "sse.demo.enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class DemoNotificationScheduler {

    @Scheduled(fixedRateString = "${sse.demo.interval:3000}")
    public void publishServerTime() {
        if (notificationService.connectedClientCount() == 0) {
            return;
        }

        String currentTime = LocalTime.now().format(TIME_FORMAT);
        notificationService.publish("서버가 보낸 자동 이벤트 · " + currentTime);
    }
}
```

연결된 클라이언트가 하나도 없으면 이벤트를 만들지 않는다. 테스트나 실제 기능 개발 중 자동 이벤트가 방해된다면 다음처럼 끌 수 있다.

```yaml
sse:
  demo:
    enabled: false
```

스케줄링 자체는 애플리케이션 클래스의 `@EnableScheduling`로 활성화한다.

## 클라이언트: EventSource를 React 훅으로 감싸기

브라우저 쪽 핵심은 `useSseNotifications` 훅이다.

```typescript
export type ConnectionStatus = 'connecting' | 'open' | 'closed'

export interface NotificationEvent {
  id: number
  type: 'connected' | 'notification'
  message: string
  sentAt: string
}

const MAX_EVENTS = 50
```

서버의 record와 같은 필드를 TypeScript 인터페이스로 표현하고, 화면에는 최근 50개만 남긴다. 장시간 실행되는 화면에서 이벤트 배열이 무한히 커지는 일을 막는다.

```typescript
export function useSseNotifications() {
  const eventSourceRef = useRef<EventSource | null>(null)
  const [events, setEvents] = useState<NotificationEvent[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('closed')

  const disconnect = useCallback(() => {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
    setStatus('closed')
  }, [])

  const connect = useCallback(() => {
    eventSourceRef.current?.close()
    setStatus('connecting')

    const eventSource = new EventSource('/api/notifications/stream')
    eventSourceRef.current = eventSource

    const receive = (event: MessageEvent<string>) => {
      const notification = JSON.parse(event.data) as NotificationEvent
      setEvents((current) =>
        [notification, ...current].slice(0, MAX_EVENTS),
      )
    }

    eventSource.addEventListener('connected', receive)
    eventSource.addEventListener('notification', receive)
    eventSource.onopen = () => setStatus('open')
    eventSource.onerror = () => setStatus('connecting')
  }, [])

  useEffect(() => {
    connect()
    return () => eventSourceRef.current?.close()
  }, [connect])

  return { events, status, connect, disconnect, clearEvents }
}
```

`EventSource`는 이름 있는 SSE 이벤트를 `addEventListener()`로 구독한다. 서버가 `.name("connected")`로 보낸 이벤트는 `connected` 리스너에, `.name("notification")`으로 보낸 이벤트는 `notification` 리스너에 도착한다. 이름 없는 기본 이벤트를 받을 때 사용하는 `onmessage`와 구분해야 한다.

`onerror`에서 객체를 닫거나 새 `EventSource`를 만들지 않는 것도 포인트다. 예기치 않게 연결이 끊기면 브라우저가 서버가 보낸 `retry:3000` 값을 바탕으로 재연결한다. 반대로 사용자가 명시적으로 연결을 끊을 때는 `close()`를 호출해야 자동 재연결이 멈춘다.

컴포넌트가 언마운트될 때도 `close()`를 호출한다. 개발 모드의 React `StrictMode`처럼 effect가 다시 실행되더라도 기존 연결을 먼저 닫기 때문에 불필요한 중복 스트림을 줄일 수 있다.

## 클라이언트: POST로 이벤트 발행하기

SSE 스트림은 서버에서 브라우저로만 흐른다. 사용자가 입력한 메시지를 서버로 보낼 때는 일반 HTTP 요청을 사용한다.

```typescript
async function publish(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const trimmedMessage = message.trim()
  if (!trimmedMessage) return

  setIsPublishing(true)
  setPublishError('')

  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmedMessage }),
    })

    if (!response.ok) {
      throw new Error(`알림 발행에 실패했습니다. (${response.status})`)
    }

    setMessage('')
  } catch (error) {
    setPublishError(
      error instanceof Error ? error.message : '알림 발행에 실패했습니다.',
    )
  } finally {
    setIsPublishing(false)
  }
}
```

`POST`의 응답을 받아 UI에 직접 추가하지 않는다는 점에 주목하자. 서버가 같은 알림을 SSE로 브로드캐스트하므로, 발행한 브라우저도 다른 브라우저와 같은 경로로 이벤트를 받는다. 이렇게 하면 한 이벤트가 응답과 스트림을 통해 화면에 두 번 추가되는 문제를 피할 수 있다.

## 개발 환경의 프록시와 CORS

Vite 개발 서버는 `/api` 요청을 Spring 서버로 프록시한다.

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

따라서 React 코드는 서버 주소를 하드코딩하지 않고 `/api/notifications/stream`처럼 동일 출처 경로를 사용한다. 서버에도 `http://localhost:5173`을 허용하는 CORS 설정이 있어 프록시를 거치지 않고 직접 호출하는 개발 시나리오를 지원한다.

운영 환경에서는 프론트엔드와 API를 같은 출처로 제공하거나, 실제 허용 출처만 CORS에 등록해야 한다. 개발용 `localhost` 설정을 그대로 운영 설정으로 사용해서는 안 된다.

## 실행하고 직접 확인하기

첫 번째 터미널에서 Spring 서버를 실행한다.

```powershell
cd backend/spring/sse-example/server
./gradlew.bat bootRun
```

macOS나 Linux에서는 다음 명령을 사용한다.

```bash
cd backend/spring/sse-example/server
./gradlew bootRun
```

두 번째 터미널에서 React 클라이언트를 실행한다.

```bash
cd backend/spring/sse-example/client
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 연결 상태와 수신 이벤트를 확인할 수 있다. 브라우저 없이 스트림만 보려면 `curl`의 버퍼링을 끄는 `-N` 옵션을 사용한다.

```bash
curl -N http://localhost:8080/api/notifications/stream
```

다른 터미널에서 이벤트를 발행하면 열어 둔 스트림에 바로 나타난다.

```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"message":"curl에서 보낸 알림"}'
```

현재 서버가 기억하는 연결 수도 조회할 수 있다.

```bash
curl http://localhost:8080/api/notifications/connections
```

## 테스트가 확인하는 범위

서비스 테스트는 실제 네트워크 대신 이벤트 전송 횟수를 세는 `SseEmitter`를 주입한다. 연결 직후 이벤트 한 번과 알림 발행 한 번, 총 두 번 전송되는지를 확인한다.

```java
SseEmitter emitter = service.connect();
NotificationEvent event = service.publish("테스트 알림");

assertThat(emitter.getTimeout()).isEqualTo(1_000L);
assertThat(service.connectedClientCount()).isEqualTo(1);
assertThat(sentEventCount).hasValue(2);
assertThat(event.type()).isEqualTo("notification");
```

컨트롤러 테스트는 다음 계약을 검증한다.

- 정상 메시지를 발행하면 `200 OK`와 알림 JSON을 반환한다.
- 공백뿐인 메시지는 `400 Bad Request`로 거절한다.
- 연결 수 API는 서비스가 반환한 수를 `{ "count": 3 }` 형태로 노출한다.

테스트와 프론트엔드 빌드는 각각 다음처럼 실행한다.

```powershell
cd backend/spring/sse-example/server
./gradlew.bat test

cd ../client
npm run build
```

## 현재 예제를 운영 환경으로 확장할 때

이 구현은 SSE의 핵심을 보여 주는 단일 서버 예제다. 실제 서비스에서는 다음 항목을 추가로 설계해야 한다.

### 이벤트 재전송

서버는 모든 이벤트에 `id`를 넣지만 지난 이벤트를 저장하지는 않는다. 브라우저가 재연결할 때 `Last-Event-ID`를 보내더라도 현재 구현은 누락된 이벤트를 복구할 수 없다. 유실 없이 이어 받아야 한다면 이벤트를 데이터베이스나 스트림에 저장하고, 재연결 요청의 마지막 ID 이후 데이터를 재생해야 한다.

### 다중 인스턴스 브로드캐스트

`emitters`는 JVM 메모리에만 있다. 서버가 여러 대라면 한 인스턴스에 들어온 `POST`는 다른 인스턴스에 연결된 브라우저를 알 수 없다. Redis Pub/Sub, Kafka 같은 공용 메시지 계층을 두고 각 인스턴스가 수신한 이벤트를 자신의 emitter들에게 전달하는 구조가 필요하다.

### 프록시 버퍼링과 타임아웃

리버스 프록시나 로드 밸런서가 응답을 버퍼링하면 이벤트가 즉시 도착하지 않을 수 있다. 스트리밍 응답의 버퍼링을 끄고, 유휴 연결 제한을 확인해야 한다. 이벤트가 드문 서비스라면 주기적인 heartbeat 주석 이벤트를 보내 중간 장비가 연결을 유휴 상태로 판단하지 않게 하는 방법도 고려할 수 있다.

### 인증

네이티브 `EventSource` 생성자는 임의의 요청 헤더를 설정하는 인터페이스를 제공하지 않는다. 동일 출처의 세션 쿠키를 사용하거나, 짧은 수명의 구독 토큰과 별도 정책을 설계해야 한다. URL 쿼리에 장기 토큰을 그대로 노출하면 로그와 브라우저 기록에 남을 수 있으므로 피해야 한다.

### 클라이언트 파싱 오류

예제의 `JSON.parse()`는 서버가 항상 올바른 JSON을 보낸다는 전제다. 이벤트 스키마가 바뀌거나 잘못된 데이터가 들어올 가능성이 있다면 `try/catch`와 런타임 스키마 검증을 추가하고, 파싱 실패가 전체 UI에 영향을 주지 않도록 관측 가능한 오류로 남겨야 한다.

## 마무리

이 예제의 핵심은 단순하다. Spring MVC는 클라이언트마다 `SseEmitter`를 보관하고, `NotificationService`는 하나의 이벤트를 모든 emitter에 전송한다. React는 `EventSource` 한 개의 수명주기를 훅으로 관리하고, 이름 있는 이벤트를 받아 화면 상태로 변환한다.

단방향 실시간 알림이라면 이 구조만으로도 WebSocket보다 적은 코드로 연결, 브로드캐스트, 자동 재연결을 경험할 수 있다. 이후 요구사항이 이벤트 복구, 서버 수평 확장, 인증으로 넓어질 때 저장소와 메시지 계층을 단계적으로 추가하면 된다.
