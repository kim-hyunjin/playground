---
title: "[Rust] struct, enum, impl — 코드에서 만나는 Rust 문법"
date: 2026-05-31
category: Backend
tags: [Rust, struct, enum, derive, impl]
summary: "struct·enum에 더해 #[derive]와 impl을 원리부터 설명하고, board-api 코드와 Rust 설계 철학을 연결합니다."
---

Axum 핸들러를 읽기 전에, `board-api`에 반복 등장하는 **데이터를 담는 타입**부터 익숙해집니다. Java의 class/record, Python의 `@dataclass`, TypeScript의 `interface`에 대응하는 Rust의 **struct**, 그리고 **enum**, **impl**을 프로젝트 코드로 봅니다.

## Rust를 처음 접한다면 — struct / enum이란

- **struct** — 관련 필드를 한 덩어리로 묶은 **레코드 타입**. “게시글은 id, title, content, …를 가진다”를 타입으로 표현합니다.
- **enum** — “여러 경우 중 하나”를 표현. `AppError::NotFound` vs `AppError::Validation(...)`처럼 **종류가 다른 실패**를 하나의 타입으로 다룹니다.
- **`#[derive(...)]`** — 컴파일러가 trait 구현 코드를 **자동 생성**합니다 (아래 「derive」 절에서 자세히).
- **`impl`** — struct/enum에 **메서드·trait 구현**을 붙입니다 (아래 「impl」 절에서 자세히).

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

---

## #[derive] — 컴파일 시 trait 구현을 자동 생성

### derive가 하는 일, 한 문장으로

`#[derive(Clone, Debug)]`를 struct 위에 붙이면, **컴파일러가 `Clone`과 `Debug` trait을 구현하는 Rust 코드를 대신 작성**합니다. 우리가 `impl Clone for AppState { ... }`를 직접 쓰지 않아도 됩니다.

다른 언어와 비교하면:

| 언어 | 비슷한 것 | 차이 |
|------|-----------|------|
| Java | Lombok `@Data`, `@EqualsAndHashCode` | Rust는 **컴파일 결과가 일반 Rust 코드** (매크로 확장 후 타입 검사) |
| Python | `@dataclass` | Rust derive는 **표준 trait**에 맞춘 구현을 생성 |
| TypeScript | 없음 (런타임만) | derive는 **빌드 타임**에 끝남 |

### `#[...]`는 “속성(attribute)”

Rust에서 `#[derive(...)]`, `#[sea_orm(...)]`처럼 `#[`로 시작하는 것은 **컴파일러·도구에게 힌트를 주는 메타데이터**입니다.

- `#[derive(Clone)]` — Rust 컴파일러 + `Clone` derive 규칙
- `#[derive(DeriveEntityModel)]` — SeaORM이 제공하는 **절차적 매크로** (proc-macro)
- `#[sea_orm(table_name = "posts")]` — SeaORM 매크로가 읽는 설정

즉 derive는 “한 줄 annotation”처럼 보이지만, 실제로는 **코드 생성 파이프라인**에 끼어 있습니다.

### trait이란 (derive와 짝)

**trait**은 “이 타입이 할 수 있는 일”의 인터페이스입니다.

- `Clone` — `.clone()`으로 복제 가능
- `Debug` — `{:?}`로 디버그 출력 가능
- `Serialize` / `Deserialize` — Serde가 JSON 등으로 변환 가능

```rust
#[derive(Clone, Debug)]
pub struct AppState { pub db: DatabaseConnection }
```

컴파일 후에는 개념적으로 다음과 같은 코드가 생긴 것과 같습니다 (실제 생성 코드는 더 깁니다):

```rust
impl Clone for AppState {
    fn clone(&self) -> Self {
        AppState { db: self.db.clone() }
    }
}
```

`DatabaseConnection`도 `Clone`이 구현되어 있어야 `AppState`가 `Clone` derive를 통과합니다. **필드 타입이 요구하는 trait을 만족해야** derive가 성공합니다.

### board-api에서 자주 보는 derive 정리

