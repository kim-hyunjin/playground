---
title: "[Rust] AppState와 라우터 — 요청을 어디로 보낼까"
date: 2026-05-31
category: Backend
tags: [Rust, Axum, Router, AppState]
summary: "AppState, routes/mod.rs의 merge·route·with_state, health 핸들러와 Axum extractor 시그니처를 설명합니다."
---

서버가 뜬 뒤 클라이언트 요청은 **라우터**가 URL·HTTP 메서드에 맞는 **핸들러 함수**로 보냅니다. 공통 의존성(DB)은 **AppState**에 넣어 모든 핸들러가 공유합니다.

## AppState

```rust
#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
}
```

- `DatabaseConnection` — SeaORM/SQLx 연결 (내부적으로 연결 풀)
- `Clone` — Axum이 요청 처리 시 State를 복제해 핸들러에 넘김 (연결 자체는 Arc 등으로 공유)

Spring의 `@Autowired DataSource`를 요청 스코프가 아닌 **앱 전역**에 두는 것과 비슷합니다.

## routes/mod.rs — 라우터 조립

```rust
pub fn router() -> Router<AppState> {
    Router::new()
        .merge(web::router())
        .route("/health", get(health))
        .route(
            "/api/posts",
            get(post::list_posts).post(post::create_post),
        )
        .route(
            "/api/posts/:id",
            get(post::get_post)
                .put(post::update_post)
                .delete(post::delete_post),
        )
}

async fn health() -> &'static str {
    "ok"
}
```

| API | 의미 |
|-----|------|
| `Router::new()` | 빈 라우터 |
| `.merge(web::router())` | `/`, `/posts/...` HTML 라우트 합침 |
| `.route(path, method_router)` | 경로 + GET/POST 등 |
| `:id` | 경로 파라미터 → `Path<i32>` |

`main.rs`에서:

```rust
Router::new()
    .merge(routes::router())
    .with_state(state);
```

`with_state`가 없으면 `State<AppState>` extractor를 쓰는 핸들러가 컴파일되지 않습니다.

## web::router() — HTML 경로

```rust
pub fn router() -> axum::Router<AppState> {
    axum::Router::new()
        .route("/", get(list_page))
        .route("/posts/new", get(new_post_form))
        .route("/posts", post(create_post))
        .route("/posts/:id", get(show_post))
        .route("/posts/:id/edit", get(edit_post_form).post(update_post))
        .route("/posts/:id/delete", post(delete_post))
}
```

REST는 `/api/posts`, 브라우저 UI는 `/posts` — **같은 서비스**, 다른 URL 네임스페이스입니다.

## Axum 핸들러 시그니처 (REST 예)

```rust
pub async fn get_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> AppResult<Json<PostResponse>> {
    let post = post_service::get_post(&state, id).await?;
    Ok(Json(PostResponse::from(post)))
}
```

| Extractor | 역할 |
|-----------|------|
| `State(state)` | `with_state`로 넣은 `AppState` |
| `Path(id)` | URL `:id` → `i32` |
| `Json(payload)` | 본문 JSON → struct (create/update) |

잘못된 JSON이면 Axum이 422를 반환합니다 (앱 코드 전).

## health — 가장 단순한 핸들러

```rust
async fn health() -> &'static str {
    "ok"
}
```

State도 DB도 없습니다. 로드밸런서·Docker healthcheck용입니다.

## 요청 매칭 순서

Axum은 등록된 라우트 중 **가장 잘 맞는** 것을 고릅니다. `/api/posts`와 `/api/posts/:id`는 메서드·경로 세그먼트로 구분됩니다.

## 실습: 라우트별 응답 확인

```bash
curl -s http://127.0.0.1:3000/health
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/api/posts/999
# 404 (NotFound)
curl -s http://127.0.0.1:3000/ | head -5
# HTML (Board)
```

## 정리

- **AppState** — DB 연결 공유
- **Router::merge / route** — URL ↔ 핸들러
- **with_state** — State extractor 연결
- **extractor** — `State`, `Path`, `Json`, `Form`

다음 글에서는 **SeaORM 엔티티**와 `db.rs`의 연결·스키마 초기화를 봅니다.
