# SQL Tuning Report: 서브쿼리 조인 변환 개선

## 1. Analysis Overview

### 대상 쿼리
```sql
EXPLAIN 
SELECT 사원.사원번호, 사원.이름, 사원.성 
  FROM 사원 
 WHERE 사원번호 > 450000 
   AND (SELECT MAX(연봉) 
          FROM 급여 
         WHERE 사원번호 = 사원.사원번호) > 100000;
```

### 실행 계획 (EXPLAIN) 결과
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | PRIMARY | 사원 | **range** | PRIMARY | PRIMARY | 4 | NULL | 107216 | Using where |
| 2 | **DEPENDENT SUBQUERY** | 급여 | ref | PRIMARY | PRIMARY | 4 | tuning.사원.사원번호 | 10 | |

### 데이터 현황 통계
- `사원` 전체 건수: **300,024건**
- `급여` 전체 건수: **2,844,047건**
- `사원번호 > 450000` 만족 건수: **49,999건**

---

## 2. Performance Diagnosis

### ⚠️ 주요 문제점
- **DEPENDENT SUBQUERY (상관 서브쿼리)**: `WHERE` 절에 포함된 서브쿼리가 외부 쿼리의 `사원` 테이블 결과(약 5만~10만 건)만큼 반복해서 실행되고 있습니다. 
- **반복 연산 부하**: `사원` 테이블에서 필터링된 5만 개의 행 각각에 대해 `급여` 테이블의 `MAX(연봉)`을 구하는 연산이 발생하여 CPU 및 I/O 자원을 과다하게 소모합니다.
- **인덱스 스캔 효율**: `급여` 테이블의 PK가 `(사원번호, 시작일자)`로 구성되어 있어 사원번호별 탐색은 빠르지만(ref scan, 10건), 이 작업 자체가 5만 번 반복되는 것 자체가 비효율입니다.

---

## 3. Optimization Strategy

### 💡 쿼리 리팩토링 제안
상관 서브쿼리를 제거하고, 인덱스를 활용할 수 있는 **단순 조인(JOIN)과 GROUP BY** 방식으로 변경하는 것이 가장 효율적입니다.

#### 최종 개선안: JOIN + GROUP BY (권장)
```sql
SELECT 사원.사원번호, 사원.이름, 사원.성 
  FROM 사원, 급여 
 WHERE 사원.사원번호 > 450000 
   AND 사원.사원번호 = 급여.사원번호 
 GROUP BY 사원.사원번호 
HAVING MAX(급여.연봉) > 100000;
```

---

## 4. Expected Impact

제공된 실행 계획을 바탕으로 비교한 결과입니다.

| 지표 | 개선 전 (상관 서브쿼리) | 개선 후 (JOIN + GROUP BY) | 비고 |
| :--- | :--- | :--- | :--- |
| **select_type** | DEPENDENT SUBQUERY | **SIMPLE** | 반복 실행 제거 |
| **Extra** | Using where | **Using where** | 임시 테이블/정렬 없음 |
| **구조적 이점** | 매 행마다 서브쿼리 호출 | 드라이빙 테이블 PK 순서 활용 | 최적의 리소스 활용 |

### 요약
- **인덱스 활용**: `사원` 테이블의 PK를 기준으로 조인이 발생하므로, 별도의 임시 테이블 생성(`Using temporary`)이나 정렬(`Using filesort`) 없이 `GROUP BY`가 가능합니다.
- **파생 테이블과의 차이**: 파생 테이블(Derived Table) 방식은 그룹화를 위해 100만 건 이상의 데이터를 임시 테이블에 적재해야 하는 부하가 있지만, 단순 조인 방식은 인덱스를 타고 흐르기 때문에 훨씬 가볍습니다.
- **결론**: 상관 서브쿼리를 조인으로 풀 때, 드라이빙 테이블의 PK를 활용할 수 있다면 단순 조인 방식이 성능과 리소스 측면에서 최선입니다.
