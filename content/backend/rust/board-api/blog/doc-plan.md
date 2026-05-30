# Rust 게시판 백엔드 블로그 시리즈 — 작성 계획

## 시리즈 개요

| 항목 | 내용 |
|------|------|
| **시리즈명** | Rust 게시판 백엔드로 배우는 Rust |
| **대상 독자** | 프로그래밍 경험은 있으나 Rust는 처음인 사람 |
| **학습 목표** | `board-api`의 모든 소스·템플릿·테스트를 읽고 실행 흐름을 설명할 수 있을 것 |
| **저장 위치** | `content/backend/rust/board-api/blog/` |
| **파일 형식** | `doc-to-blog` 스킬에 따라 `NN-주제-slug.pub.md` + YAML frontmatter |

## doc-to-blog 스킬 적용 규칙

각 `.pub.md` 파일은 아래 형식을 따른다.

```yaml
---
title: "[Rust] ..."
date: YYYY-MM-DD
category: Backend
tags: [Rust, Axum, SeaORM, ...]
summary: "한 줄 요약"
---
```

- **코드 보존:** 원본 Rust/HTML 코드 블록은 생략하지 않고, 줄 단위로 설명
- **톤:** 초보자 대상 — 다른 언어(Java, Python 등)와 비교하는 한 줄씩 포함
- **실습:** 각 글마다 `cargo run` / `curl` / 브라우저로 확인할 수 있는 작은 실습 1개

---

## 권장 학습 순서 (글감 13편)

### Part 0 — 들어가며 (1편)

| # | 예상 파일명 | 제목 | 대상 코드 | 핵심 개념 |
|---|-------------|------|-----------|-----------|
| **00** | `00-rust-board-overview.pub.md` | Rust 게시판 백엔드, 무엇을 만들었나 | `README.md`, 프로젝트 구조 전체 | REST API vs HTML UI, Axum·SeaORM·SQLite 스택, 요청 흐름(브라우저/curl → 라우트 → 서비스 → DB) |

**이 글에서 그릴 그림:** 한 HTTP 요청이 `routes` → `services` → `entity/db`를 거쳐 응답으로 돌아오는 전체 경로.

---

### Part 1 — Rust + Cargo 기초 (3편)

| # | 예상 파일명 | 제목 | 대상 코드 | 핵심 개념 |
|---|-------------|------|-----------|-----------|
| **01** | `01-cargo-and-module-system.pub.md` | Cargo.toml과 모듈 시스템: lib vs bin | `Cargo.toml`, `src/lib.rs`, `src/main.rs`, 각 `mod.rs` | crate, dependency, `[lib]` / `[[bin]]`, `pub mod`, `use`, crate 루트 |
| **02** | `02-rust-types-and-structs.pub.md` | struct, enum, impl — 코드에서 만나는 Rust 문법 | `state.rs`, `entity/post.rs`, `dto/post.rs`, `web/view.rs` | struct, enum, `#[derive(...)]`, `impl`, associated function vs method |
| **03** | `03-ownership-option-result.pub.md` | 소유권, Option, Result — `?` 연산자까지 | `services/post.rs`, `routes/web.rs`, `error.rs` 전반 | `String` vs `&str`, `.clone()`, `Option<T>`, `Result<T, E>`, `?`, `match`, `if let Some` |

**Part 1 목표:** Axum/SeaORM 코드를 읽기 전에, 프로젝트에 실제로 등장하는 Rust 문법을 먼저 익힌다.

---

### Part 2 — 서버 뼈대 (2편)

| # | 예상 파일명 | 제목 | 대상 코드 | 핵심 개념 |
|---|-------------|------|-----------|-----------|
| **04** | `04-async-tokio-and-main.pub.md` | async/await와 Tokio — 서버가 시작되는 순간 | `src/main.rs` | `async fn`, `.await`, `#[tokio::main]`, `TcpListener`, 환경 변수(`dotenvy`), `tracing` 로깅 |
| **05** | `05-app-state-and-routing.pub.md` | AppState와 라우터 — 요청을 어디로 보낼까 | `state.rs`, `routes/mod.rs`, `routes/mod.rs`의 `health` | `AppState`, `Clone`, `Router`, `.merge()`, `.route()`, `.with_state()`, Axum handler 시그니처 |

**Part 2 목표:** 서버가 뜨고 `/health`, `/api/posts`, `/` 등 URL이 어떻게 연결되는지 이해한다.

---

### Part 3 — 데이터 계층 (2편)

| # | 예상 파일명 | 제목 | 대상 코드 | 핵심 개념 |
|---|-------------|------|-----------|-----------|
| **06** | `06-seaorm-entity-and-db.pub.md` | SeaORM 엔티티와 DB 연결 | `entity/post.rs`, `db.rs` | `Model` / `ActiveModel`, `#[sea_orm(...)]`, `ConnectOptions`, `init_schema`, SQLite |
| **07** | `07-service-layer-crud.pub.md` | 서비스 레이어 — CRUD와 검증 로직 | `services/post.rs`, `services/mod.rs` | `find().order_by_desc()`, `insert` / `update` / `delete`, `Set(...)`, `..Default::default()`, 입력 검증, API·웹 공용 로직 |