| derive | 종류 | 하는 일 |
|--------|------|---------|
| `Clone` | 표준 | 얕은/구조적 복사. Axum `State` 전달에 사용 |
| `Copy` | 표준 | 복사 시 이동 대신 비트 복사 (작은 `enum`에만 가능) |
| `Debug` | 표준 | 로그·테스트용 `println!("{:?}", x)` |
| `PartialEq`, `Eq` | 표준 | `==` 비교 (테스트 assert) |
| `Serialize`, `Deserialize` | Serde | JSON ↔ struct |
| `DeriveEntityModel` | SeaORM | `Entity`, `Column`, `ActiveModel` 생성 |
| `DeriveRelation` | SeaORM | FK 관계 enum |
| `Template` | Askama | HTML 템플릿 렌더 코드 생성 (11편) |

**표준 derive** (`Clone`, `Debug` 등)는 Rust에 내장된 규칙으로 생성합니다.  
**외부 derive** (`DeriveEntityModel`, `Serialize` 등)는 해당 crate가 `proc-macro`로 구현을 제공합니다.

### derive를 쓰는 이유 — 보일러플레이트 제거 + 규칙 통일

`PostResponse`에 필드가 7개면, `Clone`을 손으로 쓰려면 필드마다 `.clone()`을 나열해야 합니다. 필드를 하나 추가할 때 **impl도 수정**해야 하고, 빠뜨리면 버그입니다.

derive는:

1. **필드 추가·삭제 시 impl을 자동으로 맞춤** (컴파일 시점)
2. 팀 전체가 **같은 관례**의 `Debug`/`Clone` 동작을 씀
3. 런타임 비용 없음 — **컴파일 타임에만** 코드가 늘어남 (zero-cost abstraction)

### derive만으로 안 되는 것

- **비즈니스 로직** — `validate_create`, `format_datetime`은 직접 `fn`으로 작성
- **복잡한 변환** — `From<Model> for PostView`처럼 날짜 포맷이 들어가면 보통 **수동 `impl`**
- **조건부 Serialize** — `#[serde(skip)]` 등은 derive에 **추가 attribute**로 설정 (09편)

`CreatePostRequest`는 `Deserialize`만 derive하고 `Serialize`는 없습니다. “클라이언트 → 서버” 방향만 필요하다는 **의도적 선택**입니다.

### 헷갈리기: derive vs 매크로 vs impl

| | derive | 일반 `impl` |
|---|--------|-------------|
| 누가 씀 | 컴파일러/매크로 crate | 개발자 |
| 언제 | 필드 나열·표준 동작 | 도메인 규칙·변환 |
| 예 | `#[derive(Clone)]` | `impl From<Model> for PostResponse` |

---

## impl — 타입에 동작을 붙이는 블록

Rust에는 **클래스 안에 메서드를 정의**하는 문법이 없습니다. 대신 **데이터(struct/enum)** 와 **동작(impl 블록)** 을 분리합니다. 이것이 Rust 설계의 핵심 축 하나입니다.

### impl의 두 가지 형태

**1) 자기 타입 전용 impl** — 그 타입만의 메서드

```rust
impl PostForm {
    pub fn into_create_request(self) -> CreatePostRequest { ... }
}
```

**2) trait impl** — 여러 타입이 공유하는 인터페이스

```rust
impl From<Model> for PostResponse {
    fn from(model: Model) -> Self { ... }
}
```

Java로 치면 (1)은 클래스 메서드, (2)는 `interface Serializable`을 구현하는 것에 가깝습니다. 다만 Rust trait은 **기존 타입에 나중에 impl을 붙일 수 있는 경우**가 제한적으로 있습니다 (orphan rule, 아래 참고).

### associated function vs method

```rust
impl PostForm {
    pub fn into_create_request(self) -> CreatePostRequest { ... }
}

impl From<Model> for PostResponse {
    fn from(model: Model) -> Self { ... }
}
```

| 호출 | 문법 | 첫 인자 | 의미 |
|------|------|---------|------|
| 연관 함수 | `PostResponse::from(model)` | 없음 | 타입에 붙은 함수 |
| 메서드 | `form.into_create_request()` | `self` | 인스턴스에 붙은 함수 |

`self`의 종류:

