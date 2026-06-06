---
title: SQL Performance Tuning Report
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - Redundant Join
  - Subquery
  - Covering Index
---

# SQL Performance Tuning Report

## 1. Analysis Overview

### Input SQL
```sql
SELECT count(사원번호) AS 카운트 
FROM (
    SELECT 사원.사원번호, 부서관리자.부서번호 
    FROM (
        SELECT * FROM 사원 WHERE 성별 = 'M' AND 사원번호 > 300000
    ) 사원 
    LEFT JOIN 부서관리자 ON 사원.사원번호 = 부서관리자.사원번호
) 서브쿼리;
```

### Execution Plan Analysis
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | **range** | PRIMARY, I_성별_성 | **PRIMARY** | 4 | NULL | 205130 | **Using where** |
| 1 | SIMPLE | 부서관리자 | ref | PRIMARY | PRIMARY | 4 | tuning.사원.사원번호 | 1 | |

---

## 2. Performance Diagnosis

### ① 불필요한 조인 및 서브쿼리 (Redundant Join & Subquery)
*   **문제점**: 최종 결과가 `count(사원번호)`입니다. `사원` 테이블과 `부서관리자` 테이블을 `LEFT JOIN` 하고 있는데, `사원번호`는 `사원` 테이블의 PK이거나 고유한 값일 가능성이 높습니다.
*   **분석**: `LEFT JOIN`은 왼쪽 테이블(사원)의 행을 유지하므로, `부서관리자` 테이블에 매칭되는 데이터가 있든 없든 `사원` 테이블의 행 수는 변하지 않습니다. 따라서 `부서관리자`와의 조인은 카운트 결과에 아무런 영향을 주지 않는 **불필요한 연산**입니다.
*   **서브쿼리 오버헤드**: MySQL 옵티마이저가 `SIMPLE`로 풀어서 실행하긴 했으나, 가독성이 떨어지고 불필요한 파생 테이블 구조를 가지고 있습니다.

### ② 인덱스 활용 미흡 (Index Utilization)
*   **문제점**: `possible_keys`에 `I_성별_성`이 있음에도 `PRIMARY` 키를 사용하여 `range` 스캔을 수행하고 있습니다.
*   **이유**: `사원번호 > 300000` 조건으로 인해 PK를 선택했으나, `Extra` 필드의 `Using where`는 인덱스로 거르지 못한 `성별 = 'M'` 조건을 엔진 레벨에서 필터링하고 있음을 의미합니다. (약 20만 건 스캔)

---

## 3. Optimization Strategy

### 쿼리 리팩토링 (Query Refactoring)
불필요한 서브쿼리와 `LEFT JOIN`을 모두 제거하고, `사원` 테이블만 직접 조회하도록 수정합니다.

```sql
-- 최적화된 쿼리
SELECT count(사원번호) AS 카운트 
FROM 사원 
WHERE 성별 = 'M' 
  AND 사원번호 > 300000;
```

### 인덱스 최적화 (Index Strategy)
만약 해당 쿼리가 빈번하게 수행된다면, `성별`과 `사원번호`를 결합한 복합 인덱스를 생성하여 테이블 접근 없이 인덱스만으로 카운트를 수행(Covering Index)하도록 유도할 수 있습니다.

```sql
-- 복합 인덱스 생성 (성별이 등치 조건이므로 선행 컬럼으로 배치)
CREATE INDEX I_성별_사원번호 ON 사원 (성별, 사원번호);
```

---

## 4. Expected Impact

1.  **조인 제거**: `부서관리자` 테이블에 대한 참조가 완전히 사라져 I/O 비용이 감소합니다.
2.  **스캔 효율 향상**: `(성별, 사원번호)` 인덱스를 사용하면 `성별 = 'M'` 인 데이터 중 `사원번호 > 300000`인 범위만 정확히 스캔할 수 있습니다.
3.  **커버링 인덱스**: 쿼리에 필요한 모든 컬럼(`사원번호`, `성별`)이 인덱스에 포함되어 있다면, 실제 데이터 페이지를 읽지 않고 인덱스 리프 노드만 읽어서 결과를 반환하므로 성능이 비약적으로 향상됩니다.
4.  **실행 계획 변화**: `type: range`는 유지되더라도 `rows` 수치가 대폭 줄어들고 `Extra`에 `Using index`가 표시될 것으로 기대됩니다.
