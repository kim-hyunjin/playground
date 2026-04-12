# SQL Tuning Report: 인덱스 컬럼 가공 개선 (Composite Index)

## 1. Analysis Overview

### ① 대상 쿼리 (Target SQL)
```sql
explain select * from 사원 where concat(성별, ' ', 성) = 'M Radwan';
```

### ② 실행 계획 (EXPLAIN)
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | SIMPLE | 사원 | **ALL** | NULL | NULL | NULL | NULL | 299,512 | Using where |

### ③ 인덱스 현황 (Index Info)
| Table | Key_name | Seq_in_index | Column_name | Index_type |
| :-- | :-- | :-- | :-- | :-- |
| 사원 | I_성별_성 | 1 | 성별 | BTREE |
| 사원 | I_성별_성 | 2 | 성 | BTREE |

---

## 2. Performance Diagnosis

### ① 인덱스 무력화 (Index Suppressing Error)
- **문제점**: `WHERE` 절에서 `CONCAT(성별, ' ', 성)` 함수를 사용하여 복합 인덱스(`I_성별_성`)의 구성 컬럼을 가공하였습니다.
- **원인**: MySQL 옵티마이저는 인덱스 컬럼 자체가 함수나 연산으로 변형되면, 인덱스 트리 내의 정렬된 값을 직접 비교할 수 없어 **Full Table Scan(ALL)**을 선택하게 됩니다.
- **지표**: `type: ALL`, `possible_keys: NULL`, `rows: 299,512` (전체 데이터 스캔).

---

## 3. Optimization Strategy

### ① 쿼리 리팩토링 (Query Refactoring)
- 가공된 `CONCAT` 조건을 개별 컬럼에 대한 동등 조건(`=`)으로 분리합니다.
- 복합 인덱스의 선두 컬럼(`성별`)부터 순서대로 조건을 부여하여 **Index Ref Scan**을 유도합니다.

### ② 수정된 쿼리 (Improved SQL)
```sql
-- [튜닝 전] Full Scan 발생
-- SELECT * FROM 사원 WHERE concat(성별, ' ', 성) = 'M Radwan';

-- [튜닝 후] Index Ref Scan 유도
SELECT * FROM 사원
WHERE 성별 = 'M'
  AND 성 = 'Radwan';
```

---

## 4. Expected Impact

### ① 성능 개선 지표 (Performance Improvement)
| 항목 | 튜닝 전 (Before) | 튜닝 후 (After/Expected) |
| :-- | :-- | :-- |
| **Access Type** | `ALL` (Full Table Scan) | **`ref`** (Index Search) |
| **Used Key** | `NULL` | **`I_성별_성`** |
| **Examined Rows** | `299,512` | **`102`** (약 2,900배 개선) |
| **Extra Info** | `Using where` | **`Using index condition`** |

### ② 핵심 요약
- 인덱스 컬럼의 좌변(Left-Hand Side) 가공을 제거하여 **Index Seek**가 가능해졌습니다.
- 복합 인덱스의 정렬 구조를 그대로 활용함으로써 불필요한 전체 테이블 스캔 부하를 제거하고 응답 속도를 극대화했습니다.
