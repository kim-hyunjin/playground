---
title: "[Rust] 서비스 레이어 — CRUD와 검증 로직"
date: 2026-05-31
category: Backend
tags: [Rust, SeaORM, service layer, CRUD]
summary: "services/post.rs의 list·create·update·delete와 검증, REST·웹 공용 로직을 설명합니다."
---

`routes/post.rs`와 `routes/web.rs`는 HTTP 형식만 다르고, **비즈니스 로직은 전부 `services/post.rs`**에 있습니다. Spring의 `@Service` 계층, Django의 “views에서 분리한 비즈니스 로직”과 같은 위치입니다.

## Rust를 처음 접한다면 — 서비스 레이어가 있는 이유

**라우트(핸들러)**는 “HTTP에서 문자열/JSON을 꺼내고, HTTP로 돌려준다”에 가깝게 두고,  
**서비스**는 “제목이 비었는지, DB에 넣고, 없으면 NotFound”처럼 **규칙**을 모읍니다.

이렇게 나누면:

- 브라우저 폼과 REST API가 **같은 검증**을 씁니다.
- 나중에 CLI·배치 job이 생겨도 서비스만 호출하면 됩니다.
- 테스트는 HTTP 없이 서비스만 검증할 수도 있습니다 (이 프로젝트는 통합 테스트 위주, 12편).

## list_posts — 최신순 목록

```rust
pub async fn list_posts(state: &AppState) -> AppResult<Vec<post::Model>> {
    PostEntity::find()
        .order_by_desc(post::Column::Id)
        .all(&state.db)
        .await
        .map_err(AppError::from)
}
```

- `find()` — 전체 `posts` (필터 없음)
- `order_by_desc(Column::Id)` — id 내림차순 ≈ 최신 먼저
- `DbErr` → `AppError::Database` (`From` 구현)

## get_post / find_post_by_id

```rust
pub async fn get_post(state: &AppState, id: i32) -> AppResult<post::Model> {
    find_post_by_id(state, id).await
}

async fn find_post_by_id(state: &AppState, id: i32) -> AppResult<post::Model> {
    PostEntity::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or(AppError::NotFound)
}
```

`pub`은 외부 모듈용, `find_post_by_id`는 crate 내부 재사용용 `async fn`입니다.

## create_post — 검증 + insert

```rust
pub async fn create_post(state: &AppState, payload: CreatePostRequest) -> AppResult<post::Model> {
    validate_create(&payload)?;

    let now = Utc::now();
    let active_model = post::ActiveModel {
        title: Set(payload.title.trim().to_owned()),
        content: Set(payload.content.trim().to_owned()),
        author: Set(payload.author.trim().to_owned()),
        created_at: Set(now),
        updated_at: Set(now),
        ..Default::default()
    };

    active_model.insert(&state.db).await.map_err(AppError::from)
}
```

`validate_create`:

```rust
fn validate_create(payload: &CreatePostRequest) -> AppResult<()> {
    if payload.title.trim().is_empty() {
        return Err(AppError::Validation("title is required".to_string()));
    }
    // content, author 동일
    Ok(())
}
```

REST JSON이든 HTML 폼이든 `CreatePostRequest`만 맞으면 **같은 검증**이 적용됩니다.

## update_post — 부분 업데이트

```rust
if payload.title.is_none() && payload.content.is_none() && payload.author.is_none() {
    return Err(AppError::Validation(
        "at least one field must be provided".to_string(),
    ));
}

let existing = find_post_by_id(state, id).await?;
let mut active_model: post::ActiveModel = existing.into();
// Option 필드마다 if let Some → Set
active_model.updated_at = Set(Utc::now());
active_model.update(&state.db).await.map_err(AppError::from)
```

PUT `/api/posts/:id`에 `{"title":"새 제목"}`만내도 content·author는 기존 값 유지됩니다.

## delete_post

```rust
pub async fn delete_post(state: &AppState, id: i32) -> AppResult<post::Model> {
    let post = find_post_by_id(state, id).await?;
    let active_model: post::ActiveModel = post.clone().into();
    active_model.delete(&state.db).await?;
    Ok(post)
}
```

삭제 전 행을 응답으로 돌려줍니다 (API·테스트에서 assert 용이).

## REST vs Web — 같은 서비스

| 호출처 | 서비스 함수 |
|--------|-------------|
| `routes/post.rs` | `list_posts`, `create_post`, … |
| `routes/web.rs` | 동일 |

웹은 `PostForm` → `CreatePostRequest` / `UpdatePostRequest` 변환만 추가합니다 (`dto/web.rs`).

## 실습: curl로 서비스 경로만 검증

```bash
# 생성
curl -s -X POST http://127.0.0.1:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"A","content":"B","author":"C"}' | jq .

# 부분 수정 (서비스 update_post)
curl -s -X PUT http://127.0.0.1:3000/api/posts/1 \
  -H 'Content-Type: application/json' \
  -d '{"title":"A 수정"}' | jq .title
```

## 헷갈리기 쉬운 점

- **`find_post_by_id`는 `pub`이 아님** — crate **내부**에서만 쓰는 헬퍼입니다. 외부 crate(통합 테스트)는 `get_post` 등 public API만 씁니다.
- **HTML 수정은 항상 세 필드 전송** — `PostForm::into_update_request`가 모두 `Some`으로 넣습니다. REST PUT만 “일부 필드만” 보내는 UX입니다.
- **삭제 후 `Ok(post)`** — REST에서 삭제된 리소스 본문을 주는 패턴입니다. 204 No Content로 바꾸려면 핸들러·테스트를 함께 수정해야 합니다.

## 심화: 트랜잭션·동시성 (이 코드에 없는 것)

현재 `create_post` / `update_post`는 **트랜잭션 블록 없이** 한 번의 `insert`/`update`만 호출합니다. 게시판 한 테이블 CRUD에는 충분합니다.

실무에서 댓글 수 갱신 + 글 저장을 **한 단위로** 묶으려면:

```rust
// 개념 예시 (board-api에는 없음)
let txn = state.db.begin().await?;
// ... 여러 쿼리 ...
txn.commit().await?;
```

동시에 같은 글을 수정하는 **낙관적 락**(`version` 컬럼)은 엔티티 확장 후 서비스에서 처리합니다.

## 정리

- **서비스** — DB + 검증, HTTP 무관
- **ActiveModel + Set** — 쓰기
- **Option** — 부분 수정
- **AppResult** — 통일된 에러 타입

다음 글에서는 **thiserror**와 `IntoResponse`로 에러가 JSON/HTML로 바뀌는 과정을 봅니다.
