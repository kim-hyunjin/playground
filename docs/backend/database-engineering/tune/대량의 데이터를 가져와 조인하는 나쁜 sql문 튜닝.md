# 대량의 데이터를 가져와 조인하는 나쁜 SQL문 튜닝 보고서

## 1. Analysis Overview

### 대상 쿼리 (AS-IS)
```sql
SELECT DISTINCT 매핑.부서번호 
FROM 부서관리자 관리자, 
     부서사원_매핑 매핑 
WHERE 관리자.부서번호 = 매핑.부서번호 
ORDER BY 매핑.부서번호;
```

### 실행 계획 분석 (AS-IS)
| id | select_type | table | type | rows | Extra |
|:---|:---|:---|:---|:---|:---|
| 1 | SIMPLE | 관리자 | index | 24 | Using index; Using temporary; Using filesort |
| 1 | SIMPLE | 매핑 | ref | 41392 | Using index |
- **문제점**: 4만 건 이상의 `매핑` 테이블 데이터를 모두 조인 연산에 참여시킨 후 마지막에 중복을 제거하므로 불필요한 I/O와 정렬 부하가 발생함.

---

## 2. Optimization Strategy: Loose Index Scan 활용

단순히 `EXISTS`를 사용하는 것보다, 대량의 테이블에서 먼저 유니크한 키값만 빠르게 추출한 뒤 조인하는 방식이 가장 효율적입니다.

### 개선된 SQL (TO-BE)
```sql
SELECT 매핑.부서번호 
FROM (
    SELECT DISTINCT 부서번호 
    FROM 부서사원_매핑 매핑
) 매핑 
WHERE EXISTS (
    SELECT 1 
    FROM 부서관리자 관리자 
    WHERE 부서번호 = 매핑.부서번호
)
ORDER BY 매핑.부서번호;
```

### 실행 계획 분석 (TO-BE)
| id | select_type | table | type | rows | Extra |
|:---|:---|:---|:---|:---|:---|
| 1 | PRIMARY | 관리자 | index | 24 | Using index; LooseScan; Using temporary; Using filesort |
| 1 | PRIMARY | <derived2> | ref | 1 | |
| 2 | DERIVED | 매핑 | range | 9 | **Using index for group-by (Loose Index Scan)** |

- **개선 포인트**:
    - `id 2` 단계에서 `Using index for group-by`가 작동하여, 41,392건의 데이터를 단 **9건**의 유니크한 부서번호로 압축하여 추출함.
    - 메인 쿼리는 전체 4만 건이 아닌, 압축된 9건의 데이터와 `부서관리자` 테이블만 비교하므로 연산량이 극적으로 감소함.

---

## 3. Expected Impact

1. **데이터 스캔량 최소화**: Loose Index Scan을 통해 대량 테이블(`부서사원_매핑`)을 물리적으로 전부 읽지 않고 필요한 값만 건너뛰며(Skip) 읽음.
2. **조인 비용 절감**: 조인 대상 데이터가 41,392건에서 9건으로 줄어들어 CPU 및 메모리 사용량이 대폭 감소함.
3. **응답 속도 향상**: 전체 데이터를 처리하는 방식보다 수십 배 이상의 성능 향상을 기대할 수 있음.
