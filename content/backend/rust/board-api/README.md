# board-api

Rust로 구현한 게시판 CRUD REST API 예제입니다. **Axum** 웹 프레임워크와 **SeaORM**(SQLite)을 사용합니다.

## 기술 스택

| 구분 | 라이브러리 |
|------|------------|
| HTTP | [Axum](https://github.com/tokio-rs/axum) 0.7 |
| 템플릿 | [Askama](https://github.com/djc/askama) 0.12 |
| ORM | [SeaORM](https://www.sea-ql.org/SeaORM/) 1.x + SQLx SQLite |
| DB | SQLite (`board.db`) |
| 비동기 런타임 | Tokio |

## 웹 UI (HTML)

브라우저에서 바로 게시판을 사용할 수 있는 서버 렌더링 페이지를 제공합니다.

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/` | 게시글 목록 |
| `GET` | `/posts/new` | 글쓰기 폼 |
| `POST` | `/posts` | 글 등록 (폼) |
| `GET` | `/posts/:id` | 게시글 상세 |
| `GET` | `/posts/:id/edit` | 수정 폼 |
| `POST` | `/posts/:id/edit` | 글 수정 (폼) |
| `POST` | `/posts/:id/delete` | 글 삭제 |

서버 실행 후 브라우저에서 `http://127.0.0.1:3000` 으로 접속하면 됩니다.

## REST API 엔드포인트

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

### 로컬 (Cargo)

```bash
cd content/backend/rust/board-api

# 환경 변수 (선택)
cp .env.example .env

# 서버 실행
cargo run
```

기본 주소: `http://127.0.0.1:3000`

### Docker

```bash
cd content/backend/rust/board-api

# 빌드 후 실행 (SQLite 데이터는 Docker volume에 보관)
docker compose up --build

# 백그라운드 실행
docker compose up --build -d

# 중지
docker compose down
```

브라우저: `http://127.0.0.1:3000`  
컨테이너 내부 DB 경로: `/data/board.db` (`board-data` volume)

이미지만 직접 실행할 때:

```bash
docker build -t board-api .
docker run --rm -p 3000:3000 -v board-data:/data board-api
```

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
  main.rs            # 서버 진입점
  lib.rs             # 라이브러리 루트 (테스트에서 재사용)
  db.rs              # DB 연결 및 스키마 초기화
  services/post.rs   # 게시글 비즈니스 로직 (API·웹 공용)
  entity/post.rs     # SeaORM 엔티티
  dto/               # API·폼 DTO
  routes/post.rs     # REST 핸들러
  routes/web.rs      # HTML 핸들러
  web/               # 템플릿·뷰 모델
templates/           # Askama HTML 템플릿
Dockerfile
docker-compose.yml
tests/
  api.rs             # REST CRUD 통합 테스트
  web.rs             # HTML 게시판 통합 테스트
```

## 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DATABASE_URL` | `sqlite://board.db?mode=rwc` | SQLite 연결 문자열 |
| `HOST` | `127.0.0.1` | 바인딩 호스트 (Docker에서는 `0.0.0.0`) |
| `PORT` | `3000` | 포트 |
| `RUST_LOG` | (없음) | `tracing` 필터 (예: `board_api=debug`) |

앱 시작 시 `posts` 테이블이 없으면 SeaORM 스키마로 자동 생성됩니다.

Docker Compose는 `HOST=0.0.0.0`, `DATABASE_URL=sqlite:///data/board.db?mode=rwc` 를 기본으로 사용합니다.
