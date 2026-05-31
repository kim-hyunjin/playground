---
title: "[Rust] SeaORM 엔티티와 DB 연결"
date: 2026-05-31
category: Backend
tags: [Rust, SeaORM, SQLite, entity]
summary: "entity/post.rs의 Model·ActiveModel과 db.rs의 connect, init_schema를 설명합니다."
---

게시글 데이터는 SQLite `posts` 테이블에 저장됩니다. Rust 쪽 타입은 **SeaORM 엔티티**로 정의하고, `db.rs`에서 연결·테이블 생성을 담당합니다.

## Rust를 처음 접한다면 — ORM이 하는 일

**ORM(Object-Relational Mapping)**은 DB 테이블 행을 Rust struct로, SQL을 메서드 체인으로 다루게 해 줍니다.

- **테이블 `posts`** — SQL로 말하면 `CREATE TABLE posts (...)` 로 만드는 저장소.
- **`Model`** — `SELECT` 결과 **한 행**이 Rust로 올라온 형태.
- **`ActiveModel`** — `INSERT` / `UPDATE` 때 “이 컬럼만 이렇게 바꾼다”를 적는 **쓰기용** 구조.

Raw SQL을 직접 써도 되지만, SeaORM은 타입 안전·SQL 인젝션 방지·DB 종류 추상화에 유리합니다.

## entity/post.rs — Model

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

| 필드 | DB |
|------|-----|
| `id` | INTEGER PRIMARY KEY (자동 증가) |
| `title`, `author` | TEXT |
| `content` | TEXT (긴 본문용 `Text` 타입) |
| `created_at`, `updated_at` | TIMESTAMP (chrono `DateTime<Utc>`) |

SeaORM은 `DeriveEntityModel`로 `Entity`, `Column`, `ActiveModel` 등을 자동 생성합니다. JPA `@Entity` + 코드 생성과 비슷합니다.

## ActiveModel — INSERT/UPDATE용

서비스에서 생성 시:

```rust
let active_model = post::ActiveModel {
    title: Set(payload.title.trim().to_owned()),
    content: Set(payload.content.trim().to_owned()),
    author: Set(payload.author.trim().to_owned()),
    created_at: Set(now),
    updated_at: Set(now),
    ..Default::default()
};
active_model.insert(&state.db).await?;
```

- `Set(value)` — 이 컬럼을 이 값으로 쓰겠다는 의미
- `..Default::default()` — 나머지 필드(특히 `id`)는 DB 기본값에 맡김

수정 시에는 기존 `Model`을 `into()`로 `ActiveModel`로 바꾼 뒤 일부 필드만 `Set`합니다 (07편).

## db.rs — connect

```rust
pub async fn connect(database_url: &str) -> Result<DatabaseConnection, DbErr> {
    let mut options = ConnectOptions::new(database_url.to_owned());
    options
        .max_connections(5)
        .min_connections(1)
        .connect_timeout(Duration::from_secs(8))
        .sqlx_logging(true);

    Database::connect(options).await
}
```

| 옵션 | 의미 |
|------|------|
| `max_connections(5)` | 풀 상한 |
| `connect_timeout` | 연결 대기 시간 |
| `sqlx_logging(true)` | SQL을 tracing/sqlx 로그로 출력 |

URL 예:

- 로컬: `sqlite://board.db?mode=rwc` (파일 생성·읽기·쓰기)
- 테스트: `sqlite::memory:` (프로세스 종료 시 사라짐)
- Docker: `sqlite:///data/board.db?mode=rwc`

## db.rs — init_schema

```rust
pub async fn init_schema(db: &DatabaseConnection) -> Result<(), DbErr> {
    let backend = db.get_database_backend();
    let schema = Schema::new(backend);

    let mut create_stmt = schema.create_table_from_entity(post::Entity);
    create_stmt.if_not_exists();
    let stmt = backend.build(&create_stmt);
    db.execute(stmt).await?;

    Ok(())
}
```

- `create_table_from_entity` — `Model` 정의에서 `CREATE TABLE` 생성
- `if_not_exists` — 이미 있으면 스킵

마이그레이션 도구 없이 **앱 기동 시 테이블 보장**하는 학습용 단순화입니다. 운영에서는 별도 migration을 쓰는 편이 좋습니다.

## Entity 트레이트 사용 예 (서비스)

```rust
PostEntity::find()
    .order_by_desc(post::Column::Id)
    .all(&state.db)
    .await?;

PostEntity::find_by_id(id).one(&state.db).await?;
```

`PostEntity`는 `entity::post` 모듈의 `Entity` 별칭입니다.

## 실습: DB 파일과 SQL 로그

```bash
cd content/backend/rust/board-api
RUST_LOG=sqlx=info cargo run
```

글 하나 생성 후 프로젝트 루트에 `board.db`가 생기는지, 로그에 `INSERT INTO posts`가 보이는지 확인합니다.

```bash
sqlite3 board.db "SELECT id, title FROM posts;"
```

## 헷갈리기 쉬운 점

- **`Set(...)` vs 그냥 할당** — ActiveModel 필드는 `Set(value)`로 “이 컬럼을 갱신한다”고 표시합니다. `NotSet`이면 UPDATE 시 그 컬럼은 건드리지 않습니다.
- **`sqlite::memory:`** — 테스트 전용. 서버를 끄면 데이터가 사라집니다 (`tests/api.rs`).
- **`init_schema` vs 마이그레이션** — 지금은 앱이 테이블을 만듭니다. 컬럼을 바꿀 때는 `ALTER` 마이그레이션 도구를 쓰는 편이 안전합니다.

## 심화: 연결 풀과 SQLite 한계

- **`max_connections(5)`** — 동시에 DB에 붙는 연결 수 상한. 트래픽이 크면 늘리되, SQLite는 **쓰기 동시성이 제한적**이라 Postgres 등으로 옮기는 경우가 많습니다.
- **`sqlx_logging(true)`** — 개발 중 SQL 확인용. 프로덕션에서는 로그 양·민감 정보 때문에 끄거나 레벨을 조절합니다.
- **chrono `DateTime<Utc>`** — 앱은 UTC로 저장하고, 표시할 때만 로컬 타임존으로 변환하는 것이 일반적입니다 (`PostView`에서 문자열 포맷, 11편).

## 정리

- **Model** — 조회 결과 한 행
- **ActiveModel** — insert/update 빌더
- **connect** — 풀·타임아웃
- **init_schema** — `posts` 테이블 자동 생성

다음 글에서는 **services/post.rs**의 CRUD·검증 로직을 한 줄씩 봅니다.
