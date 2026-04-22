# 복합인덱스 (Composite Indexes)

복합인덱스는 두 개 이상의 컬럼을 조합하여 생성하는 인덱스로, 다중 컬럼 인덱스(Multi-column Index)라고도 불립니다. 이 문서에서는 복합인덱스의 개념, 특징, 장단점 및 효과적인 사용 방법에 대해 설명합니다.

## 복합인덱스의 개념

복합인덱스는 여러 컬럼을 하나의 인덱스로 결합한 것으로, 인덱스 내에서 컬럼들의 순서가 중요한 의미를 갖습니다.

### 특징
- 두 개 이상의 컬럼으로 구성됨
- 컬럼 순서에 따라 검색 효율성이 달라짐
- B-Tree, Hash, GiST 등 다양한 인덱스 유형으로 구현 가능
- 인덱스 키의 일부분만 사용하는 검색도 가능 (왼쪽 접두사 규칙)

### 복합인덱스 구조
복합인덱스는 지정된 컬럼들의 값을 연결하여 정렬된 구조를 형성합니다. 예를 들어, (last_name, first_name)으로 구성된 복합인덱스는 먼저 last_name으로 정렬한 후, 같은 last_name 내에서 first_name으로 정렬됩니다.

## 복합인덱스의 장점

### 다중 조건 쿼리 최적화
- 여러 조건을 포함하는 WHERE 절에 효과적
- 단일 인덱스보다 선택성(Selectivity)이 높음
- 여러 개의 단일 컬럼 인덱스보다 효율적인 경우가 많음

### 정렬 및 그룹화 최적화
- ORDER BY 절의 컬럼 순서와 일치할 경우 정렬 연산 생략 가능
- GROUP BY 절의 컬럼들과 일치할 경우 그룹화 성능 향상

### 인덱스 커버링(Index Covering) 지원
- 쿼리에 필요한 모든 컬럼을 포함하면 테이블 접근 없이 인덱스만으로 쿼리 처리 가능
- I/O 비용 대폭 감소

### 저장 공간 효율성
- 여러 개의 단일 컬럼 인덱스보다 저장 공간을 적게 사용
- 인덱스 관리 오버헤드 감소

## 복합인덱스의 단점

### 컬럼 순서 의존성
- 첫 번째 컬럼이 조건에 포함되지 않으면 인덱스 효율 감소
- 컬럼 순서가 쿼리 패턴과 맞지 않으면 성능 저하

### 인덱스 크기 증가
- 포함된 컬럼이 많을수록 인덱스 크기 증가
- 인덱스 유지 관리 비용 증가

### 갱신 비용
- 인덱스에 포함된 컬럼이 수정될 때마다 인덱스 업데이트 필요
- 데이터 변경이 빈번한 테이블에서는 성능 저하 가능성

## 왼쪽 접두사 규칙 (Left-Prefix Rule)

복합인덱스에서 가장 중요한 개념 중 하나는 '왼쪽 접두사 규칙'입니다.

### 개념
- 복합인덱스는 왼쪽부터 순서대로 컬럼을 사용할 때 효과적
- 인덱스의 첫 번째 컬럼이 조건에 포함되지 않으면 인덱스가 효율적으로 사용되지 않음
- 중간 컬럼을 건너뛰고 마지막 컬럼만 조건으로 사용하면 인덱스 효율 감소

### 예시
(A, B, C) 복합인덱스가 있을 때:
- A, (A,B), (A,B,C) 조합은 인덱스를 효율적으로 사용
- B, C, (B,C) 조합은 인덱스를 효율적으로 사용하지 못함

## 복합인덱스 설계 전략

### 컬럼 순서 결정
1. **선택도(Selectivity) 고려**
   - 일반적으로 선택도가 높은(중복이 적은) 컬럼을 앞에 배치
   - 예외: 범위 조건이 사용되는 컬럼은 뒤에 배치

2. **쿼리 패턴 분석**
   - 자주 사용되는 WHERE 절의 조건 순서 고려
   - 동등 조건(=)으로 사용되는 컬럼을 앞에 배치
   - 범위 조건(>, <, BETWEEN)으로 사용되는 컬럼을 뒤에 배치

3. **정렬 요구사항 고려**
   - ORDER BY 절의 컬럼 순서와 일치하도록 설계
   - 정렬 방향(ASC/DESC)도 일치시키는 것이 중요

### 복합인덱스 vs 다중 인덱스
- 여러 개의 단일 컬럼 인덱스보다 적절한 복합인덱스가 효율적
- 단, 다양한 쿼리 패턴이 있는 경우 복합인덱스와 단일 인덱스의 조합 고려

### 인덱스 개수 최적화
- 너무 많은 인덱스는 성능 저하 초래
- 핵심 쿼리에 맞는 복합인덱스 설계
- 사용되지 않는 인덱스 주기적 검토 및 제거

## 복합인덱스 사용 예시

