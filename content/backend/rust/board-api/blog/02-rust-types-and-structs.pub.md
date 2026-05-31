---
title: "[Rust] struct, enum, impl — 코드에서 만나는 Rust 문법"
date: 2026-05-31
category: Backend
tags: [Rust, struct, enum, derive, impl]
summary: "AppState, SeaORM Model, DTO, PostView에서 struct·enum·#[derive]·impl을 한 줄씩 읽습니다."
---

Axum 핸들러를 읽기 전에, `board-api`에 반복 등장하는 **데이터를 담는 타입**부터 익숙해집니다. Java의 class/record, Python의 `@dataclass`, TypeScript의 `interface`에 대응하는 Rust의 **struct**, 그리고 **enum**, **impl**을 프로젝트 코드로 봅니다.

## Rust를 처음 접한다면 — struct / enum이란

- **struct** — 관련 필드를 한 덩어리로 묶은 **레코드 타입**. “게시글은 id, title, content, …를 가진다”를 타입으로 표현합니다.
- **enum** — “여러 경우 중 하나”를 표현. `AppError::NotFound` vs `AppError::Validation(...)`처럼 **종류가 다른 실패**를 하나의 타입으로 다룹니다.
- **`#[derive(...)]`** — 컴파일러가 `Clone`, `Debug`, `Serialize` 같은 **보일러플레이트 코드를 자동 생성**합니다. 직접 손으로 쓰지 않아도 됩니다.

Rust에는 `null`이 없습니다. “없을 수 있음”은 `Option<T>`, “실패할 수 있음”은 `Result<T, E>`로 표현합니다 (03편).

## struct — 필드 묶음

### AppState (`state.rs`)

```rust
use sea_orm::DatabaseConnection;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
}
```

- `struct` — 이름 있는 필드 집합
- `pub db` — 외부에서 `state.db`로 DB 연결 사용
- `#[derive(Clone)]` — `.clone()`으로 얕은 복사 가능 (Axum이 요청마다 State를 넘길 때 필요)

Java의 `public class AppState { public DatabaseConnection db; }` + `Cloneable`과 비슷한 역할입니다.

### SeaORM Model (`entity/post.rs`)

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "posts")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    #[sea_orm(column_type = "Text")]
    pub content: String,
    pub author: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
```

| derive | 용도 |
|--------|------|
| `Clone, Debug, PartialEq, Eq` | 복사·디버그 출력·비교 |
| `DeriveEntityModel` | SeaORM이 테이블 매핑 코드 생성 |
| `Serialize, Deserialize` | JSON 등 serde 변환 |

`#[sea_orm(table_name = "posts")]` — DB 테이블 이름. JPA `@Table(name = "posts")`와 같습니다.

### DTO (`dto/post.rs`)

```rust
#[derive(Debug, Deserialize)]
pub struct CreatePostRequest {
    pub title: String,
    pub content: String,
    pub author: String,
}

#[derive(Debug, Serialize)]
pub struct PostResponse {
    pub id: i32,
    pub title: String,
    // ...
}
```

- **요청** — `Deserialize` (JSON → struct)
- **응답** — `Serialize` (struct → JSON)

API 경계용 타입을 DB `Model`과 분리하는 것은 Spring의 `PostDto` vs `PostEntity` 패턴과 같습니다.

## enum — 여러 변형 중 하나

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}
```

게시글은 다른 테이블과 관계가 없어 `Relation`이 비어 있습니다. 다른 프로젝트에서는 `enum Relation { User, ... }`처럼 FK 관계를 정의합니다.

에러 타입도 enum입니다 (`error.rs`, 08편에서 자세히):

```rust
pub enum AppError {
    NotFound,
    Validation(String),
    Database(#[from] DbErr),
}
```

Java의 `sealed` 예외 계층이나 Python에서 `class NotFoundError(Exception)` 여러 개 두는 것과 유사합니다.

## impl — 메서드와 변환

### associated function vs method

```rust
impl From<Model> for PostResponse {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            title: model.title,
            content: model.content,
            author: model.author,
            created_at: model.created_at,
            updated_at: model.updated_at,
        }
    }
}
```

- `impl From<A> for B` — `B::from(a)` 또는 `a.into()`로 변환 (Rust 관례)
- `Self` — 구현 대상 타입 (`PostResponse`)

`PostView`도 같은 패턴입니다 (`web/view.rs`):

```rust
impl From<Model> for PostView {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            title: model.title,
            // created_at은 format_datetime()으로 문자열화
            created_at: format_datetime(model.created_at),
            // ...
        }
    }
}
```

HTML에는 ISO8601 전체 대신 읽기 쉬운 문자열을 보여 주기 위해 **뷰 전용 struct**를 둡니다.

### impl 블록에 메서드 (`dto/web.rs`)

```rust
impl PostForm {
    pub fn into_create_request(self) -> crate::dto::post::CreatePostRequest {
        CreatePostRequest {
            title: self.title,
            content: self.content,
            author: self.author,
        }
    }
}
```

- 첫 인자가 `self` — 인스턴스 메서드 (소유권을 가져감 → 호출 후 `PostForm` 소비)
- `self` 대신 `&self`면 빌리기만 함

## Model vs PostResponse vs PostView

| 타입 | 위치 | 역할 |
|------|------|------|
| `post::Model` | entity | DB 행 그대로 |
| `PostResponse` | dto | REST JSON |
| `PostView` | web | HTML 템플릿용 (날짜 포맷 등) |

같은 DB 데이터를 **출력 채널마다** 다른 struct로 바꿉니다.

## 실습: 타입이 컴파일되는지 확인

```bash
cd content/backend/rust/board-api
cargo check
```

`CreatePostRequest`에 필드를 빠뜨리면 핸들러의 `Json(payload)` 추출 단계에서 컴파일이 깨집니다. Rust는 스키마를 타입으로 강제합니다.

## 헷갈리기 쉬운 점

- **`Model`이라는 이름** — SeaORM 관례입니다. “도메인 모델”이 아니라 **DB 테이블 한 행**을 뜻합니다. 헷갈리면 `post::Model`을 “PostRow”로 읽어도 됩니다.
- **`impl From<A> for B`와 메서드** — `from`은 연관 함수(타입에 붙음), `into_create_request(self)`는 인스턴스 메서드입니다.
- **같은 필드명이 여러 struct에 반복** — 의도적입니다. 각 struct가 **다른 계층의 계약**을 나타냅니다.

## 심화: 왜 Model / DTO / View를 세 개나 두나

| 타입 | 변경 주체 | API 버전·UI와의 결합 |
|------|-----------|----------------------|
| `Model` | DB 스키마, 마이그레이션 | 낮음 (내부) |
| `PostResponse` | REST 클라이언트 계약 | 높음 — 필드 추가 시 API 문서 영향 |
| `PostView` | HTML 디자인 | 표시 형식(날짜 문자열 등)만 |

한 struct에 JSON·HTML·DB를 모두 넣으면, 날짜를 ISO 문자열로 바꿀 때 DB 레이어까지 흔들립니다. **경계마다 타입을 나누는 것**이 유지보수에 유리합니다. 비용은 `From` 변환 몇 줄입니다.

## 정리

- **struct** — AppState, Model, DTO, View
- **enum** — Relation, AppError
- **#[derive(...)]** — 보일러플레이트 자동 생성
- **impl** — `From` 변환, `PostForm` 메서드

다음 글에서는 `String`, `Option`, `Result`, `?` 연산자로 **서비스·라우트**에서 값이 어떻게 흐르는지 봅니다.
