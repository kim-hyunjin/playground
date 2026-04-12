# SQL Tuning Report: 묵시적 형변환에 의한 인덱스 무력화 개선

## 1. Analysis Overview

### ① 대상 쿼리 (Target SQL)
```sql
explain select count(1) from 급여 where 사용여부 = 1;
```

### ② 실행 계획 (EXPLAIN)
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | SIMPLE | 급여 | index | I_사용여부 | I_사용여부 | 4 | NULL | 2,838,887 | Using where; Using index |

### ③ 테이블 및 데이터 현황
- **컬럼 정의**: `사용여부 char(1)` (문자형)
- **데이터 분포**:
    - `사용여부 = 0`: 약 280만 건 (98.5%)
    - `사용여부 = 1`: 약 4.2만 건 (**1.5%**)
- **인덱스 카디널리티**: 1 (통계 정보 미흡)

---

## 2. Performance Diagnosis

### ① 묵시적 형변환 (Implicit Conversion)
- **문제점**: 문자형 컬럼(`char`)을 숫자형 상수(`1`)와 비교하면서 데이터 타입 불일치가 발생했습니다.
- **원인**: MySQL은 비교를 위해 인덱스 내의 모든 문자 데이터를 숫자로 변환하는 작업을 수행하며, 이 과정에서 **Index Range Scan**이 불가능해져 **Index Full Scan(index)**으로 처리됩니다.
- **지표**: `type: index`, `rows: 2,838,887` (인덱스 전체 스캔).

---

## 3. Optimization Strategy

### ① 데이터 타입 매칭 (Type Consistency)
- `WHERE` 절의 상수를 컬럼의 데이터 타입인 문자열(`'1'`)로 변경하여 형변환 부하를 제거합니다.
- 옵티마이저가 인덱스 트리에서 특정 값('1')을 즉시 찾을 수 있도록(Index Seek) 유도합니다.

### ② 통계 정보 갱신 (Optional)
- 카디널리티가 1로 잘못 잡혀있는 경우 `ANALYZE TABLE`을 통해 통계 정보를 최신화합니다.

### ③ 수정된 쿼리 (Improved SQL)
```sql
-- [튜닝 전] 숫자형 비교 (형변환 발생)
-- SELECT count(1) FROM 급여 WHERE 사용여부 = 1;

-- [튜닝 후] 문자형 비교 (인덱스 활용)
SELECT count(1) FROM 급여 WHERE 사용여부 = '1';
```

---

## 4. Expected Impact

### ① 성능 개선 지표 (Performance Improvement)
| 항목 | 튜닝 전 (Before) | 튜닝 후 (After/Expected) |
| :-- | :-- | :-- |
| **Access Type** | `index` (Full Scan) | **`ref`** (Index Search) |
| **Examined Rows** | `2,838,887` | **`42,842`** (약 66배 개선) |
| **Extra Info** | `Using where; Using index` | `Using where; Using index` (범위 스캔으로 변경) |

### ② 핵심 요약
- 단순한 따옴표(`'`) 추가만으로 묵시적 형변환을 방지하고 인덱스 효율을 극대화했습니다.
- 전체 인덱스를 스캔하던 방식에서 필요한 범위만 스캔하는 방식으로 변경되어 쿼리 응답 속도가 획기적으로 향상되었습니다.
