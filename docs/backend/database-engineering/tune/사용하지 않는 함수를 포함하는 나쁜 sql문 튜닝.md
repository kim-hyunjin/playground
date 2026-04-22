# GROUP BY 절의 컬럼 가공 개선 보고서

본 보고서는 `GROUP BY` 절에서 `IFNULL` 함수를 사용함에 따라 발생하는 실행 계획의 비효율성을 진단하고, 이를 최적화하기 위한 방안을 제시합니다.

## 1. Analysis Overview

### 분석 대상 쿼리
```sql
SELECT IFNULL(성별, 'NO DATA') AS 성별, COUNT(1) 건수 
  FROM 사원 
 GROUP BY IFNULL(성별, 'NO DATA');
```

### 실행 계획(EXPLAIN) 분석 결과
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | **index** | NULL | **I_성별_성** | 51 | NULL | 299,246 | **Using index; Using temporary; Using filesort** |

---

## 2. Performance Diagnosis

### ⚠️ 주요 문제점: 인덱스 정렬 무력화
1. **불필요한 추가 연산 발생 (`Using temporary; Using filesort`)**
   * `GROUP BY` 절에 `IFNULL(성별, ...)` 함수를 사용하면서 이미 인덱스(`I_성별_성`)에 정렬되어 있는 데이터의 정렬 상태를 옵티마이저가 활용하지 못하게 되었습니다.
   * 이로 인해 전체 데이터를 임시 테이블에 기록하고 다시 정렬하는 부하가 발생합니다.

2. **비효율적 인덱스 스캔 (`type: index`)**
   * 인덱스 전체를 읽는 것은 동일하지만, 함수 가공으로 인해 인덱스 기반의 빠른 그룹화 연산이 차단되어 CPU 자원을 추가로 소모합니다.

---

## 3. Optimization Strategy

### 💡 쿼리 리팩토링: 가공되지 않은 컬럼으로 그룹화
인덱스의 정렬된 상태를 그대로 활용하기 위해 `GROUP BY` 절에서는 가공되지 않은 순수 컬럼을 사용해야 합니다.

#### 최적화된 SQL
```sql
/* 개선 안 */
SELECT IFNULL(성별, 'NO DATA') AS 성별, COUNT(1) 건수
  FROM 사원
 GROUP BY 성별; -- 그룹화는 원본 컬럼으로 수행

-- 성별컬럼이 not null인 경우
SELECT 성별, COUNT(1) 건수
  FROM 사원
 GROUP BY 성별;
```

### 튜닝 포인트
* **인덱스 기반 그룹화**: `GROUP BY 성별`로 변경하면 MySQL은 인덱스에 저장된 정렬 순서를 신뢰하여 `Using temporary; Using filesort` 과정을 생략하고 즉시 결과를 반환합니다.
* **SELECT 절 가공 허용**: 결과 화면에 표시될 값은 `SELECT` 절에서 `IFNULL`로 가공하더라도 성능에 큰 지장을 주지 않습니다.

---

## 4. Expected Impact

1. **정렬 비용 제거**: 실행 계획에서 `Using temporary; Using filesort`가 삭제되어 CPU 및 메모리 사용량이 급감합니다.
2. **응답 속도 개선**: 약 30만 건의 데이터 기준, 정렬 연산이 생략되므로 쿼리 응답 속도가 현저히 빨라집니다.
3. **디스크 I/O 감소**: 임시 테이블 생성이 생략되어 시스템 전체의 부하가 경감됩니다.