| 표기 | 소유권 | 호출 후 |
|------|--------|---------|
| `self` | 가져감 (move) | 인스턴스 사용 불가 |
| `&self` | 빌림 | 인스턴스 유지 |
| `&mut self` | 가변 빌림 | 필드 수정 가능 |

`into_create_request(self)`는 폼을 **한 번 변환에 소비**합니다. 변환 후 `PostForm`을 다시 쓸 일이 없으므로 `self`가 적절합니다.

### `impl From<A> for B` — 변환의 관례

```rust
impl From<Model> for PostResponse {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            title: model.title,
            // ...
        }
    }
}
```

- `Self` — impl 대상 타입 (`PostResponse`)
- `From::from(model)` 또는 **`model.into()`** — `into()`는 `From`이 있으면 자동으로 쓸 수 있는 편의 메서드

`board-api` 핸들러에서 흔한 패턴:

```rust
.map(PostResponse::from)
// 또는
PostResponse::from(post)
```

**왜 `From` trait인가:** 변환 함수 이름을 `to_dto`, `convert`마다 제각각 두지 않고, **표준 이름 `from`/`into`** 로 통일합니다. 라이브러리·팀 코드가 읽기 쉬워집니다.

`PostView`의 `From<Model>`은 같은 `Model`이라도 **날짜를 문자열로 바꾸는 추가 로직**이 있어 derive로 대체할 수 없습니다:

```rust
created_at: format_datetime(model.created_at),
```

### trait impl이 많은 이유 (board-api 맥락)

| impl 대상 | trait | 역할 |
|-----------|-------|------|
| `AppError` | `IntoResponse` | HTTP 응답으로 변환 (08편) |
| `AppError` | `Error`, `Display` | thiserror + 메시지 |
| `PostResponse` | `From<Model>` | DB → JSON DTO |
| `PostView` | `From<Model>` | DB → HTML 뷰 |

**데이터(struct)는 얇게, 동작(impl)은 trait으로 조합**하는 스타일입니다.

### orphan rule (심화) — 왜 derive는 되는데 내가 임의 trait은 못 붙이나

Rust에는 **orphan rule**이 있습니다. 요지는:

- `trait`과 `type` 중 **적어도 하나**는 현재 crate에서 정의한 것이어야  
  그 crate에서 `impl Trait for Type`을 할 수 있다.

예: 표준 라이브러리 trait `Display`를 `Vec<i32>`에 직접 impl할 수 없습니다 (둘 다 외부 crate).

그래서:

- `serde`는 `Serialize` trait + derive 매크로를 **자기 crate에서** 제공
- `From<Model> for PostResponse`는 **우리 crate**의 `Model`, `PostResponse`이므로 우리가 impl 가능

이 규칙 덕분에 **다른 사람의 타입에 내 trait을 마음대로 붙여서 동작이 꼬이는 일**을 막습니다. 대신 유연성은 **trait + derive + newtype 패턴**으로 확보합니다.

---

## Rust 설계 철학 — derive와 impl이 드러내는 것

Rust는 “단순히 빠른 C”가 아니라, **안전성·예측 가능성·명시성**을 컴파일 타임에 최대한 해결하는 언어입니다. `derive`와 `impl`은 그 철학이 타입 시스템에 어떻게 스며드는지 보여 줍니다.

### 1. 데이터와 동작의 분리

Java/C#: `class Post { fields + methods }` 한 덩어리.  
Rust: `struct Post { ... }` + `impl Post { ... }` + 필요 시 `impl SomeTrait for Post`.

**의도:** 데이터 레이아웃(메모리, 필드)과 행동(메서드)을 독립적으로 확장.  
`PostResponse`에는 API 변환만, `Model`에는 DB 매핑만 — **같은 “게시글” 개념도 계층마다 다른 타입**으로 나누기 쉽습니다.

### 2. 명시적이고 기계가 검사하는 계약 (trait)

“이 타입은 복제 가능하다”를 주석이 아니라 **`Clone` trait**으로 표현합니다.  
`AppState`에 `Clone`이 없으면 Axum `State` extractor 사용 지점에서 **컴파일 에러**가 납니다.

**의도:** 런타임 `ClassCastException` 대신, **빌드가 깨져서** 문제를 앞당깁니다.

### 3. 제로 코스트 추상화 (zero-cost abstractions)

