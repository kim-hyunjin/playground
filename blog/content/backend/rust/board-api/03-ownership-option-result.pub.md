---
title: "[Rust] 소유권, Option, Result — ? 연산자까지"
date: 2026-05-31
category: Backend
tags: [Rust, Option, Result, ownership, error handling]
summary: "services/post.rs와 routes에서 String, Option, Result, ?와 match가 어떻게 쓰이는지 익힙니다."
---

Rust를 처음 읽을 때 가장 막히는 부분이 **소유권**과 **`Option` / `Result`** 입니다. 이 글은 이론 전체가 아니라 `board-api`에 **실제로 나오는 패턴**만 짚습니다. 다른 언어와의 대응을 먼저 적어 두면 읽기가 수월합니다.

## Rust를 처음 접한다면 — 다른 언어와 대응

| Rust | Java / Kotlin | Python | 의미 |
|------|---------------|--------|------|
| `Option<T>` | `Optional<T>` | `T \| None` | 값이 없을 수 있음 |
| `Result<T, E>` | 예외 대신 명시적 반환 | try/except 대신 `Ok`/`Err` | 실패가 타입에 포함 |
| `?` | (없음, throws에 가깝지 않음) | 없음 | `Err`면 현재 함수에서 즉시 return |
| `&T` | 참조(대략) | 객체 참조 | 소유하지 않고 빌림 |
| `String` | `String` | `str` (불변) | 소유 문자열 |

**소유권 한 줄:** Rust는 “이 값의 주인이 누구인지”를 컴파일러가 추적합니다. 주인이 사라지면 빌린 참조(`&`)도 쓸 수 없습니다. 그래서 동시에 같은 메모리를 둘이 고치는 버그가 줄어듭니다.

## String vs &str

```rust
title: Set(payload.title.trim().to_owned()),
```

- `payload.title` — `String` (힙에 있는 소유 문자열)
- `.trim()` — 앞뒤 공백 제거, 결과는 `&str` (빌린 조각)
- `.to_owned()` — 새 `String` 생성 (소유권 이전)

Java에서는 `trim()`이 같은 `String` 객체를 돌려주지만, Rust는 **빌린 뷰(`&str`)** 와 **소유 문자열(`String`)** 을 구분합니다. DB에 넣을 때는 보통 `String`이 필요해 `to_owned()`를 씁니다.

## Option — 값이 있을 수도, 없을 수도

```rust
PostEntity::find_by_id(id)
    .one(&state.db)
    .await?
    .ok_or(AppError::NotFound)
```

- `.one()` — `Result<Option<Model>, DbErr>`: DB 오류 또는 0/1행
- `?` — `Err`면 함수에서 바로 return
- `.ok_or(AppError::NotFound)` — `None`이면 `Err(NotFound)`, `Some(m)`이면 `Ok(m)`

Python의 `row = session.get(...); if row is None: raise NotFound`를 한 줄로 표현한 것입니다.

**부분 수정**에서는 `Option` 필드로 “보낸 필드만 갱신”합니다 (`UpdatePostRequest`):

```rust
if let Some(title) = payload.title {
    let trimmed = title.trim();
    if trimmed.is_empty() {
        return Err(AppError::Validation("title cannot be empty".to_string()));
    }
    active_model.title = Set(trimmed.to_owned());
}
```

- `if let Some(x) = ...` — `Some`일 때만 블록 실행 (`None`이면 스킵)

## Result와 ? — 실패를 타입으로

```rust
pub type AppResult<T> = Result<T, AppError>;

pub async fn list_posts(state: &AppState) -> AppResult<Vec<post::Model>> {
    PostEntity::find()
        .order_by_desc(post::Column::Id)
        .all(&state.db)
        .await
        .map_err(AppError::from)
}
```

- `Result<T, E>` — 성공 `Ok(T)` / 실패 `Err(E)`
- `?` — `Err`면 현재 함수에서 즉시 반환 (Java의 `throws` + 자동 전파와 비슷한 ergonomics)

핸들러:

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

