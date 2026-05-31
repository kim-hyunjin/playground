---
title: "[Rust] 통합 테스트 — 메모리 DB로 CRUD 검증"
date: 2026-05-31
category: Backend
tags: [Rust, integration test, Tokio, tower]
summary: "tests/api.rs와 tests/web.rs의 test_app, oneshot, JSON·HTML assert를 설명합니다."
---

`board-api`는 단위 테스트보다 **HTTP까지 포함한 통합 테스트**가 핵심입니다. 실제 TCP 포트를 열지 않고, **메모리 SQLite** + **Router::oneshot**으로 핸들러·서비스·DB를 한 번에 검증합니다.

## Rust를 처음 접한다면 — 테스트 종류

| 종류 | 이 프로젝트 예 | 검증 범위 |
|------|----------------|-----------|
| **단위 테스트** | `fn validate_...` (없음) | 함수 하나 |
| **통합 테스트** | `tests/api.rs`, `tests/web.rs` | 라우터 + 서비스 + DB |
| **E2E** | (없음) | 실제 브라우저·포트 |

`#[cfg(test)]` 모듈은 같은 파일 안에 둘 수 있고, `tests/*.rs`는 **별도 crate**로 `board_api`를 import합니다 (01편 lib/bin 구조와 연결).

## 왜 lib.rs + tests/ 인가

- `main.rs` — 서버만 실행
- `lib.rs` — `routes`, `db`, `state` export
- `tests/*.rs` — **외부 integration test crate**가 `board_api`를 dependency로 사용

JUnit에서 `@SpringBootTest`로 전체 컨텍스트를 띄우는 것과 비슷하지만, 여기서는 Axum `Router`만 조립합니다.

## 공통 test_app()

`tests/api.rs` / `tests/web.rs` 동일 패턴:

```rust
async fn test_app() -> Router {
    let db: DatabaseConnection = db::connect("sqlite::memory:")
        .await
        .expect("in-memory database");
    db::init_schema(&db)
        .await
        .expect("schema initialization");

    Router::new()
        .merge(routes::router())
        .with_state(AppState { db })
}
```

| 선택 | 이유 |
|------|------|
| `sqlite::memory:` | 테스트마다 깨끗한 DB, 파일 잔여 없음 |
| `init_schema` | `posts` 테이블 보장 |
| `merge(routes::router())` | 프로덕션과 동일 라우트 |

## tower::ServiceExt::oneshot

```rust
let create = app
    .clone()
    .oneshot(
        Request::builder()
            .method("POST")
            .uri("/api/posts")
            .header("content-type", "application/json")
            .body(Body::from(json!({ ... }).to_string()))
            .unwrap(),
    )
    .await
    .unwrap();

assert_eq!(create.status(), StatusCode::OK);
```

- `app.clone()` — `Router`는 clone 가능 (내부 Arc)
- `oneshot` — 요청 하나 보내고 응답 수신 (소켓 없음)
- `http_body_util::BodyExt::collect` — body 바이트 수집

## tests/api.rs — REST crud_flow

순서:

1. POST 생성 → `id` 추출
2. GET 목록 → 길이 1
3. PUT 수정 → title 변경 확인
4. DELETE
5. GET 단건 → **404**

```rust
let missing = app.oneshot(
    Request::builder()
        .uri(format!("/api/posts/{id}"))
        .body(Body::empty())
        .unwrap(),
).await.unwrap();
assert_eq!(missing.status(), StatusCode::NOT_FOUND);
```

`AppError::NotFound` → `IntoResponse` 경로가 테스트로 고정됩니다.

## tests/web.rs — html_board_flow

1. GET `/` — 빈 목록 문구 `"아직 게시글이 없습니다"`
2. POST `/posts` — `application/x-www-form-urlencoded`
3. **303** + `Location: /posts/{id}`
4. GET 상세 — 제목·본문 HTML 포함
5. GET `/` — 목록에 제목 표시, 빈 문구 없음

```rust
.body(Body::from(
    "title=Hello&author=rustacean&content=First+post+body",
))
```

폼 필드 이름은 `PostForm` struct 필드와 일치해야 합니다.

## #[tokio::test]

```rust
#[tokio::test]
async fn crud_flow() {
```

비동기 테스트 함수를 Tokio 런타임에서 실행합니다. `main`의 `#[tokio::main]`과 같은 런타임이 필요해 `.await`가 동작합니다.

## dev-dependencies

```toml
[dev-dependencies]
http-body-util = "0.1"
tower = { version = "0.5", features = ["util"] }
```

본문 읽기·`oneshot`용입니다.

## 실습: 테스트 실행

```bash
cd content/backend/rust/board-api
cargo test

# 한 파일만
cargo test --test api
cargo test --test web
```

모두 통과하면 REST·HTML 경로가 계획대로 연결된 상태입니다.

## 헷갈리기 쉬운 점

- **포트를 열지 않음** — `cargo test`가 3000번을 쓰지 않습니다. `oneshot`이 메모리 안에서 HTTP만 흉내 냅니다.
- **테스트 병렬 실행** — 기본적으로 여러 테스트가 동시에 돌 수 있습니다. 각 테스트가 **자기 `sqlite::memory:` DB**를 쓰므로 충돌하지 않습니다.
- **`unwrap()` in tests** — 테스트 코드에서는 “실패하면 즉시 패닉”이 읽기 쉬워서 허용되는 편입니다. 프로덕션 `main`의 `expect`와 비슷한 성격입니다.

## 심화: 더 견고한 테스트로 가기

- **`assert_json_include!` 대신 필드별 assert** — 현재는 `created["title"]` 등 핵심만 검사합니다. 스냅샷 테스트(`insta`)는 응답 전체 회귀에 유리합니다.
- **웹 테스트** — HTML 전체 대신 `contains("Hello")`만 검사합니다. 깨지기 쉬운 UI 문구보다 **비즈니스 결과**(제목 노출)에 집중한 선택입니다.
- **테스트 전용 App** — `test_app()`을 lib의 `#[cfg(test)]` helper로 빼면 중복을 줄일 수 있습니다.

## 정리

| 도구 | 역할 |
|------|------|
| `sqlite::memory:` | 격리 DB |
| `test_app()` | 프로덕션 라우터 |
| `oneshot` | HTTP 시뮬레이션 |
| `serde_json` / 문자열 assert | 응답 검증 |

다음 글(마지막)에서는 **전체 아키텍처**를 한 장의 지도로 복습합니다.
