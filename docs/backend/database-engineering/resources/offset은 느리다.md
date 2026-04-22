# OFFSET/LIMIT가 느린 이유와 대안 전략 (예제 포함)

대부분의 애플리케이션에서 페이징을 위해 `SELECT ... ORDER BY ... LIMIT N OFFSET M` 패턴을 사용합니다. 데이터가 수십만~수천만 건으로 커지거나 `OFFSET`이 커질수록 쿼리가 급격히 느려집니다. 왜 느려지는지, 언제 써도 되는지, 그리고 어떤 대안이 더 나은지(키셋/시크 페이징 등)를 예제와 함께 정리합니다.

---

## 1. OFFSET/LIMIT가 느려지는 구조적 이유

OFFSET은 “앞에서 M개를 건너뛴 뒤 N개를 반환”을 의미합니다. 대부분의 DB 엔진(PostgreSQL, MySQL/InnoDB 등)은 다음과 같은 비용을 지불합니다.

- 스캔 건너뛰기 비용: OFFSET으로 건너뛰는 행도 실제로는 읽고(스캔하고) 버려야 합니다. OFFSET이 100,000이면 최소 100,000행을 스캔 후 폐기합니다.
- 정렬(SORT) 비용: `ORDER BY`가 있으면 정렬을 수행합니다. 정렬은 메모리 한계를 넘으면 디스크 스필이 발생하여 매우 느려집니다. OFFSET이 커질수록 정렬 입력도 많아질 가능성이 큽니다.
- 인덱스만으로 해결 불가한 경우: 정렬 키에 적절한 인덱스가 없으면 Table/Index Scan + Sort가 필요합니다. 인덱스가 있어도 OFFSET이 크면 많은 인덱스 엔트리를 순차 스캔해야 합니다.
- MVCC 가시성 검사 비용(PostgreSQL 등): 각 튜플(행)에 대해 현재 트랜잭션에서 보이는지 판단해야 합니다. 건너뛰는 행들에도 가시성 검사가 수행됩니다.
- 랜덤/순차 I/O 혼합: 대규모 OFFSET은 워킹셋이 커져 캐시 효율이 떨어지고, 디스크 접근이 늘어납니다.

요약: OFFSET 값이 커질수록 “버리는 작업”의 비용이 선형적으로(또는 그 이상으로) 증가합니다.

---

## 2. OFFSET/LIMIT가 괜찮을 때

- 전체 결과 집합이 매우 작을 때.
- 일시적인 관리용 UI처럼 성능 민감도가 낮을 때.

운영 트래픽에서 대규모 페이지 탐색, 무한 스크롤 등에는 권장하지 않습니다.

---

## 3. 더 나은 대안: 키셋(시크) 페이징

키셋(Seek, Cursor-based) 페이징은 “마지막으로 본 키”를 기준으로 다음 페이지를 조회합니다. OFFSET처럼 앞선 행을 버리지 않습니다.

핵심 아이디어:
- 정렬에 사용되는 컬럼(들)을 인덱싱하고
- "WHERE 정렬키 > (또는 <) 마지막_값" 조건으로 다음 묶음을 가져옵니다.

장점:
- 대규모 테이블에서도 일정하고 빠른 응답(스캔 건너뛰기 없음)
- 인덱스를 활용한 범위 스캔으로 디스크 접근 최소화

제약:
- 임의 페이지로 점프(예: 37페이지로 바로 이동)에는 적합하지 않음
- 정렬 키가 고유하지 않으면 타이(동일 값) 처리 필요

### 3.1 PostgreSQL 예제

스키마와 인덱스:
```sql
CREATE TABLE posts (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  title         TEXT NOT NULL,
  like_count    INTEGER NOT NULL DEFAULT 0
);

-- 최신순 조회(내림차순)를 빠르게 하려면 정렬 키에 맞는 인덱스가 필수
CREATE INDEX idx_posts_created_at_desc ON posts (created_at DESC, id DESC);
-- 또는 ASC로 저장해도 DESC 정렬을 효율적으로 처리 가능하지만, 
-- 명시적인 DESC 인덱스가 더 예측 가능한 계획을 만드는 데 도움이 됩니다.
```

OFFSET/LIMIT (비권장, 설명용):
```sql
-- 21~40번째 행을 가져오기 (LIMIT 20 OFFSET 20)
SELECT id, created_at, title
FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 20;
```

키셋(시크) 페이징:
```sql
-- 첫 페이지
SELECT id, created_at, title
FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 클라이언트는 마지막 행의 (created_at, id)를 next_cursor로 저장
-- 다음 페이지: 마지막(가장 작은) 키보다 "더 작은" 범위를 요청
SELECT id, created_at, title
FROM posts
WHERE (created_at, id) < ($1::timestamptz, $2::bigint)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

주의: 정렬 키가 유일하지 않을 때는 튜플 비교 "(col1, col2) < (v1, v2)"처럼 보조 키(여기서는 id)를 포함해 안정적 순서를 보장합니다. 해당 복합 인덱스가 있어야 성능이 잘 나옵니다.

like_count 기준(동점 처리 포함) 예:
```sql
-- 인덱스
CREATE INDEX idx_posts_like_count_desc_id_desc
  ON posts (like_count DESC, id DESC);

-- 첫 페이지
SELECT id, like_count, title
FROM posts
ORDER BY like_count DESC, id DESC
LIMIT 20;