`?` 뒤에는 `Vec<Model>`만 남고, 마지막에 `Ok(Json(...))`로 성공을 감쌉니다.

## .clone() — 소유권 복제

```rust
let post = find_post_by_id(state, id).await?;
let active_model: post::ActiveModel = post.clone().into();
active_model.delete(&state.db).await?;
Ok(post)
```

삭제 후에도 응답 본문에 삭제된 글 정보를 담기 위해 `post`를 한 번 더 씁니다. `delete`가 `post`를 소비할 수 있어 `.clone()`으로 복사본을 만듭니다. (비용은 게시글 한 건 크기라 CRUD 예제에서는 허용 가능합니다.)

## match — 웹에서 검증 에러 분기

`routes/web.rs`:

```rust
match post_service::create_post(&state, form.into_create_request()).await {
    Ok(post) => Ok(Redirect::to(&format!("/posts/{}", post.id)).into_response()),
    Err(AppError::Validation(message)) => Ok(render_form_with_error(/* ... */, message, ...)?),
    Err(err) => Err(WebError(err)),
}
```

- **Validation** — 폼을 다시 보여 줌 (400 HTML)
- **그 외** — `WebError`로 HTML 에러 페이지

REST API는 `AppResult`가 `AppError: IntoResponse`로 JSON 에러를 반환합니다 (08편).

## &AppState — 빌리기

서비스 함수는 DB를 소유하지 않고 **참조**만 받습니다.

```rust
pub async fn get_post(state: &AppState, id: i32) -> AppResult<post::Model>
```

`&`는 호출하는 쪽이 `AppState`의 소유자로 남고, 여러 요청이 같은 연결 풀을 공유합니다.

## 실습: 의도적 검증 실패

서버 실행 후:

```bash
curl -X POST http://127.0.0.1:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"","content":"x","author":"dev"}'
```

`validate_create`에서 `title is required` → `400` JSON `error` 필드를 확인합니다. `Result` + `AppError::Validation` 경로를 직접 본 것입니다.

## 헷갈리기 쉬운 점

- **`?`는 `Result`와 `Option` 둘 다**에 쓸 수 있습니다. `find().one().await?`는 DB 에러, `.ok_or(NotFound)?`는 “행 없음”을 `Err`로 바꿉니다.
- **`return Err(...)` vs `?`** — 검증 함수 안에서는 `return Err`가 명시적이고, 연쇄 호출에서는 `?`가 짧습니다.
- **`.clone()`이 많아 보여도** — 이 예제는 요청당 게시글 한 건 수준이라 괜찮습니다. 목록 수천 건을 매번 `clone`하면 비용이 커집니다 (심화).

## 심화: 소유권과 API 설계

- **`create_post(..., payload: CreatePostRequest)`** — payload의 **소유권을 서비스로 이동**합니다. 호출 후 라우트에서 `payload`를 다시 쓸 수 없습니다. 다시 쓸 필요가 없으니 안전합니다.
- **`&AppState`** — 연결 풀은 앱 전체가 공유해야 하므로 빌리기만 합니다. `State` extractor도 내부적으로 `Clone`된 `AppState`를 넘깁니다 (05편).
- **대안:** `Arc<AppState>`를 명시적으로 쓰는 프로젝트도 많습니다. Axum 0.7 + `Clone` on state로 이 예제는 충분합니다.
- **부분 수정의 `Option<String>`** — JSON에서 필드를 **아예 안내면** `None`, `"title": null`도 보통 `None`입니다. Serde 기본 동작 (09편).

## 정리

| 문법 | board-api 예 |
|------|----------------|
| `String` / `&str` | trim + `to_owned()` |
| `Option` | `UpdatePostRequest`, `find().one()` |
| `Result` / `?` | 서비스·핸들러 전반 |
| `match` | 웹 폼 검증 실패 |
| `&T` | `&AppState` |

다음 글에서는 `main.rs`의 **`async`/`await`와 Tokio**로 서버가 어떻게 시작되는지 봅니다.
