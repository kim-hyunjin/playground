# SQL Tuning Report: GROUP BY 순서 불일치에 의한 정렬 부하 개선

## 1. Analysis Overview

### ① 대상 쿼리 (Target SQL)
```sql
explain select 성, 성별, count(1) as 카운트 from 사원 group by 성, 성별;
```

### ② 실행 계획 (EXPLAIN)
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | SIMPLE | 사원 | **index** | NULL | **I_성별_성** | 51 | NULL | 299,512 | **Using index; Using temporary; Using filesort** |

### ③ 인덱스 현황 (Index Info)
| Table | Key_name | Seq_in_index | Column_name | Cardinality |
| :-- | :-- | :-- | :-- | :-- |
| 사원 | I_성별_성 | **1** | **성별** | 1 |
| 사원 | I_성별_성 | **2** | **성** | 3,442 |

---

## 2. Performance Diagnosis

### ① 인덱스 구성과 GROUP BY 순서의 불일치
- **문제점**: `GROUP BY 성, 성별` 절의 컬럼 순서가 실제 사용된 복합 인덱스(`I_성별_성`)의 컬럼 구성 순서(`성별, 성`)와 일치하지 않습니다.
- **원인**: 인덱스는 이미 `성별` 기준으로 정렬된 후 그 안에서 `성`으로 정렬되어 있습니다. 하지만 쿼리는 `성`으로 먼저 그룹핑하기를 원하므로, 옵티마이저는 이미 정렬된 인덱스를 그대로 활용하지 못하고 데이터를 다시 재정렬해야 합니다.
- **지표**: `Extra` 필드의 **`Using temporary; Using filesort`**. 그룹핑 결과를 도출하기 위해 별도의 임시 공간에 데이터를 담고 다시 정렬하는 무거운 연산이 발생하고 있음을 나타냅니다.

---

## 3. Optimization Strategy

### ① GROUP BY 컬럼 순서 조정 (Column Reordering)
- 단순 통계 목적이나 결과의 순서가 중요하지 않다면, `GROUP BY`의 순서를 복합 인덱스의 구성 순서인 **`성별, 성`**으로 변경합니다.
- 이렇게 하면 옵티마이저는 인덱스의 정렬된 상태를 그대로 읽으면서 카운트를 수행할 수 있어, 임시 테이블 생성과 정렬 과정을 생략할 수 있습니다.

### ② 수정된 쿼리 (Improved SQL)
```sql
-- [튜닝 전] 인덱스 순서와 불일치 (정렬 부하 발생)
-- SELECT 성, 성별, count(1) FROM 사원 GROUP BY 성, 성별;

-- [튜닝 후] 인덱스 순서(성별, 성)에 맞춰 수정
SELECT 성, 성별, count(1) as 카운트 
FROM 사원 
GROUP BY 성별, 성;
```

---

## 4. Expected Impact

### ① 성능 개선 지표 (Performance Improvement)
| 항목 | 튜닝 전 (Before) | 튜닝 후 (After/Expected) |
| :-- | :-- | :-- |
| **Extra Info** | `Using temporary; Using filesort` | **`Using index`** |
| **정렬 작업** | **필요 (CPU/메모리 부하)** | **불필요 (이미 정렬됨)** |
| **응답 속도** | 느림 (임시 테이블 생성) | **매우 빠름** |

### ② 핵심 요약
- **정렬 부하 제거**: `Using temporary`와 `Using filesort`가 제거되면서 시스템 자원 소모가 획기적으로 줄어듭니다.
- **커버링 인덱스 활용 극대화**: `Using index` 상태에서 정렬 부하까지 사라지므로, 데이터 스캔과 동시에 결과를 즉시 반환하는 최적의 상태가 됩니다.