**Part 3 목표:** DB 테이블 정의부터 목록/생성/수정/삭제까지 비즈니스 흐름을 파악한다.

---

### Part 4 — API·에러·DTO (3편)

| # | 예상 파일명 | 제목 | 대상 코드 | 핵심 개념 |
|---|-------------|------|-----------|-----------|
| **08** | `08-error-handling-with-thiserror.pub.md` | thiserror로 만드는 앱 에러 | `error.rs` | `AppError` enum, `#[from]`, `thiserror::Error`, `IntoResponse`, `AppResult` / `WebResult`, JSON vs HTML 에러 응답 |
| **09** | `09-dto-and-serde.pub.md` | DTO와 Serde — JSON/폼 데이터 변환 | `dto/post.rs`, `dto/web.rs`, `dto/mod.rs` | `CreatePostRequest`, `UpdatePostRequest`, `PostResponse`, `PostForm`, `Serialize` / `Deserialize`, `From<Model>` |
| **10** | `10-rest-api-handlers.pub.md` | REST API 핸들러 한 줄씩 읽기 | `routes/post.rs` | `State`, `Path`, `Json` extractor, `into_iter().map().collect()`, HTTP 메서드별 핸들러, curl로 호출해보기 |

**Part 4 목표:** `/api/posts` CRUD를 코드와 HTTP 요청/응답 예시로 1:1 매칭한다.

---

### Part 5 — 웹 UI·테스트·마무리 (3편)

| # | 예상 파일명 | 제목 | 대상 코드 | 핵심 개념 |
|---|-------------|------|-----------|-----------|
| **11** | `11-server-side-rendering-askama.pub.md` | Askama으로 HTML 게시판 만들기 | `web/templates.rs`, `web/view.rs`, `web/response.rs`, `web/mod.rs`, `templates/*.html`, `routes/web.rs` | `#[derive(Template)]`, `PostView` vs `PostResponse`, `Form`, `Redirect`, `render_page`, 검증 실패 시 폼 재표시 |
| **12** | `12-integration-tests.pub.md` | 통합 테스트 — 메모리 DB로 CRUD 검증 | `tests/api.rs`, `tests/web.rs` | `#[tokio::test]`, `sqlite::memory:`, `tower::ServiceExt::oneshot`, JSON/HTML 응답 assert |
| **13** | `13-putting-it-all-together.pub.md` | 전체 흐름 정리 — 한 글 작성의 여정 | 전체 코드 (복습) | REST vs Web 경로 비교, 레이어 책임(entity / service / route / dto / web), 확장 아이디어(페이지네이션, 인증 등) |

---

## 코드 ↔ 글 매핑

| 파일/디렉터리 | 다루는 글 |
|---------------|-----------|
| `Cargo.toml` | 01 |
| `src/main.rs` | 04, 13 |
| `src/lib.rs` + 모든 `mod.rs` | 01 |
| `src/state.rs` | 02, 05 |
| `src/db.rs` | 06 |
| `src/entity/post.rs` | 02, 06 |
| `src/services/post.rs` | 03, 07 |
| `src/error.rs` | 03, 08 |
| `dto/*` | 02, 09 |
| `routes/mod.rs` | 05 |
| `routes/post.rs` | 10 |
| `routes/web.rs` | 03, 11 |
| `web/*` | 02, 11 |
| `templates/*.html` | 11 |
| `tests/*` | 12 |
| `README.md` | 00 |
| `Dockerfile`, `docker-compose.yml` | 00 또는 13 부록 (선택) |

---

## 시리즈 설계 의도

1. **문법 먼저, 프레임워크 나중** — Axum/SeaORM(04~) 전에 01~03에서 Rust 문법을 프로젝트 코드로 익힌다.
2. **레이어 순서** — state/routes → DB → service → error/dto → handler → web → test
3. **같은 로직, 두 가지 UI** — `services/post.rs`는 REST(10)와 HTML(11)에서 공유된다는 점을 07·10·11에서 반복 강조한다.
4. **마지막에 전체 지도** — 13편에서 "한 요청의 전체 여정"으로 복습한다.

---

## 선행 관계

```
00 (개요)
 └─ 01 (Cargo/모듈)
     └─ 02 (struct/enum/impl)
         └─ 03 (소유권/Option/Result)
             ├─ 04 (async/main) ── 05 (라우팅)
             │                        └─ 06 (SeaORM) ── 07 (서비스)
             │                                          ├─ 08 (에러)
             │                                          ├─ 09 (DTO)
             │                                          ├─ 10 (REST)
             │                                          └─ 11 (HTML)
             └─ 12 (테스트) ── 13 (전체 정리)
```
