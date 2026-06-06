---
title: SQL Performance Tuning Report
date: 2026-04-23
categories:
  - Backend
  - Database Engineering
tags:
  - SQL Tuning
  - Index
  - Full Table Scan
  - Composite Index
---

# SQL Performance Tuning Report

## 1. Analysis Overview

### 대상 쿼리
```sql
SELECT * 
  FROM 사원 
 WHERE 이름 = 'Georgi' 
   AND 성 = 'Wielonsky';
```

### 실행 계획 (EXPLAIN) 분석
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | **ALL** | NULL | NULL | NULL | NULL | **299246** | Using where |

### 테이블 구조 (DESC 사원)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 사원번호 | int(11) | NO | PRI | NULL | |
| 생년월일 | date | NO | | NULL | |
| 이름 | varchar(14) | NO | | NULL | |
| 성 | varchar(16) | NO | | NULL | |
| 성별 | enum('M','F') | NO | MUL | NULL | |
| 입사일자 | date | NO | MUL | NULL | |

### 데이터 통계 (Cardinality)
| 이름_개수 (Distinct) | 성_개수 (Distinct) | 전체 건수 |
| :--- | :--- | :--- |
| 1,275 | 1,637 | 300,024 |

---

## 2. Performance Diagnosis

### ① 전체 테이블 스캔 (Full Table Scan)
*   `type: ALL`: `이름`과 `성` 열에 인덱스가 없어 약 30만 건의 데이터를 처음부터 끝까지 읽는 **Full Table Scan**이 발생하고 있습니다.
*   `rows: 299246`: 쿼리 결과는 소수일 것으로 예상되나, 이를 찾기 위해 전체 데이터를 조사하므로 I/O 부하가 매우 높습니다.

### ② 인덱스 부재
*   현재 `사원` 테이블에는 `사원번호(PK)`, `성별(MUL)`, `입사일자(MUL)`에만 인덱스가 존재하며, 검색 조건인 `이름`과 `성`은 인덱스 구성에서 제외되어 있습니다.

### ③ 높은 선택도 (Selectivity) 활용 미흡
*   `성` 열의 유니크한 값은 1,637개로 전체의 약 0.5%이며, `이름` 또한 1,275개로 선택도가 매우 좋습니다. 두 열을 결합할 경우 인덱스를 통해 매우 정밀한 타겟팅이 가능함에도 현재는 이를 활용하지 못하고 있습니다.

---

## 3. Optimization Strategy

### 복합 인덱스(Composite Index) 생성
`이름`과 `성` 열을 결합한 복합 인덱스를 생성하여 테이블 스캔을 인덱스 스캔으로 전환해야 합니다.

*   **권장 인덱스 구성**: `(성, 이름)` 또는 `(이름, 성)`
*   **선택 기준**: 통계 데이터상 `성` 열의 유니크 값(1,637)이 `이름`(1,275)보다 많으므로, 카디널리티가 더 높은 `성`을 선행 컬럼으로 배치하는 것이 유리할 수 있습니다.

```sql
/* 인덱스 생성문 */
CREATE INDEX I_사원_성_이름 ON 사원 (성, 이름);
```

---

## 4. Expected Impact

1.  **접근 방식 개선**: `type`이 `ALL`에서 `ref`로 변경됩니다.
2.  **스캔 범위 급감**: `rows` 수치가 299,246에서 단 몇 건(예: 1~10건 내외)으로 줄어들어 쿼리 속도가 비약적으로 향상됩니다.
3.  **I/O 효율성**: 데이터 페이지 전체를 읽는 대신 인덱스 페이지만 탐색한 후 필요한 데이터에 직접 액세스하므로 시스템 전체의 디스크 I/O 부하가 감소합니다.
