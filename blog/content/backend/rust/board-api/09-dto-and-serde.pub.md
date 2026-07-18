---
title: "[Rust] DTO와 Serde — JSON/폼 데이터 변환"
date: 2026-05-31
category: Backend
tags: [Rust, Serde, DTO, JSON]
summary: "CreatePostRequest, UpdatePostRequest, PostResponse, PostForm과 Serialize/Deserialize, From<Model>을 설명합니다."
---

HTTP 본문(JSON·폼)은 바이트 문자열입니다. Axum + **Serde**가 이를 Rust **struct(DTO)**로 바꾸고, 응답은 다시 JSON으로 직렬화합니다.

## Rust를 처음 접한다면 — Serde와 DTO

- **직렬화(Serialize)** — Rust 값 → JSON 문자열 (`PostResponse` → HTTP body).
- **역직렬화(Deserialize)** — JSON/폼 문자열 → Rust 값 (`CreatePostRequest`).
- **DTO(Data Transfer Object)** — 계층 사이로 **옮기기 위한** struct. DB `Model`과 필드가 같을 수도, 다를 수도 있습니다.

`#[derive(Deserialize)]`만 있으면 **요청 본문용**, `Serialize`만 있으면 **응답용**입니다. 둘 다 필요하면 둘 다 derive합니다.

## dto/post.rs — REST API

### 생성 요청

```rust
#[derive(Debug, Deserialize)]
pub struct CreatePostRequest {
    pub title: String,
    pub content: String,
    pub author: String,
}
```

`Json<CreatePostRequest>` extractor가 역직렬화합니다. 필드가 없거나 타입이 맞지 않으면 422 Unprocessable Entity.

### 수정 요청 (부분)

```rust
#[derive(Debug, Deserialize)]
pub struct UpdatePostRequest {
    pub title: Option<String>,
    pub content: Option<String>,
    pub author: Option<String>,
}
```

JSON `null` 또는 필드 생략 → `None`. 서비스는 `Some`인 필드만 갱신합니다.

### 응답

```rust
#[derive(Debug, Serialize)]
pub struct PostResponse {
    pub id: i32,
    pub title: String,
    pub content: String,
    pub author: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<Model> for PostResponse {
    fn from(model: Model) -> Self { /* 필드 복사 */ }
}
```

`chrono`의 `DateTime<Utc>`는 `Serialize` feature로 ISO8601 JSON이 됩니다 (`Cargo.toml`의 `with-chrono`).

핸들러:

```rust
Ok(Json(PostResponse::from(created)))
```

Python FastAPI의 `response_model=PostResponse`와 같은 경계입니다.

## dto/web.rs — HTML 폼

```rust
#[derive(Debug, Deserialize)]
pub struct PostForm {
    pub title: String,
    pub content: String,
    pub author: String,
}
```

`Form<PostForm>` — `application/x-www-form-urlencoded` (브라우저 기본 폼 제출).

```rust
impl PostForm {
    pub fn into_create_request(self) -> CreatePostRequest { /* ... */ }

    pub fn into_update_request(self) -> UpdatePostRequest {
        UpdatePostRequest {
            title: Some(self.title),
            content: Some(self.content),
            author: Some(self.author),
        }
    }
}
```

수정 폼은 세 필드를 모두내므로 `Some`으로 감쌉니다. REST PUT과 달리 “부분만” 보내는 UI는 없지만, 서비스는 동일한 `UpdatePostRequest`를 받습니다.

## Model vs DTO — 왜 나누나

| | Model | PostResponse |
|---|--------|--------------|
| 용도 | DB | API 계약 |
| 변경 | 마이그레이션·엔티티 | API 버전 |
| 노출 | 내부 | 클라이언트 |

나중에 `password_hash` 같은 컬럼을 엔티티에만 두고 DTO에는 넣지 않을 수 있습니다.

## Serde derive 요약

| derive | 방향 |
|--------|------|
| `Deserialize` | JSON/폼 → struct |
| `Serialize` | struct → JSON |

`#[derive(Debug)]` — 로그·테스트용.

## 실습: JSON round-trip

```bash
curl -s -X POST http://127.0.0.1:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"Serde","content":"test","author":"me"}' | jq .

curl -s http://127.0.0.1:3000/api/posts | jq '.[0] | keys'
# id, title, content, author, created_at, updated_at
```

## 헷갈리기 쉬운 점

- **422 vs 400** — JSON 형식이 struct와 안 맞으면 Axum/Serde가 **422**를 내는 경우가 많습니다. 비즈니스 검증 실패(빈 제목)는 우리 코드의 **400** `Validation`입니다.
- **폼 필드 이름** — HTML `<input name="title">`과 `PostForm.title`이 일치해야 합니다. 테스트의 `title=Hello&...`도 같습니다 (12편).
- **`UpdatePostRequest`의 `null`** — `{"title": null}`은 보통 `None`으로 들어와 “이 필드는 수정 안 함”과 같습니다.

## 심화: Serde 옵션과 API 진화

필요 시 derive에 옵션을 붙입니다 (이 프로젝트에는 아직 없음):

```rust
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]  // 정의되지 않은 JSON 필드 거부
pub struct CreatePostRequest { ... }
```

API v2에서 필드 이름을 바꿀 때:

```rust
#[serde(rename = "body")]
pub content: String,
```

클라이언트는 `body`, Rust 필드는 `content`로 유지할 수 있습니다. **DB `Model`은 마이그레이션**, **DTO는 API 버전**으로 나누어 변경하는 것이 일반적입니다.

## 정리

- **Create/Update/PostResponse** — REST 경계
- **PostForm** — HTML 경계 → DTO 변환
- **From<Model>** — DB → API
- **Serde** — 직렬화 규칙

다음 글에서는 **routes/post.rs** REST 핸들러를 HTTP 메서드별로 읽습니다.
