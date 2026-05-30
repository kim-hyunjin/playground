# board-api

Rust로 구현한 게시판 CRUD REST API 예제입니다. **Axum** 웹 프레임워크와 **SeaORM**(SQLite)을 사용합니다.

## 기술 스택

| 구분 | 라이브러리 |
|------|------------|
| HTTP | [Axum](https://github.com/tokio-rs/axum) 0.7 |
| ORM | [SeaORM](https://www.sea-ql.org/SeaORM/) 1.x + SQLx SQLite |
| DB | SQLite (`board.db`) |
| 비동기 런타임 | Tokio |

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/health` | 헬스 체크 |
| `GET` | `/api/posts` | 게시글 목록 (최신순) |
| `GET` | `/api/posts/:id` | 게시글 단건 조회 |
| `POST` | `/api/posts` | 게시글 생성 |
| `PUT` | `/api/posts/:id` | 게시글 수정 (부분 업데이트) |
| `DELETE` | `/api/posts/:id` | 게시글 삭제 |

### 요청/응답 예시

**생성 (`POST /api/posts`)**

```json
{
  "title": "제목",
  "content": "본문",
  "author": "작성자"
}
```

**응답**

```json
{
  "id": 1,
  "title": "제목",
  "content": "본문",
  "author": "작성자",
  "created_at": "2026-05-30T05:00:00Z",
  "updated_at": "2026-05-30T05:00:00Z"
}
```

**수정 (`PUT /api/posts/:id`)** — 변경할 필드만내면 됩니다.

```json
{
  "title": "수정된 제목"
}
```

## 실행 방법

```bash
cd content/backend/rust/board-api

# 환경 변수 (선택)
cp .env.example .env

# 서버 실행
cargo run
```

기본 주소: `http://127.0.0.1:3000`

### curl 예시

```bash
curl -X POST http://127.0.0.1:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"Hello","content":"World","author":"dev"}'

curl http://127.0.0.1:3000/api/posts
```

## 테스트

```bash
cargo test
```

통합 테스트는 메모리 SQLite DB에서 CRUD 흐름을 검증합니다.

## 프로젝트 구조

```
src/
  main.rs          # 서버 진입점
  lib.rs           # 라이브러리 루트 (테스트에서 재사용)
  db.rs            # DB 연결 및 스키마 초기화
  entity/post.rs   # SeaORM 엔티티
  dto/post.rs      # API DTO
  routes/post.rs   # 핸들러
  error.rs         # 공통 에러 응답
tests/
  api.rs           # CRUD 통합 테스트
```

## 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DATABASE_URL` | `sqlite://board.db?mode=rwc` | SQLite 연결 문자열 |
| `HOST` | `127.0.0.1` | 바인딩 호스트 |
| `PORT` | `3000` | 포트 |

앱 시작 시 `posts` 테이블이 없으면 SeaORM 스키마로 자동 생성됩니다.
