---
title: "[Rust] async/await와 Tokio — 서버가 시작되는 순간"
date: 2026-05-31
category: Backend
tags: [Rust, Tokio, async, Axum, tracing]
summary: "main.rs에서 #[tokio::main], DB 연결, TcpListener, axum::serve와 tracing 설정을 한 줄씩 읽습니다."
---

`board-api`는 네트워크 I/O(DB, HTTP)를 기다리는 동안 스레드를 막지 않기 위해 **비동기**로 작성됩니다. 진입점은 전부 `src/main.rs`에 있습니다.

## Rust를 처음 접한다면 — 동기 vs 비동기

**동기(블로킹):** DB 쿼리가 끝날 때까지 그 스레드는 아무 것도 못 합니다. 스레드 하나당 동시 요청 하나에 가깝게 처리합니다.

**비동기:** `await`로 “DB 응답 올 때까지 이 작업은 잠깐 멈춤”을 표시하고, **런타임(Tokio)**이 그 사이에 다른 요청을 처리합니다. 코드는 순서대로 읽히지만, I/O 대기 중에는 CPU를 낭비하지 않습니다.

`async fn`이 붙은 함수는 호출만 하면 바로 끝나지 않고 **Future**(나중에 완료될 작업)를 반환합니다. **`.await`를 붙여야** 실제로 기다립니다. `.await`를 빼먹으면 컴파일 에러가 나는 경우가 많습니다.

## main.rs 전체 흐름

```rust
use board_api::{db, routes, state::AppState};
use std::net::SocketAddr;

use axum::Router;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    // tracing 초기화
    // 환경 변수 읽기
    // DB connect + init_schema
    // Router + AppState
    // TcpListener::bind + axum::serve
}
```

## #[tokio::main]

```rust
#[tokio::main]
async fn main() {
```

- `async fn main` — 일반 Rust는 `main`이 동기만 허용하므로, 매크로가 **Tokio 런타임**을 만들고 `main`을 `.await`합니다.
- Node.js의 이벤트 루프나 Python `asyncio.run()` 진입과 같은 역할입니다.

## dotenvy — .env 로드

```rust
dotenvy::dotenv().ok();
```

프로젝트 루트 `.env`의 `DATABASE_URL`, `HOST`, `PORT`를 환경 변수로 올립니다. `.ok()`는 파일이 없어도 무시 (로컬에서 `.env` 없이도 실행 가능).

## tracing — 구조화 로그

```rust
tracing_subscriber::registry()
    .with(
        tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "board_api=debug,tower_http=debug,sqlx=warn".into()),
    )
    .with(tracing_subscriber::fmt::layer())
    .init();
```

| 부분 | 의미 |
|------|------|
| `EnvFilter` | `RUST_LOG`로 레벨 조절 (예: `board_api=debug`) |
| `fmt::layer()` | 콘솔에 로그 출력 |

실행 시 `board-api listening` 로그는 `tracing::info!(%addr, "...")`에서 나옵니다.

## 환경 변수

```rust
let database_url =
    std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite://board.db?mode=rwc".to_string());
let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
let port = std::env::var("PORT")
    .ok()
    .and_then(|value| value.parse().ok())
    .unwrap_or(3000u16);
```

- `unwrap_or_else` — 없으면 기본값
- `parse().ok()` — `PORT`가 숫자가 아니면 `None` → 3000 사용

Docker Compose는 `HOST=0.0.0.0`, `DATABASE_URL=sqlite:///data/board.db?mode=rwc`를 넘깁니다.

## DB 연결과 스키마 (await)

```rust
let db = db::connect(&database_url)
    .await
    .expect("failed to connect to database");
db::init_schema(&db)
    .await
    .expect("failed to initialize database schema");
```

- `.await` — Future가 끝날 때까지 **비동기 대기** (스레드는 다른 작업 가능)
- `expect` — 실패 시 패닉 (서버 기동 단계에서는 치명적이라 흔한 선택)

## Router 조립

```rust
let state = AppState { db };
let app = Router::new()
    .merge(routes::router())
    .layer(CorsLayer::permissive())
    .layer(TraceLayer::new_for_http())
    .with_state(state);
```

- `merge` — 웹·API 라우트 합치기 (05편)
- `CorsLayer` — 브라우저 cross-origin 허용 (개발용 permissive)
- `TraceLayer` — HTTP 요청 로그
- `with_state` — 모든 핸들러에 `AppState` 주입

## TcpListener와 serve

```rust
let addr = SocketAddr::from((
    host.parse::<std::net::IpAddr>().expect("invalid HOST"),
    port,
));
tracing::info!(%addr, "board-api listening");

let listener = tokio::net::TcpListener::bind(addr)
    .await
    .expect("failed to bind address");
axum::serve(listener, app)
    .await
    .expect("server error");
```

1. `bind` — 포트 열기
2. `axum::serve` — 들어오는 연결마다 `app` 라우터로 처리 (무한 루프)

Java Tomcat이 소켓을 받아 서블릿으로 넘기는 것과 같은 단계입니다.

## async fn 핸들러

라우트 핸들러도 `async fn`입니다.

```rust
pub async fn list_posts(State(state): State<AppState>) -> AppResult<Json<Vec<PostResponse>>> {
    let posts = post_service::list_posts(&state).await?;
    // ...
}
```

`main` → `serve` → 핸들러 → `services` → SeaORM `.await`가 한 런타임 안에서 이어집니다.

## 실습: 로그 레벨 바꿔 보기

```bash
cd backend/rust/board-api
RUST_LOG=board_api=info,tower_http=info cargo run
```

다른 터미널에서 `curl http://127.0.0.1:3000/health` — `TraceLayer`가 요청 한 줄을 남기는지 확인합니다.

## 헷갈리기 쉬운 점

- **`expect` vs `?`** — `main` 기동 단계는 “DB 없으면 서버를 띄울 이유가 없다”고 보고 **패닉으로 종료**합니다. 요청 처리 중에는 `?`로 `AppError`에 넘깁니다 (08편).
- **`HOST=127.0.0.1`** — 본인 PC에서만 접속 가능. Docker·원격 접속 시 `0.0.0.0`으로 바인딩해야 합니다.
- **레이어 순서** — `merge(routes)` 후 `layer` → `with_state` 순서가 Axum 0.7에서 중요합니다. state는 라우터에 붙인 뒤 `serve`에 넘깁니다.

## 심화: Tokio 런타임과 운영

- **`#[tokio::main]`** — 기본적으로 **멀티 스레드** 런타임을 씁니다. CPU 코어를 활용해 여러 Future를 돌립니다.
- **`CorsLayer::permissive()`** — 모든 출처를 허용합니다. **프로덕션**에서는 특정 origin만 허용하도록 좁혀야 합니다.
- **`TraceLayer`** — Tower 미들웨어 스택의 일부입니다. 인증·압축·타임아웃도 같은 방식으로 `.layer()`에 추가합니다.
- **graceful shutdown** — 이 `main`은 단순 `serve`만 호출합니다. SIGTERM 시 연결 drain은 `axum::serve` + `with_graceful_shutdown`으로 확장할 수 있습니다.

## 정리

| 요소 | 역할 |
|------|------|
| `#[tokio::main]` | 비동기 런타임 |
| `dotenvy` | `.env` |
| `tracing` | 로그 |
| `.await` | DB·HTTP 대기 |
| `TcpListener` + `serve` | HTTP 서버 |

다음 글에서는 **AppState**와 **Router**가 URL을 어떻게 핸들러에 연결하는지 봅니다.
