---
title: "[Rust] REST API 핸들러 한 줄씩 읽기"
date: 2026-05-31
category: Backend
tags: [Rust, Axum, REST API, JSON]
summary: "routes/post.rs의 list·get·create·update·delete 핸들러와 extractor, curl 예시를 정리합니다."
---

`/api/posts` CRUD는 `src/routes/post.rs` 한 파일에 모여 있습니다. 각 핸들러는 **얇게** 유지하고, 로직은 `services::post`에 위임합니다.

## 파일 전체 구조

```rust
use axum::{
    extract::{Path, State},
    Json,
};

use crate::{
    dto::post::{CreatePostRequest, PostResponse, UpdatePostRequest},
    error::AppResult,
    services::post as post_service,
    state::AppState,
};
```

## list_posts — GET /api/posts

```rust
pub async fn list_posts(
    State(state): State<AppState>,
) -> AppResult<Json<Vec<PostResponse>>> {
    let posts = post_service::list_posts(&state)
        .await?
        .into_iter()
        .map(PostResponse::from)
        .collect();

    Ok(Json(posts))
}
```

- `into_iter()` — `Vec<Model>` 소비
- `.map(PostResponse::from)` — DTO 변환
- `.collect()` — `Vec<PostResponse>`
- 성공 시 기본 **200 OK** + JSON 배열

## get_post — GET /api/posts/:id

```rust
pub async fn get_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> AppResult<Json<PostResponse>> {
    let post = post_service::get_post(&state, id).await?;
    Ok(Json(PostResponse::from(post)))
}
```

없는 id → `AppError::NotFound` → 404 JSON.

## create_post — POST /api/posts

```rust
pub async fn create_post(
    State(state): State<AppState>,
    Json(payload): Json<CreatePostRequest>,
) -> AppResult<Json<PostResponse>> {
    let created = post_service::create_post(&state, payload).await?;
    Ok(Json(PostResponse::from(created)))
}
```

## update_post — PUT /api/posts/:id

```rust
pub async fn update_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdatePostRequest>,
) -> AppResult<Json<PostResponse>> {
    let updated = post_service::update_post(&state, id, payload).await?;
    Ok(Json(PostResponse::from(updated)))
}
```

## delete_post — DELETE /api/posts/:id

```rust
pub async fn delete_post(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> AppResult<Json<PostResponse>> {
    let post = post_service::delete_post(&state, id).await?;
    Ok(Json(PostResponse::from(post)))
}
```

삭제된 리소스 본문을 JSON으로 돌려줍니다 (일부 API는 204 No Content를 쓰기도 함).

## 라우트 등록 (routes/mod.rs)

```rust
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
```

## curl 실습 — CRUD 한 바퀴

```bash
BASE=http://127.0.0.1:3000

curl -s -X POST "$BASE/api/posts" \
  -H 'Content-Type: application/json' \
  -d '{"title":"REST","content":"본문","author":"curl"}' | tee /tmp/post.json

ID=$(jq -r .id /tmp/post.json)

curl -s "$BASE/api/posts"
curl -s "$BASE/api/posts/$ID"
curl -s -X PUT "$BASE/api/posts/$ID" \
  -H 'Content-Type: application/json' \
  -d '{"title":"REST 수정"}'
curl -s -X DELETE "$BASE/api/posts/$ID"
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/api/posts/$ID"
# 404
```

`tests/api.rs`의 `crud_flow`와 같은 순서입니다.

## HTTP ↔ 코드 매핑표

| HTTP | 핸들러 | 서비스 |
|------|--------|--------|
| GET /api/posts | `list_posts` | `list_posts` |
| GET /api/posts/:id | `get_post` | `get_post` |
| POST /api/posts | `create_post` | `create_post` |
| PUT /api/posts/:id | `update_post` | `update_post` |
| DELETE /api/posts/:id | `delete_post` | `delete_post` |

## 정리

- 핸들러 = **extractor + 서비스 호출 + Json 응답**
- **`?`** — 에러를 `IntoResponse`로
- **PostResponse** — API 계약

다음 글에서는 **Askama**로 HTML 게시판 UI를 만드는 `routes/web.rs`와 템플릿을 봅니다.
