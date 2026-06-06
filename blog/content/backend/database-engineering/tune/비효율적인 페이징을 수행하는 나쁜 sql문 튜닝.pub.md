---
title: 튜닝 보고서 집계 쿼리 내 인라인 뷰를 통한 조인 최적화
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - Paging
  - Inline View
  - Join
  - Optimization
---

# 튜닝 보고서: 집계 쿼리 내 인라인 뷰를 통한 조인 최적화

## 1. Analysis Overview

### 1.1. Original Query

```sql
SELECT 사원.사원번호, 사원.이름, 사원.성, 사원.입사일자
  FROM 사원, 급여
 WHERE 사원.사원번호 = 급여.사원번호
   AND 사원.사원번호 BETWEEN 10001 AND 50000
 GROUP BY 사원.사원번호
 ORDER BY SUM(급여.연봉) DESC
 LIMIT 150, 10;
```

### 1.2. Original Execution Plan (Before)

| id  | select_type | table | type  | key     | rows   | Extra                                        |
| :-- | :---------- | :---- | :---- | :------ | :----- | :------------------------------------------- |
| 1   | SIMPLE      | 사원  | range | PRIMARY | 84,016 | Using where; Using temporary; Using filesort |
| 1   | SIMPLE      | 급여  | ref   | PRIMARY | 10     |                                              |

---

## 2. Performance Diagnosis

### 2.1. 불필요한 대규모 조인

- `사원` 정보(이름, 성, 입사일자)는 집계(SUM)에 전혀 필요하지 않습니다. 그럼에도 모든 급여 데이터와 조인하면서 넓은 폭의 행(Wide Row)을 임시 테이블에 담게 되어 메모리 효율이 급격히 떨어집니다.

### 2.2. 정렬 범위의 문제

- 전체 대상(약 4만 명)에 대해 조인 -> 집계 -> 정렬을 수행하므로, `LIMIT`이 있음에도 전체 데이터를 처리하는 부하를 피할 수 없습니다.

---

## 3. Optimization Strategy

### 💡 쿼리 리팩토링: 인라인 뷰(Derived Table)를 활용한 선행 집계

먼저 `급여` 테이블에서 필요한 사원들의 연봉 합계를 구하고, **최종적으로 선택된 건들에 대해서만 `사원` 테이블을 조인**하도록 변경합니다.

```sql
SELECT 사원.사원번호, 사원.이름, 사원.성, 사원.입사일자
  FROM (
        SELECT 사원번호, SUM(연봉) as 연봉합계
          FROM 급여
         WHERE 사원번호 BETWEEN 10001 AND 50000
         GROUP BY 사원번호
         ORDER BY 연봉합계 DESC
         LIMIT 150, 10
       ) AS 인라인뷰,
       사원
 WHERE 인라인뷰.사원번호 = 사원.사원번호;
```

---

## 4. Expected Impact

### Optimized Execution Plan (After)

| id  | select_type | table      | type   | possible_keys | key     | key_len | ref               | rows    | Extra                                        |
| :-- | :---------- | :--------- | :----- | :------------ | :------ | :------ | :---------------- | :------ | :------------------------------------------- |
| 1   | PRIMARY     | <derived2> | ALL    | NULL          | NULL    | NULL    | NULL              | 160     |                                              |
| 1   | PRIMARY     | 사원       | eq_ref | PRIMARY       | PRIMARY | 4       | 인라인뷰.사원번호 | 1       |                                              |
| 2   | DERIVED     | 급여       | range  | PRIMARY       | PRIMARY | 4       | NULL              | 801,016 | Using where; Using temporary; Using filesort |

### 4.1. 조인 부하의 획기적 감소 (실행 계획 분석)

- **개선 전**: 4만 명의 사원 정보를 모두 들고 급여 데이터와 조인하여 약 40만 건의 임시 테이블 생성.
- **개선 후 (id: 1)**: 인라인 뷰(`derived2`)에서 최종 확정된 행(`rows: 160`)에 대해서만 `사원` 테이블과 조인합니다. 특히 `type: eq_ref`와 `rows: 1`은 PK를 통한 단 한 번의 조회가 발생함을 의미하며, 이는 조인 성능이 최상임을 나타냅니다.

### 4.2. 집계 효율성 향상 (id: 2)

- `급여` 테이블 단독으로 집계(`Using temporary; Using filesort`)를 수행합니다. 이때 `사원` 테이블의 텍스트 컬럼들이 배제되므로, 임시 테이블의 크기가 작아지고 정렬 성능이 최적화됩니다.

---

## 5. 결론

집계와 정렬이 포함된 `LIMIT` 쿼리에서는 **"필요한 최소한의 식별자(PK)만 먼저 뽑고, 상세 정보는 나중에 조인한다"**는 전략이 가장 효과적입니다.