### 테이블 및 인덱스 생성
```sql
-- 사용자 테이블 생성
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    last_name VARCHAR(50),
    first_name VARCHAR(50),
    email VARCHAR(100),
    city VARCHAR(50),
    age INT,
    created_at TIMESTAMP
);

-- 복합인덱스 생성
CREATE INDEX idx_users_name ON users(last_name, first_name);
CREATE INDEX idx_users_location_age ON users(city, age);
CREATE INDEX idx_users_email_created ON users(email, created_at);
```

### 효율적인 쿼리 예시
```sql
-- 복합인덱스 idx_users_name을 효율적으로 사용
SELECT * FROM users WHERE last_name = 'Kim' AND first_name = 'Minho';
SELECT * FROM users WHERE last_name = 'Kim';  -- 부분 사용 가능

-- 복합인덱스 idx_users_location_age를 효율적으로 사용
SELECT * FROM users WHERE city = 'Seoul' AND age > 30;
SELECT * FROM users WHERE city = 'Seoul' ORDER BY age;

-- 인덱스 커버링 활용
SELECT last_name, first_name FROM users WHERE last_name = 'Park';  -- idx_users_name 활용
```

### 비효율적인 쿼리 예시
```sql
-- 첫 번째 컬럼(last_name)이 조건에 없어 idx_users_name 인덱스 효율 감소
SELECT * FROM users WHERE first_name = 'Jiyoung';

-- 첫 번째 컬럼(city)에 범위 조건을 사용하여 idx_users_location_age 인덱스 효율 감소
SELECT * FROM users WHERE city LIKE 'S%' AND age = 25;

-- OR 의 경우도 인덱스 사용 안함
SELECT * FROM users WHERE city = 'Seoul' OR age = 25;
-- 위의 경우 age에도 인덱스를 만든다면(idx_users_age) idx_users_location_age 인덱스에 대해 비트맵 인덱스 스캔,
-- idx_users_age 인덱스에 대해 비트맵 인덱스 스캔 후,
-- or 연산 진행
```

## 복합인덱스 성능 분석

### EXPLAIN 명령어 활용
```sql
-- 인덱스 사용 여부 및 방식 확인
EXPLAIN SELECT * FROM users WHERE last_name = 'Kim' AND first_name = 'Minho';
EXPLAIN SELECT * FROM users WHERE first_name = 'Minho';  -- 인덱스 사용 안 함
```

### 인덱스 사용 패턴 모니터링
- 데이터베이스 시스템의 인덱스 사용 통계 확인
- 사용되지 않는 인덱스 식별 및 제거
- 자주 사용되는 쿼리 패턴에 맞게 인덱스 최적화

## 데이터베이스별 복합인덱스 특징

### PostgreSQL
- B-tree, GiST, GIN, SP-GiST, BRIN 등 다양한 인덱스 유형 지원
- INCLUDE 절을 사용한 인덱스 커버링 지원
- 부분 인덱스(Partial Index)와 함께 사용 가능

### MySQL/MariaDB
- InnoDB에서는 클러스터형 인덱스 구조 사용
- 최대 16개 컬럼까지 복합인덱스 생성 가능
- 인덱스 힌트를 통한 인덱스 사용 제어 가능

### Oracle
- 함수 기반 인덱스와 결합 가능
- 인덱스 구성 가능(Index Organized Table)
- 비트맵 인덱스와 B-tree 인덱스 선택 가능

### SQL Server
- 필터링된 인덱스(Filtered Index) 지원
- 포함 컬럼(Included Columns)을 통한 인덱스 커버링
- 인덱스 뷰(Indexed Views)를 통한 성능 최적화

## 복합인덱스 관리 및 유지보수

### 인덱스 단편화(Fragmentation) 관리
- 주기적인 인덱스 재구성 또는 리빌드
- 단편화 수준 모니터링
- 대량 데이터 변경 후 인덱스 최적화

### 통계 정보 업데이트
- 데이터베이스 통계 정보 최신 상태 유지
- 쿼리 옵티마이저가 정확한 실행 계획을 수립하도록 지원

### 인덱스 사용량 모니터링
- 사용되지 않는 인덱스 식별
- 과도한 인덱스로 인한 성능 저하 방지
- 워크로드 변화에 따른 인덱스 조정

## 결론

복합인덱스는 다중 컬럼 조건을 포함하는 쿼리의 성능을 크게 향상시킬 수 있는 강력한 도구입니다. 효과적인 복합인덱스 설계를 위해서는 데이터 특성, 쿼리 패턴, 컬럼 선택도 등을 종합적으로 고려해야 합니다.

복합인덱스의 왼쪽 접두사 규칙을 이해하고, 컬럼 순서를 적절히 배치하는 것이 중요합니다. 또한, 인덱스 커버링을 활용하여 테이블 접근 없이 쿼리를 처리할 수 있도록 설계하면 성능을 더욱 향상시킬 수 있습니다.

데이터베이스 성능 최적화를 위해서는 복합인덱스의 특성을 이해하고, 워크로드에 맞게 인덱스를 설계하며, 주기적으로 인덱스 사용 패턴을 분석하고 최적화하는 것이 필수적입니다.