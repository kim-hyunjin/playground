---
title: 묵시적 형변환 제거를 통한 인덱스 범위 스캔 유도
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - Implicit Type Conversion
  - LIKE
  - Index Range Scan
  - DATE
---

# SQL Tuning Report: 묵시적 형변환 제거를 통한 인덱스 범위 스캔 유도

## 1. Analysis Overview

### ① 대상 쿼리 (Target SQL)

```sql
explain select 사원번호 from 사원 where 입사일자 like '1989%' and 사원번호 > 100000;
```

### ② 실행 계획 (EXPLAIN)

| id  | select_type | table | type      | possible_keys        | key             | key_len | ref  | rows        | Extra                        |
| :-- | :---------- | :---- | :-------- | :------------------- | :-------------- | :------ | :--- | :---------- | :--------------------------- |
| 1   | SIMPLE      | 사원  | **index** | PRIMARY, I\_입사일자 | **I\_입사일자** | 3       | NULL | **299,512** | **Using where; Using index** |

### ③ 테이블 구조 및 통계 (Schema & Statistics)

- **입사일자 컬럼 타입**: **`DATE`**
- 전체 건수: 300,024건
- 조건(`1989년 입사`) 만족 건수: **28,394건** (전체의 약 9.4%)

---

## 2. Performance Diagnosis

### ① 묵시적 형변환에 의한 인덱스 활용 저하 (핵심 원인)

- **문제점**: `입사일자`는 `DATE` 타입인데, 조건절에서 `LIKE '1989%'`(문자열 패턴)를 사용하고 있습니다.
- **현상**: DBMS는 비교를 위해 `입사일자` 컬럼의 모든 데이터를 문자열로 변환하는 **묵시적 형변환**을 내부적으로 수행합니다.
- **결과**: 인덱스 컬럼이 가공된 것과 같은 효과가 발생하여, 인덱스의 정렬 구조를 이용한 **'Index Range Scan'이 불가능**해집니다. 이로 인해 인덱스 전체를 읽는 `type: index`(Full Scan) 방식이 선택되었습니다.

### ② 불필요한 전체 인덱스 탐색

- 약 3만 건(9.4%)의 데이터만 추출하면 됨에도 불구하고, 형변환 문제로 인해 30만 건에 달하는 전체 인덱스 로우를 탐색하고 있습니다. 이는 I/O 및 CPU 리소스의 명백한 낭비입니다.

---

## 3. Optimization Strategy

### ① 비교 연산자 및 데이터 타입 일치

- `LIKE` 대신 `DATE` 타입에 적합한 **범위 비교 연산자(`>=`, `<=`)**를 사용합니다.
- 컬럼 가공이나 형변환 없이 데이터 자체를 비교하므로 옵티마이저가 인덱스를 효율적으로 사용할 수 있습니다.

### ② 수정된 쿼리 (Improved SQL)

```sql
-- [튜닝 전] LIKE 사용으로 묵시적 형변환 발생 (Full Scan)
-- SELECT 사원번호 FROM 사원 WHERE 입사일자 LIKE '1989%' AND 사원번호 > 100000;

-- [튜닝 후] 범위 연산자 사용으로 Index Range Scan 유도
SELECT 사원번호
FROM 사원
WHERE 입사일자 >= '1989-01-01'
  AND 입사일자 <= '1989-12-31'
  AND 사원번호 > 100000;
```

---

## 4. Expected Impact

### ① 성능 개선 지표 (Performance Improvement)

| 항목                 | 튜닝 전 (Before)         | 튜닝 후 (After/Expected)      |
| :------------------- | :----------------------- | :---------------------------- |
| **Access Type**      | **index** (Full Scan)    | **range** (Range Scan)        |
| **Examined Rows**    | **299,512건**            | **55,054건**                  |
| **형변환 발생 여부** | **발생 (인덱스 무력화)** | **미발생 (인덱스 최적 활용)** |

### ② 핵심 요약

- **인덱스 탐색 효율화**: 인덱스의 특정 구간만 바로 타격하는 `range` 스캔으로 전환되어 응답 속도가 획기적으로 빨라집니다.
- **시스템 부하 절감**: 매 로우마다 수행하던 불필요한 형변환 연산이 제거되어 데이터베이스 서버의 CPU 및 메모리 효율성이 향상됩니다.
