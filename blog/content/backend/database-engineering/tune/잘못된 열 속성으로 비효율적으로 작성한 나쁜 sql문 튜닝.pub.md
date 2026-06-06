---
title: SQL Performance Tuning Report (V3) 부서 상태 조회 쿼리
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - Collation
  - BINARY
  - Case Sensitivity
  - Index
---

# SQL Performance Tuning Report (V3): 부서 상태 조회 쿼리

## 1. Analysis Overview

### 대상 쿼리
```sql
SELECT 부서명, 비고 
FROM 부서 
WHERE 비고 = 'active' 
  AND ascii(substr(비고, 1, 1)) = 97 
  AND ascii(substr(비고, 2, 1)) = 99;
```

---

## 2. Performance Diagnosis

- **요구사항:** `_ci` (Case-Insensitive) 환경에서 대소문자를 구분하여 소문자 'active'만 추출하고자 함.
- **문제점:** 함수(`ascii`, `substr`) 사용으로 인한 인덱스 미활용 및 CPU 부하 발생.
- **근본 원인:** 컬럼 설정(`utf8mb3_general_ci`)이 비즈니스 요구사항(대소문자 구분)과 일치하지 않음.

---

## 3. Optimization Strategy

### Option 1: 쿼리 레벨 (BINARY 연산자 활용)
스키마 변경이 어려울 때 즉시 적용 가능한 방법입니다.
```sql
SELECT 부서명, 비고 FROM 부서 WHERE BINARY 비고 = 'active';
```

### Option 2: 스키마 레벨 (Collation 변경 - 근본 해결)
해당 컬럼의 설정을 대소문자 구분 방식(`_bin`)으로 변경하여 인덱스 효율을 극대화합니다.
```sql
ALTER TABLE 부서 MODIFY COLUMN 비고 VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
```

---

## 4. Expected Impact
- **최고 성능:** Collation 변경 시 인덱스를 통한 직접적인 대소문자 필터링이 가능해져 속도가 압도적으로 빨라집니다.
- **정확성:** 전체 문자열에 대한 대소문자 일치 여부를 완벽하게 보장합니다.
- **가독성:** 쿼리가 표준 비교문(`=`)으로 단순해져 유지보수가 쉬워집니다.
