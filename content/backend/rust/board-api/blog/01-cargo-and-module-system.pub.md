---
title: "[Rust] Cargo.toml과 모듈 시스템: lib vs bin"
date: 2026-05-31
category: Backend
tags: [Rust, Cargo, 모듈, crate]
summary: "board-api의 Cargo.toml, lib.rs, main.rs와 mod.rs로 crate·모듈·pub mod 구조를 익힙니다."
---

Rust 프로젝트를 열면 가장 먼저 보는 파일이 `Cargo.toml`입니다. Maven의 `pom.xml`이나 npm의 `package.json`과 같은 **패키지 매니페스트**입니다. 이 글에서는 `board-api`가 **라이브러리 crate**와 **실행 바이너리 crate**를 어떻게 나누는지, 그리고 `mod.rs`로 디렉터리를 모듈 트리에 연결하는 방법을 봅니다.

## Rust를 처음 접한다면 — Cargo가 하는 일

1. **의존성 다운로드** — `Cargo.toml`에 적은 `axum`, `sea-orm` 등을 crates.io에서 받습니다.
2. **컴파일** — `rustc`로 Rust 소스를 기계 코드로 바꿉니다. 에러가 있으면 여기서 멈춥니다 (런타임에 “클래스 없음” 같은 surprise가 적음).
3. **실행** — `[[bin]]`이 가리키는 `main.rs`부터 시작합니다.

`cargo check`는 실행 파일을 만들지 않고 **타입·문법만 검사**해서 빠릅니다. 글을 읽으며 소스를 고쳤다면 `cargo check`로 자주 확인하는 습관이 좋습니다.

## Cargo.toml — 의존성과 crate 종류

```toml
[package]
name = "board-api"
version = "0.1.0"
edition = "2021"
description = "SQLite-backed board CRUD REST API (Axum + SeaORM)"

[dependencies]
askama = "0.12"
axum = "0.7"
# ... 생략 ...

[lib]
name = "board_api"
path = "src/lib.rs"

[[bin]]
name = "board-api"
path = "src/main.rs"
```

| 항목 | 의미 |
|------|------|
| `[package]` | 프로젝트 이름·버전 (배포 단위) |
| `[dependencies]` | 외부 crate (crates.io에서 가져옴) |
| `[lib]` | **라이브러리** crate — 이름은 `board_api` (하이픈→언더스코어) |
| `[[bin]]` | **실행 파일** crate — `cargo run` 시 `main.rs` 진입 |

Python으로 치면 `board_api` 패키지( import 가능)와 `python -m board_api`용 `__main__.py`를 한 repo에 둔 것과 비슷합니다.

## lib.rs — crate 루트

```rust
pub mod db;
pub mod dto;
pub mod entity;
pub mod error;
pub mod routes;
pub mod services;
pub mod state;
pub mod web;
```

- `mod 이름` — `src/이름.rs` 또는 `src/이름/mod.rs`를 이 crate에 포함합니다.
- `pub mod` — **다른 crate**(예: `main.rs`, `tests/`)에서 `board_api::routes`처럼 쓸 수 있게 공개합니다.

`main.rs`는 `use board_api::{db, routes, state::AppState};`처럼 **라이브러리를 import**해서 서버만 띄웁니다. 통합 테스트도 같은 라이브러리를 재사용합니다.

## main.rs — 바이너리 진입점

```rust
use board_api::{db, routes, state::AppState};
// ...
#[tokio::main]
async fn main() {
    // DB 연결, Router 조립, serve
}
```

실행 파일은 얇게 두고, 테스트·재사용 가능한 로직은 전부 `lib`에 두는 패턴입니다. Spring Boot의 `@SpringBootApplication` main과 `@Service`/`@Repository`를 jar 안에 나누는 것과 같은 분리입니다.

## mod.rs — 폴더를 모듈로 묶기

`src/routes/mod.rs`:

```rust
pub mod post;
pub mod web;

use axum::{routing::get, Router};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .merge(web::router())
        // ...
}
```

- `pub mod post;` → `src/routes/post.rs`를 하위 모듈로 등록
- `crate::state` — **현재 crate 루트** 기준 경로 (`board_api::state`와 동일)

`dto/mod.rs`, `entity/mod.rs`, `services/mod.rs`도 같은 방식입니다.

```
src/
  lib.rs          ← crate 루트
  routes/
    mod.rs        ← routes 모듈 + router()
    post.rs       ← routes::post
    web.rs        ← routes::web
```

Java의 `package com.example.routes` + 여러 클래스 파일과 유사합니다.

## use와 가시성

- **기본** — 모듈 안의 항목은 private (같은 모듈·자식만 접근)
- **`pub`** — crate 밖·다른 모듈에서 접근 가능
- **`pub(crate)`** — crate 안에서만 (이 프로젝트에서는 자주 쓰이지 않음)

핸들러·서비스 함수는 보통 `pub async fn`으로 routes에서 호출됩니다.

## 실습: 모듈 트리 확인

```bash
cd content/backend/rust/board-api
cargo tree -p board-api --depth 1
cargo doc --no-deps --open   # 선택: lib 문서 브라우저
```

`cargo check`가 통과하면 `mod` 선언과 파일 경로가 일치한다는 뜻입니다. `mod foo`가 있는데 `foo.rs`가 없으면 컴파일 에러가 납니다.

## 헷갈리기 쉬운 점

| 메시지/현상 | 의미 |
|-------------|------|
| `board-api` vs `board_api` | 패키지 이름(하이픈)과 **라이브러리 crate 이름**(언더스코어)이 다릅니다. `use board_api::...`는 언더스코어 쪽입니다. |
| `mod routes;` vs `use crate::routes` | `mod`는 “이 파일을 모듈 트리에 포함”, `use`는 “이름을 짧게 부르기”. |
| `src/routes/post.rs` | `lib.rs`에 `pub mod routes` + `routes/mod.rs`에 `pub mod post`가 있어야 합니다. **파일만 만들고 `mod` 선언을 빼먹으면** 컴파일러가 모듈을 모릅니다. |

## 심화: lib/bin 분리와 통합 테스트

- **통합 테스트** (`tests/api.rs`)는 `main`을 실행하지 않고 `board_api::routes`를 직접 import합니다. 그래서 비즈니스 로직이 `lib`에 있어야 합니다.
- **배포** 시 Docker는 보통 `board-api` 바이너리만 복사합니다. 라이브러리는 그 안에 링크된 상태입니다.
- 의존성 버전은 `Cargo.lock`에 고정됩니다. 팀 repo에는 lock 파일을 커밋하는 것이 일반적입니다 (앱 프로젝트).

## 정리

| 개념 | board-api에서 |
|------|----------------|
| crate | `board_api` (lib) + `board-api` (bin) |
| 모듈 루트 | `src/lib.rs` |
| 하위 모듈 | `routes`, `services`, `entity`, … |
| 경로 | `crate::services::post::list_posts` |

다음 글에서는 이 모듈들 안에 나오는 **struct, enum, impl** 문법을 `state.rs`, `entity/post.rs`, `dto` 코드로 익힙니다.
