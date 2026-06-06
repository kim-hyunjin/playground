---
title: 서브쿼리 조인 변환을 통한 집계 최적화
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - Derived Table
  - Join
  - GROUP BY
  - Optimization
---

# 튜닝 보고서: 서브쿼리 조인 변환을 통한 집계 최적화

## 1. Analysis Overview

### 1.1. Original Query
```sql
SELECT 사원.사원번호, 
       급여.평균연봉, 
       급여.최고연봉, 
       급여.최저연봉 
  FROM 사원, 
       (SELECT 사원번호, 
               ROUND(AVG(연봉), 0) 평균연봉, 
               ROUND(MAX(연봉), 0) 최고연봉, 
               ROUND(MIN(연봉), 0) 최저연봉 
          FROM 급여 
         GROUP BY 사원번호) 급여 
 WHERE 사원.사원번호 = 급여.사원번호 
   AND 사원.사원번호 BETWEEN 10001 AND 10100;
```

### 1.2. Original Execution Plan
| id | select_type | table | type | key | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | PRIMARY | 사원 | range | PRIMARY | 100 | Using where |
| 1 | PRIMARY | <derived2> | ref | key0 | 1 | |
| 2 | DERIVED | 급여 | range | PRIMARY | 999 | Using where; Using temporary; Using filesort |

---

## 2. Performance Diagnosis

### 2.1. 파생 테이블(Derived Table)의 비효율
- `id: 2 (DERIVED)` 단계를 보면, 100명의 사원을 위해 `급여` 테이블에서 약 1,000건의 데이터를 읽어 **임시 테이블(`Using temporary`)**을 만들고 **정렬(`Using filesort`)**을 수행합니다.
- 비록 MySQL 옵티마이저가 외부의 `BETWEEN` 조건을 서브쿼리 내부로 푸시다운(Condition Pushdown)하여 범위를 줄였지만, 여전히 파생 테이블을 생성하고 관리하는 오버헤드가 발생합니다.

### 2.2. 조인 순서 및 필터링 효율
- 현재 쿼리는 "집계를 먼저 하고 조인"하는 구조입니다. 하지만 대상 사원이 100명으로 매우 적으므로, **"조인을 먼저 하고 집계"**하는 것이 훨씬 유리합니다.

---

## 3. Optimization Strategy

### 💡 쿼리 리팩토링: 서브쿼리 제거 및 직접 조인
서브쿼리를 없애고 `사원` 테이블과 `급여` 테이블을 바로 조인한 뒤 `GROUP BY`를 수행합니다.

```sql
SELECT 사원.사원번호, 
       ROUND(AVG(급여.연봉), 0) AS 평균연봉, 
       ROUND(MAX(급여.연봉), 0) AS 최고연봉, 
       ROUND(MIN(급여.연봉), 0) AS 최저연봉
  FROM 사원
  JOIN 급여 ON 사원.사원번호 = 급여.사원번호
 WHERE 사원.사원번호 BETWEEN 10001 AND 10100
 GROUP BY 사원.사원번호;
```

---

## 4. Expected Impact

### 4.1. 실제 실행 계획 분석 (개선 후)
| id | select_type | table | type | key | rows | ref | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | range | PRIMARY | 100 | NULL | Using where |
| 1 | SIMPLE | 급여 | ref | PRIMARY | 10 | 사원.사원번호 | |

### 4.2. 주요 개선 사항
1.  **임시 테이블 및 정렬 제거**: 이전의 `Using temporary; Using filesort`가 완전히 사라졌습니다. 이는 CPU와 메모리 사용량을 획기적으로 줄여줍니다.
2.  **드라이빙 테이블 최적화**: `사원` 테이블(100건)을 먼저 읽고, `급여` 테이블의 인덱스를 통해 필요한 10여 건의 데이터만 즉시 조인하는 가장 효율적인 경로를 선택했습니다.
3.  **인덱스 그룹화(Index Grouping)**: 별도의 정렬 작업 없이 `급여` 테이블의 PK 순서를 그대로 활용하여 그룹화 연산을 처리했습니다.

---
## 5. 결론
파생 테이블(Derived Table)을 사용하여 미리 집계하는 방식은 대상 범위가 넓을 때 유리할 수 있지만, 이번처럼 **필터링 조건이 명확하고 대상 범위가 좁은 경우(100건)**에는 직접 조인하여 인덱스를 타는 것이 훨씬 빠릅니다.
