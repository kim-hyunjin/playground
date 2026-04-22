# SQL Performance Tuning Report

## 1. Analysis Overview

### 대상 쿼리
```sql
select 이름, 성, 성별, 생년월일 
from 사원 
where lower(이름) = lower('MARY') 
  and 입사일자 >= str_to_date('1990-01-01', '%Y-%m-%d');
```

### 실행 계획(Execution Plan) 분석
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | **ALL** | I_입사일자 | NULL | NULL | NULL | 299,335 | **Using where** |

### 컬럼 메타데이터(Collation)
| column_name | collation_name | 특이사항 |
| :--- | :--- | :--- |
| 사원번호 | NULL | Primary Key |
| 생년월일 | NULL | |
| 이름 | **utf8mb3_bin** | 대소문자 구분 (Binary) |
| 성 | utf8mb3_general_ci | 대소문자 구분 안 함 |
| 성별 | utf8mb3_general_ci | 대소문자 구분 안 함 |
| 입사일자 | NULL | 인덱스(I_입사일자) 존재 |

---

## 2. Performance Diagnosis

### ① Full Table Scan (type: ALL)
- `사원` 테이블의 약 30만 건에 가까운 데이터를 전수 조사하고 있습니다.
- `possible_keys`에 `I_입사일자`가 존재함에도 불구하고 실제 사용된 `key`는 `NULL`입니다. 이는 옵티마이저가 인덱스를 타는 것보다 전체를 읽는 것이 효율적이라고 판단했거나, 인덱스 활용이 불가능한 조건이 포함되었음을 의미합니다.

### ② 인덱스 변형 (Function on Column)
- `lower(이름)`과 같이 인덱스 컬럼에 함수를 적용하면 옵티마이저가 해당 컬럼의 인덱스를 사용할 수 없습니다.
- 특히 `이름` 컬럼의 Collation이 `utf8mb3_bin`(대소문자 구분)으로 설정되어 있어, 대소문자 구분 없이 검색하기 위해 `lower()` 함수를 사용한 것으로 보이나, 이는 성능 저하의 결정적 원인이 됩니다.

---

## 3. Optimization Strategy

### 전략 1: 컬럼의 Collation 변경 (추천)
`이름` 컬럼을 대소문자 구분 없이 검색하는 것이 비즈니스 요구사항이라면, 해당 컬럼의 Collation을 `utf8mb3_general_ci`로 변경하고 `lower()` 함수를 제거해야 합니다.

```sql
-- 컬럼 속성 변경 (대소문자 구분 안 함으로 변경)
ALTER TABLE 사원 MODIFY 이름 VARCHAR(14) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;

-- 인덱스 생성 (이름, 입사일자 복합 인덱스)
CREATE INDEX IX_사원_이름_입사일자 ON 사원 (이름, 입사일자);
```

### 전략 2: 컬럼을 추가
이름의 대소문자를 유지해야한다면, 이름을 소문자로 저장하는 컬럼을 추가. 소문자_이름 컬럼의 콜레이션값은 기본 utf8_general_ci로 설정.(대소문자 구문 안함)
```sql
ALTER TABLE 사원 ADD COLUMN 소문자_이름 VARCHAR(14) NOT NULL AFTER 이름;
UPDATE 사원 SET 소문자_이름 = LOWER(이름);
ALTER TABLE 사원 ADD INDEX I_소문자이름(소문자_이름);

select 이름, 성, 성별, 생년월일 
from 사원 
where 소문자_이름 = 'MARY'
  and 입사일자 >= '1990-01-01'
```

---

## 4. Expected Impact

### 개선 후 실행 계획
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | **ref** | I_입사일자,I_소문자이름 | **I_소문자이름** | 44 | const | **224** | Using index condition; Using where |

1.  **접근 방식 개선**: `type: ALL` (전체 스캔) → `type: ref` (인덱스 참조 스캔)로 개선됩니다.
2.  **스캔 데이터 감소**: `rows` 수치가 **299,335건에서 224건**으로 급감하여 조회 성능이 약 1,300배 이상 향상됩니다.
3.  **CPU 부하 감소**: 인덱스 컬럼에 `lower()` 함수를 사용하지 않으므로 매 행마다 발생하던 연산 비용이 사라져 DB 자원을 효율적으로 사용하게 됩니다.