-- 다음 페이지: (like_count, id) 튜플 비교 사용
SELECT id, like_count, title
FROM posts
WHERE (like_count, id) < ($1::int, $2::bigint)
ORDER BY like_count DESC, id DESC
LIMIT 20;
```

### 3.2 MySQL(InnoDB) 예제

스키마/인덱스:
```sql
CREATE TABLE posts (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at  DATETIME NOT NULL,
  title       VARCHAR(255) NOT NULL,
  like_count  INT NOT NULL DEFAULT 0,
  KEY idx_posts_created_at_desc (created_at, id)
);
```

키셋 페이징:
```sql
-- 첫 페이지
SELECT id, created_at, title
FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 다음 페이지 (마지막 키를 바인딩)
SELECT id, created_at, title
FROM posts
WHERE (created_at < ?) OR (created_at = ? AND id < ?)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

MySQL은 튜플 비교의 최적화가 제한적일 수 있어 위와 같이 OR/AND 조건으로 풀어 쓰는 경우가 많습니다. 해당 복합 인덱스가 있어야 범위 스캔으로 동작합니다.

---

## 4. 추가 전략과 팁

- 적절한 인덱싱
  - 정렬 컬럼과 보조 고유 키(대개 PK)를 포함한 복합 인덱스를 만든다: `(sort_key [DESC], id [DESC])`.
  - 커버링 인덱스(SELECT 컬럼이 전부 인덱스에 포함)로 랜덤 I/O를 줄일 수 있음. 하지만 과도한 인덱스는 쓰기 비용을 증가시킴.

- 안정적 정렬(Stable ordering)
  - `ORDER BY created_at DESC`만으로는 동률 시 순서가 뒤섞일 수 있음. 항상 보조 키를 추가: `ORDER BY created_at DESC, id DESC`.

- 최신순과 오래된순
  - 최신순: `WHERE (created_at, id) < (cursor_created_at, cursor_id)`
  - 오래된순: `WHERE (created_at, id) > (cursor_created_at, cursor_id)`

- 삭제/삽입과 페이징 일관성
  - MVCC 환경에서 키셋 페이징은 OFFSET 대비 중복/누락이 적음. 단, 실시간 데이터 변동으로 완벽한 스냅샷 일관성이 필요하면 트랜잭션 격리/스냅샷을 고려.

- 임의 페이지 점프가 꼭 필요할 때
  - 키셋 페이징은 임의 페이지 점프에 부적합. 대안:
    - 최근 범위에서는 키셋, 과거로 멀리 갈 때는 사전 계산된 앵커(anchor) 테이블/물질화 뷰를 사용해 점프 포인트 제공.
    - Redis 등 캐시로 인기 구간을 프리컴퓨트.

- COUNT 성능
  - 전체 페이지 수 계산을 위한 `COUNT(*)`는 비용이 큽니다. 대안으로 근사치(통계 테이블, HyperLogLog 등)나 비동기 집계 테이블을 사용할 수 있습니다.

- 서버 사이드 커서(특히 PostgreSQL)
  - 대용량 스트리밍에 유용하지만, 클라이언트-서버 세션 유지가 필요하고, 여전히 OFFSET의 근본 문제(앞부분 버리기)는 해결하지 못함.

---

## 5. 성능 비교(개념적)

가정: 1,000만 행, `ORDER BY created_at DESC`, 적절한 인덱스 존재.

- OFFSET 방식: `LIMIT 50 OFFSET 1000000`
  - 최소 100만 건을 스캔/버려야 하고, 정렬/가시성 검사 비용 증가. 플랜에 따라 인덱스 범위 스캔이라도 많은 엔트리를 건너뛰며 페이지 아웃 발생.

- 키셋 방식: `WHERE (created_at, id) < (cursor)` + `LIMIT 50`
  - 커서 바로 다음 범위부터 인덱스 범위 스캔 시작. 선형 건너뛰기 없음. 일반적으로 밀리초~수십밀리초 단위 응답 유지.

---

## 6. 마이그레이션 가이드(OFFSET → 키셋)

1) 정렬 컬럼과 보조 키를 확정하고 복합 인덱스 생성
- 예: `CREATE INDEX ... ON posts (created_at DESC, id DESC);`

2) API 응답 포맷에 커서 추가
- 마지막 항목의 `(created_at, id)`를 커서로 내려주기
- 다음 페이지 요청 시 커서를 쿼리 파라미터로 받기

3) 쿼리 변경
- 기존: `ORDER BY ... LIMIT N OFFSET M`
- 변경: `WHERE (sort_key, id) < (cursor_key, cursor_id) ORDER BY ... LIMIT N`

4) 동률/정렬 안정성 검증
- 동률 시 순서가 뒤섞이지 않도록 보조 키 포함 여부 점검

5) 경계/빈 결과 처리
- 첫 페이지(커서 없음), 마지막 페이지(미만/초과 조건으로 결과 0), 커서 파싱 실패 등의 예외 처리

---

## 7. 요약

- OFFSET/LIMIT는 앞선 행을 실제로 읽고 버리므로 OFFSET이 커질수록 선형적으로 느려집니다. 정렬, MVCC, I/O까지 더해져 대규모 데이터에서 병목이 됩니다.
- 대안으로 키셋(시크) 페이징을 사용하면 인덱스 범위 스캔으로 일정하고 빠른 성능을 얻을 수 있습니다.
- 복합 인덱스 설계, 안정적 정렬, 커서 전달/검증, 임의 점프 요구에 대한 보조 전략(앵커/캐시/물질화 뷰)을 함께 고려하세요.

부록: 간단한 EXPLAIN 체크 팁(PostgreSQL)
```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, created_at
FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 50 OFFSET 100000; -- 예상보다 큰 공유/읽기 버퍼, 느린 실행 시간

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, created_at
FROM posts
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC
LIMIT 50; -- 짧은 실행 시간과 적은 버퍼 접근 확인
```
