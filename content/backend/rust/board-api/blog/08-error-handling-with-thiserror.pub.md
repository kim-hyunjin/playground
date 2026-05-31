---
title: "[Rust] thiserror로 만드는 앱 에러"
date: 2026-05-31
category: Backend
tags: [Rust, thiserror, Axum, error handling]
summary: "AppError, WebError, IntoResponse, AppResult/WebResult로 JSON·HTML 에러 응답을 만드는 방법을 설명합니다."
---

Rust는 예외(throw) 대신 **`Result<T, E>`**로 실패를 표현합니다. `board-api`는 앱 전역 에러 타입 `AppError`를 `thiserror`로 정의하고, Axum의 `IntoResponse`로 HTTP 응답으로 바꿉니다.

## Rust를 처음 접한다면 — 예외 대신 Result

| Java / Python | Rust (이 프로젝트) |
|---------------|-------------------|
| `throw new NotFoundException()` | `return Err(AppError::NotFound)` |
| `try { ... } catch` | `match` 또는 `?` |
| 호출자가 catch 안 하면 런타임까지 전파 | **`Result`를 반환하지 않으면 컴파일 에러** — 실패 경로를 타입에 적어야 함 |

함수 시그니처에 `-> AppResult<PostResponse>`가 있으면 “성공하면 PostResponse, 실패하면 AppError”라는 뜻입니다. **실패 가능성이 시그니처에 보입니다.**

## AppError 정의

```rust
#[derive(Debug, Error)]
pub enum AppError {
    #[error("resource not found")]
    NotFound,
    #[error("validation error: {0}")]
    Validation(String),
    #[error(transparent)]
    Database(#[from] DbErr),
}
```

| 변형 | HTTP (status_code) | 클라이언트 메시지 |
|------|-------------------|-------------------|
| `NotFound` | 404 | 요청한 게시글을 찾을 수 없습니다 |
| `Validation` | 400 | 검증 메시지 그대로 |
| `Database` | 500 | 서버 오류 (내부 상세 숨김) |

`#[from] DbErr` — `?`로 `DbErr`가 올라오면 자동으로 `AppError::Database`로 변환 (`From` 구현).

## status_code와 client_message

```rust
impl AppError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            AppError::NotFound => StatusCode::NOT_FOUND,
            AppError::Validation(_) => StatusCode::BAD_REQUEST,
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn client_message(&self) -> String {
        match self {
            AppError::NotFound => "요청한 게시글을 찾을 수 없습니다.".to_string(),
            AppError::Validation(message) => message.clone(),
            AppError::Database(_) => "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.".to_string(),
        }
    }
}
```

- REST JSON은 `Display`/`to_string()` (개발자용 영문 메시지)
- HTML은 `client_message()` (한글 사용자 메시지)

## REST — IntoResponse for AppError

```rust
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = self.status_code();
        (status, Json(json!({ "error": self.to_string() }))).into_response()
    }
}
```

핸들러 반환 타입이 `AppResult<Json<...>>`이면 `Err(app_error)`가 자동으로 위 응답이 됩니다.

예:

```json
{ "error": "validation error: title is required" }
```

## WebError — HTML 래퍼

```rust
pub struct WebError(pub AppError);

impl From<AppError> for WebError {
    fn from(value: AppError) -> Self {
        Self(value)
    }
}

impl IntoResponse for WebError {
    fn into_response(self) -> Response {
        let status = self.0.status_code();
        let html = render_error(status.as_u16(), self.0.client_message());
        (status, html).into_response()
    }
}
```

HTML 라우트 핸들러는 `WebResult<T> = Result<T, WebError>`를 씁니다.

## 타입 별칭

```rust
pub type AppResult<T> = Result<T, AppError>;
pub type WebResult<T> = Result<T, WebError>;
```

가독성용 별칭입니다. Java의 `ResponseEntity<Post>` 대신 `Result<Post, AppError>` 패턴입니다.

## 웹에서 Validation만 특별 처리

`create_post` (web):

```rust
match post_service::create_post(&state, form.into_create_request()).await {
    Ok(post) => Ok(Redirect::to(...)),
    Err(AppError::Validation(message)) => Ok(render_form_with_error(..., message, ...)?),
    Err(err) => Err(WebError(err)),
}
```

- **Validation** — 400이지만 에러 페이지 대신 **폼 재표시** (UX)
- **NotFound / Database** — `WebError` → `error.html` 레이아웃

## render_error (`web/response.rs`)

```rust
pub fn render_error(status: u16, message: impl Into<String>) -> Html<String> {
    let body = ErrorTemplate { status, message: message.clone() };
    // LayoutTemplate으로 감싸 전체 페이지 HTML 반환
}
```

## 실습: 에러 종류별 응답

```bash
# 404
curl -s -w "\n%{http_code}\n" http://127.0.0.1:3000/api/posts/99999

# 400 validation
curl -s -X POST http://127.0.0.1:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"","content":"x","author":"y"}'
```

브라우저에서 빈 제목으로 글쓰기 → 폼 위 빨간 알림(validation)을 확인합니다.

## 헷갈리기 쉬운 점

- **JSON `error` vs HTML `client_message`** — REST는 `self.to_string()`(영문·개발자용), HTML은 한글 `client_message()`. 의도적으로 이원화했습니다.
- **`WebError`로 한 번 감싸는 이유** — `IntoResponse` 구현을 REST/HTML에서 다르게 하기 위함입니다. `AppError`에 HTML 로직을 넣지 않아 관심사가 분리됩니다.
- **Validation만 match로 분기** — API는 400 JSON으로 충분하지만, 웹은 **입력값 유지 + 폼 재표시**가 UX상 낫습니다.

## 심화: thiserror vs anyhow, 에러 노출

- **thiserror** — 라이브러리·앱 **공개 API**용 에러 enum에 적합. `Display` 메시지를 enum별로 고정합니다.
- **anyhow** — `main`, CLI, 프로토타입에서 “어떤 에러든 일단 전파”할 때 자주 씁니다. HTTP API 경계에는 보통 도메인 enum이 더 낫습니다.
- **`Database` 변형** — 클라이언트에는 500 + 일반 메시지만. SQL 상세는 `tracing` 로그로만 남기는 것이 안전합니다 (`#[error(transparent)]` + 로깅 레이어).
- **확장** — `Forbidden`, `Conflict(409)` 등을 enum에 추가하고 `status_code` match arm만 늘리면 됩니다.

## 정리

- **thiserror** — `Display` + `From` 보일러플레이트
- **AppError** — 도메인 실패
- **IntoResponse** — HTTP 변환
- **WebError** — HTML 전용

다음 글에서는 **DTO와 Serde**로 JSON·폼을 struct에 매핑합니다.
