---
title: 습관적인 중복 제거(DISTINCT) 개선
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - DISTINCT
  - Temporary Table
  - Join
---

# SQL Tuning Report: 습관적인 중복 제거(DISTINCT) 개선

## 1. Analysis Overview

### ① 대상 쿼리 (Target SQL)
```sql
explain select distinct 사원.사원번호, 이름, 성, 부서번호 
from 사원 
join 부서관리자 on (사원.사원번호 = 부서관리자.사원번호);
```

### ② 실행 계획 (EXPLAIN)
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | SIMPLE | 부서관리자 | index | PRIMARY | I_부서번호 | 12 | NULL | 24 | Using index; Using temporary |
| 1 | SIMPLE | 사원 | eq_ref | PRIMARY | PRIMARY | 4 | tuning.부서관리자.사원번호 | 1 | |

---

## 2. Performance Diagnosis

### ① 불필요한 임시 테이블 생성 (Using temporary)
- **문제점**: `SELECT DISTINCT`를 사용함에 따라 중복을 제거하기 위한 **임시 테이블(Temporary Table)**이 생성되었습니다.
- **원인**: 조인 조건인 `사원번호`가 비즈니스 로직상 중복될 수 없는 구조임에도 불구하고, 습관적으로 `DISTINCT`를 사용하여 불필요한 부하를 유발했습니다.
- **지표**: `Extra` 필드의 `Using temporary`는 데이터 정렬 및 중복 체크를 위한 추가적인 자원 소모를 나타냅니다.

---

## 3. Optimization Strategy

### ① DISTINCT 제거 (Removal of Redundant DISTINCT)
- 데이터 모델링상 1:1 관계이거나 중복이 발생하지 않는 조인 구조라면 `DISTINCT`를 제거합니다.
- 조인 방식이 `eq_ref`로 매우 효율적이므로, `DISTINCT`만 제거해도 최적의 성능을 낼 수 있습니다.

### ② 수정된 쿼리 (Improved SQL)
```sql
-- [튜닝 전] DISTINCT 사용 (임시 테이블 생성)
-- SELECT DISTINCT 사원.사원번호, ...

-- [튜닝 후] DISTINCT 제거
SELECT 사원.사원번호, 이름, 성, 부서번호 
FROM 사원 
JOIN 부서관리자 ON (사원.사원번호 = 부서관리자.사원번호);
```

---

## 4. Expected Impact

### ① 성능 개선 지표 (Performance Improvement)
| 항목 | 튜닝 전 (Before) | 튜닝 후 (After/Expected) |
| :-- | :-- | :-- |
| **Access Type** | `eq_ref` (최적) | `eq_ref` (유지) |
| **Extra Info** | **`Using temporary`** | **`Using index`** (임시 테이블 제거) |
| **리소스 소모** | 높음 (Temp Table 생성) | **낮음** |

### ② 핵심 요약
- 불필요한 중복 제거 단계를 생략하여 쿼리 실행 경로를 단순화했습니다.
- `Using temporary` 부하를 제거함으로써 대량의 데이터 처리 시 발생할 수 있는 메모리/디스크 I/O 병목 현상을 사전에 방지했습니다.
