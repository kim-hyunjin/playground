# SQL Tuning Report: 인덱스 컬럼 가공 개선

## 1. Analysis Overview

### 대상 쿼리
```sql
EXPLAIN 
SELECT * 
  FROM 사원 
 WHERE SUBSTRING(사원번호, 1, 4) = '1100' 
   AND LENGTH(사원번호) = 5;
```

### 실행 계획 (EXPLAIN) 결과
| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | 사원 | **ALL** | PRIMARY | NULL | NULL | NULL | 299512 | Using where |

---

## 2. Performance Diagnosis

### ⚠️ 주요 문제점
- **Access Type: ALL (Full Table Scan)**: `possible_keys`에 `PRIMARY`가 존재함에도 불구하고, 실제 인덱스를 전혀 활용하지 못하고 약 30만 건의 데이터를 전수 조사하고 있습니다.
- **Index Suppressing Error**: `WHERE` 절에서 인덱스 컬럼인 `사원번호`를 `SUBSTRING()`, `LENGTH()` 함수로 감싸서 가공했기 때문에 옵티마이저가 인덱스 트리를 탐색(Index Seek)할 수 없는 상태입니다.
- **연산 부하**: 모든 행에 대해 함수 연산을 수행하므로 CPU 자원 소모가 크며, 데이터량이 늘어날수록 성능이 선형적으로 저하됩니다.

---

## 3. Optimization Strategy

### 💡 쿼리 리팩토링 제안
인덱스 컬럼은 원형 그대로 유지하고, 비교 대상(우항)을 변경하여 **Index Range Scan**을 유도해야 합니다. '사원번호가 5자리이면서 앞 4자리가 1100'인 조건은 아래와 같이 범위 검색으로 치환 가능합니다.

#### 개선안 A: BETWEEN 연산자 사용 (권장)
```sql
SELECT * 
  FROM 사원 
 WHERE 사원번호 BETWEEN '11000' AND '11009';
```

#### 개선안 B: LIKE 연산자 사용 (문자열 타입인 경우)
```sql
SELECT * 
  FROM 사원 
 WHERE 사원번호 LIKE '1100_'; -- '_'는 임의의 한 글자를 의미
```

---

## 4. Expected Impact

수정 후 예상되는 실행 계획의 변화는 다음과 같습니다.

| 지표 | 개선 전 | 개선 후 (예상) | 비고 |
| :--- | :--- | :--- | :--- |
| **type** | ALL | **range** | Index Range Scan으로 전환 |
| **key** | NULL | **PRIMARY** | 기본키 인덱스 직접 활용 |
| **rows** | 299512 | **10** | 읽기 대상 행 수가 획기적으로 감소 |
| **Extra** | Using where | Using where | - |

### 요약
- **함수 사용 지양**: `WHERE` 절의 좌변(Column)에는 어떠한 가공도 하지 않는 것이 인덱스 활용의 핵심입니다.
- **데이터 타입 준수**: `사원번호`가 숫자 타입이라면 문자열 리터럴 대신 숫자(`11000`)를 사용하여 묵시적 형변환을 방지해야 합니다.
