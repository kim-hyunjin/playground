# Spring Boot + React SSE 예제

Spring Boot의 `SseEmitter`와 브라우저의 `EventSource`를 사용한 Server-Sent Events 예제입니다.

- 서버 연결 직후 `connected` 이벤트 전송
- 연결된 모든 브라우저에 3초 간격 데모 이벤트 전송
- `POST` 요청으로 임의의 알림을 모든 클라이언트에 브로드캐스트
- 브라우저 연결 종료, 타임아웃, 전송 오류 시 `SseEmitter` 정리
- `EventSource`의 기본 재연결 동작과 연결 상태 표시

## 구조

```text
sse-example/
├─ server/  # Java 17, Spring Boot, Gradle
└─ client/  # React, TypeScript, Vite
```

## 실행

터미널 1에서 서버를 실행합니다.

```bash
cd backend/spring/sse-example/server
./gradlew bootRun
```

Windows PowerShell에서는 `./gradlew.bat bootRun`을 사용합니다.

터미널 2에서 클라이언트를 실행합니다.

```bash
cd backend/spring/sse-example/client
npm install
npm run dev
```

브라우저에서 <http://localhost:5173>을 엽니다. Vite 개발 서버가 `/api` 요청을 `http://localhost:8080`으로 프록시합니다.

## API

### SSE 스트림 구독

```http
GET /api/notifications/stream
Accept: text/event-stream
```

```text
id:1
event:connected
retry:3000
data:{"id":1,"type":"connected","message":"SSE 연결이 완료되었습니다.","sentAt":"..."}
```

### 이벤트 발행

```http
POST /api/notifications
Content-Type: application/json

{"message":"새 주문이 접수되었습니다."}
```

curl로도 확인할 수 있습니다.

```bash
curl -N http://localhost:8080/api/notifications/stream
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"message":"curl에서 보낸 알림"}'
```

### 연결 수 확인

```http
GET /api/notifications/connections
```

## 테스트와 빌드

```bash
cd server
./gradlew test

cd ../client
npm run build
```

자동 이벤트는 `server/src/main/resources/application.yml`의 `sse.demo.enabled`로 끌 수 있습니다.
