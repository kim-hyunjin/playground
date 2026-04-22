# SQL Performance Tuning Report

## 1. Analysis Overview

### 대상 쿼리
```sql
SELECT * 
  FROM 사원 
 WHERE 이름 = 'Matt' 
    OR 입사일자 = '1987-03-31';
```

### 실행 계획 (EXPLAIN) 분석
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | **ALL** | I_입사일자 | NULL | NULL | NULL | **299335** | Using where |

### 인덱스 현황 (SHOW INDEX)
| Key_name | Column_name | Seq_in_index | Cardinality |
| :--- | :--- | :--- | :--- |
| PRIMARY | 사원번호 | 1 | 299335 |
| I_입사일자 | 입사일자 | 1 | 5,073 |
| I_성별_성 | 성별, 성 | 1, 2 | 1, 3,440 |

### 데이터 통계 (Count)
*   전체 데이터: **300,024건**
*   `이름 = 'Matt'`: **233건** (0.07%)
*   `입사일자 = '1987-03-31'`: **111건** (0.03%)

---

## 2. Performance Diagnosis

### ① OR 조건에 의한 인덱스 활용 실패
*   `입사일자` 열에는 인덱스(`I_입사일자`)가 존재하지만, `이름` 열에는 인덱스가 없습니다.
*   `OR` 연산자는 모든 조건이 인덱스를 사용할 수 있어야 최적화가 가능합니다. 한쪽 조건(`이름`)이 인덱스가 없으면, 결국 해당 행을 찾기 위해 전체 테이블을 읽어야 하므로 옵티마이저는 인덱스 대신 **Full Table Scan (type: ALL)**을 선택합니다.

### ② 비효율적인 스캔 범위
*   단 344건(233 + 111) 정도의 데이터를 찾기 위해 약 30만 건의 전체 데이터를 읽고 있어 자원 낭비가 매우 심각합니다.

---

## 3. Optimization Strategy

### 방법 1: 이름 열 인덱스 추가 및 Index Merge 유도
가장 근본적인 해결책은 `이름` 열에 인덱스를 생성하는 것입니다. 두 열 모두 인덱스가 있으면 MySQL은 `index_merge` 알고리즘을 사용하여 각각의 인덱스를 검색한 후 결과를 합칩니다.

```sql
/* 이름 인덱스 생성 */
CREATE INDEX I_사원_이름 ON 사원 (이름);
```

### 방법 2: UNION 연산자로 쿼리 리팩토링
인덱스를 추가한 후, 옵티마이저가 `index_merge`를 선택하지 않거나 더 명확한 실행 계획을 보장받고 싶다면 `UNION`을 사용할 수 있습니다.

```sql
/* UNION을 활용한 쿼리 수정 */
SELECT * FROM 사원 WHERE 이름 = 'Matt'
UNION
SELECT * FROM 사원 WHERE 입사일자 = '1987-03-31';
```
*   `UNION`은 내부적으로 `DISTINCT` 처리를 포함하므로 `OR`와 동일한 결과를 보장합니다.
*   첫 번째 쿼리는 `I_사원_이름` 인덱스를, 두 번째 쿼리는 `I_입사일자` 인덱스를 각각 개별적으로 활용하게 됩니다.

---

## 4. Expected Impact

1.  **실행 방식 전환**: `Full Table Scan`에서 `Index Range Scan`으로 변경됩니다.
2.  **rows 수치 감소**: 299,335건에서 약 344건 내외로 스캔 범위가 **약 870배 축소**됩니다.
3.  **응답 속도 개선**: 수백 밀리초(ms) 이상 소요되던 쿼리가 수 밀리초 이내로 즉시 처리됩니다.