derive로 만든 `Clone`/`Debug`는 **런타임에 해석기가 없습니다**. C++ 템플릿처럼 필요한 코드만 생성되고, 최적화 후에는 손으로 쓴 것과 비슷한 기계어가 나옵니다.

**의도:** “안전하고 편한 추상화”를 쓰되, **성능 세금을 최소화**합니다.

### 4. 조합(composition) > 상속(inheritance)

Rust에는 클래스 상속이 없습니다. `enum` + `trait` + `impl`로 **행동을 조합**합니다.

- `AppError` enum — 실패 **종류**를 합침
- `IntoResponse` trait — HTTP 응답 **능력**을 붙임
- `From` trait — 변환 **능력**을 붙임

**의도:** 깊은 상속 트리 대신, **작은 단위를 명시적으로 합성**해 예측 가능한 코드를 유지합니다.

### 5. 컴파일 타임 코드 생성에 대한 태도

`#[derive(Serialize)]`, `#[derive(DeriveEntityModel)]`는 **매크로로 코드를 생성**합니다. Rust 커뮤니티는 이를:

- **장점:** 반복 제거, crate 간 일관된 API
- **단점:** 매크로 에러 메시지가 길고 난해할 수 있음 → `cargo expand`로 펼쳐 보기

**의도:** 런타임 리플렉션(Java Hibernate, Python dataclass 런타임)보다 **빌드 시점에 형태를 고정**해 최적화·안전성을 확보합니다.

### 6. 실용주의 (pragmatism)

이론만 고집하지 않습니다.

- `clone()`을 서비스에서 쓰는 것 — 완벽한 borrow만으로도 가능하지만 **CRUD 예제에서는 명확함 우선**
- `expect` in `main` — 서버 기동 실패는 패닉으로 종료
- SeaORM derive — Raw SQL 대신 생산성

**의도:** “이상적인 Rust”와 “배포 가능한 앱” 사이에서 **타협점을 문서화**하고, 팀이 같은 선택을 하게 합니다.

### 설계 철학과 board-api 읽는 법

코드를 읽을 때:

1. **struct/enum** — “무슨 데이터가 있나?”
2. **`#[derive(...)]`** — “컴파일러·프레임워크가 뭘 자동으로 해 주나?”
3. **`impl`** — “이 타입이 **무엇을 할 수 있나?** (변환, HTTP, DB)”

이 세 겹을 나누어 보면, Java Spring 프로젝트에서 `@Entity` / `@Dto` / `@Service`를 나누어 보던 것과 같은 **레이어 감각**으로 Rust 코드에 적응할 수 있습니다.

---

## Model vs PostResponse vs PostView

| 타입 | 위치 | 역할 |
|------|------|------|
| `post::Model` | entity | DB 행 그대로 |
| `PostResponse` | dto | REST JSON |
| `PostView` | web | HTML 템플릿용 (날짜 포맷 등) |

같은 DB 데이터를 **출력 채널마다** 다른 struct로 바꿉니다.

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

## 실습: derive와 impl이 보이는지 확인

```bash
cd content/backend/rust/board-api
cargo check
```

선택 — 매크로가 펼친 코드를 보고 싶다면 (도구 설치 필요):

```bash
cargo install cargo-expand
cargo expand -p board_api --lib entity::post::Model 2>/dev/null | head -80
```

SeaORM `DeriveEntityModel`이 얼마나 많은 코드를 생성하는지 체감할 수 있습니다.

## 정리

| 개념 | 한 줄 |
|------|--------|
| **struct / enum** | 데이터 모양 |
| **`#[derive]`** | 표준·외부 trait 구현을 컴파일 타임에 자동 생성 |
| **trait** | 타입이 할 수 있는 일의 인터페이스 |
| **impl** | 메서드·trait 구현을 타입에 연결 |
| **설계 철학** | 안전·명시·조합·제로 코스트, 실용적 타협 |

다음 글(03)에서는 `String`, `Option`, `Result`, `?`로 **값이 이동하고 실패가 전파**되는 방식을 봅니다. derive/impl로 “타입에 능력을 붙였다”면, 03편은 “그 능력을 호출하는 **제어 흐름**”입니다.
