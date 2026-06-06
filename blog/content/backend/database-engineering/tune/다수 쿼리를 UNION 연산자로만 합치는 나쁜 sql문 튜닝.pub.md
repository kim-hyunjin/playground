---
title: 불필요한 UNION 연산 제거
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - UNION
  - IN
  - Temporary Table
---

# SQL Tuning Report: 불필요한 UNION 연산 제거

## 1. Analysis Overview

### ① 대상 쿼리 (Target SQL)
```sql
explain 
select 'M' AS 성별, 사원번호 from 사원 where 성별 = 'M' and 성 = 'Baba' 
UNION 
select 'F' as 성별, 사원번호 from 사원 where 성별 = 'F' and 성 = 'Baba';
```

### ② 실행 계획 (EXPLAIN)
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | PRIMARY | 사원 | ref | I_성별_성 | I_성별_성 | 51 | const,const | 135 | Using where; Using index |
| 2 | UNION | 사원 | ref | I_성별_성 | I_성별_성 | 51 | const,const | 91 | Using where; Using index |
| NULL | UNION RESULT | <union1,2> | ALL | NULL | NULL | NULL | NULL | NULL | |

---

## 2. Performance Diagnosis

### ① 임시 테이블 및 정렬 부하 (Temporary Table & Sort)
- **문제점**: `UNION` 키워드는 합쳐진 결과에서 중복을 제거하기 위해 내부적으로 **임시 테이블(Temporary Table)**을 생성하고 전체 데이터를 스캔(ALL)합니다.
- **원인**: 성별('M', 'F')은 서로 배타적인 데이터임에도 불구하고 `UNION`을 사용함으로써 불필요한 중복 체크 과정이 발생했습니다.
- **지표**: `id: NULL`인 `UNION RESULT` 단계가 발생하며, 이는 데이터 정렬 및 중복 제거를 위한 추가 연산 비용을 의미합니다.

---

## 3. Optimization Strategy

### ① 단일 SELECT 문 통합 (Query Consolidation)
- `UNION`으로 분리된 쿼리를 `IN` 절을 사용하여 하나의 `SELECT` 문으로 통합합니다.
- 임시 테이블 생성 없이 인덱스 범위를 한 번에 스캔하도록 유도합니다.

### ② 수정된 쿼리 (Improved SQL)
```sql
-- [튜닝 전] UNION 사용 (임시 테이블 생성)
-- SELECT ... UNION SELECT ...

-- [튜닝 후] IN 절 사용 (단일 스캔)
SELECT 성별, 사원번호
FROM 사원
WHERE 성 = 'Baba'
  AND 성별 IN ('M', 'F');
```

---

## 4. Expected Impact

### ① 성능 개선 지표 (Performance Improvement)
| 항목 | 튜닝 전 (Before) | 튜닝 후 (After/Expected) |
| :-- | :-- | :-- |
| **작업 단계** | 2개 쿼리 실행 + UNION 합병 | **단일 쿼리 실행** |
| **임시 테이블** | **YES** (`UNION RESULT`) | **NO** |
| **Access Type** | `ref` (각각 실행) | **`range`** (통합 스캔) |
| **Extra Info** | `Using index` | **`Using index`** (커버링 인덱스 유지) |

### ② 핵심 요약
- 중복 제거 비용이 발생하는 `UNION`을 제거함으로써 CPU 및 메모리 사용량을 절감했습니다.
- `IN` 절을 통해 옵티마이저가 더 효율적인 경로를 선택할 수 있게 되었으며, 코드 가독성 또한 향상되었습니다.
