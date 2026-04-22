# SQL Performance Tuning Report: 사원 정보 조회 쿼리

## 1. Analysis Overview

### 대상 쿼리
```sql
SELECT 사원번호, 이름, 성 
FROM 사원 
WHERE 성별 = 'M' 
  AND 성 = 'Baba';
```

### 실행 계획 (EXPLAIN) 및 인덱스 요약
현재 쿼리는 `I_성별_성` (성별, 성) 복합 인덱스를 사용하고 있습니다. 
`성별` 컬럼의 Cardinality는 1인 반면, `성` 컬럼의 Cardinality는 3440으로 훨씬 높습니다.

---

## 2. Performance Diagnosis

- **문제점:** 복합 인덱스 구성 시 선택도가 낮은 `성별` 컬럼이 선두에 위치하고 있습니다.
- **원인:** 인덱스는 첫 번째 컬럼으로 먼저 정렬된 후 두 번째 컬럼으로 정렬됩니다. `성별`은 남/여 두 가지 값만 존재하므로, 인덱스 탐색 시 절반에 가까운 데이터를 필터링 없이 훑어야 할 가능성이 큽니다.
- **Extra 필드:** `Using index condition` (ICP)가 작동 중이지만, 인덱스 구조 자체의 비효율을 완전히 상쇄하지는 못합니다.

---

## 3. Optimization Strategy

### 인덱스 재구성
카디널리티가 높은 `성` 컬럼을 선두로 하는 인덱스를 생성합니다.

```sql
-- 기존 인덱스 삭제 또는 수정
ALTER TABLE 사원 DROP INDEX I_성별_성;
CREATE INDEX I_성_성별 ON 사원 (성, 성별);
```

---

## 4. Expected Impact

- **스캔 효율:** `성 = 'Baba'`인 데이터를 먼저 찾고 그 안에서 `성별 = 'M'`을 찾는 과정이 훨씬 빠릅니다.
- **응답 속도:** 데이터가 수십만 건 이상인 상황에서 인덱스 페이지 접근 횟수를 줄여 전체적인 쿼리 성능이 개선됩니다.
