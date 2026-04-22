# Partitioning


## Partitioning이란?

큰 테이블을 **동일한 스키마의 작은 테이블(파티션)들로 분할**하는 것.

### 예시

100만 행의 CUSTOMERS 테이블:

```sql
SELECT Name FROM CUSTOMERS_TABLE WHERE ID = 700001;
```

파티셔닝 없이는 100만 행을 모두 스캔해야 할 수 있다.

파티셔닝을 적용하면 5개의 파티션으로 분할:

| 파티션 | 범위 |
|--------|------|
| CUSTOMERS_200K | ID 1 ~ 200,000 |
| CUSTOMERS_400K | ID 200,001 ~ 400,000 |
| CUSTOMERS_600K | ID 400,001 ~ 600,000 |
| CUSTOMERS_800K | ID 600,001 ~ 800,000 |
| CUSTOMERS_1M | ID 800,001 ~ 1,000,000 |

`ID = 700,001`은 **CUSTOMERS_800K 파티션**에만 존재 → 해당 파티션만 스캔하면 됨

---

## Horizontal vs Vertical Partitioning

### Horizontal Partitioning (수평 파티셔닝)

- **행(Row)을 기준으로 분할**
- Range 또는 List 기반
- 가장 일반적인 파티셔닝 방식

### Vertical Partitioning (수직 파티셔닝)

- **열(Column)을 기준으로 분할**
- 큰 컬럼(예: BLOB)을 별도의 느린 스토리지의 자체 tablespace에 저장할 수 있음

---

## Partitioning Types

### 1. By Range (범위)

- 날짜, ID 등의 범위로 분할
- 예: `logdate` 또는 `customerid`의 from ~ to

### 2. By List (목록)

- 이산적인 값으로 분할
- 예: 주(state) - CA, AL 등 또는 우편번호

### 3. By Hash (해시)

- 해시 함수를 사용하여 분할 (consistent hashing)
- 데이터를 균등하게 분배

---

## Horizontal Partitioning vs Sharding

| 항목 | Horizontal Partitioning | Sharding |
|------|------------------------|----------|
| 분할 위치 | **같은 데이터베이스** 내 여러 테이블 | **여러 데이터베이스 서버**에 분산 |
| 클라이언트 인식 | 클라이언트는 모름 (agnostic) | 클라이언트 또는 미들웨어가 서버를 알아야 함 |
| 변경되는 것 | 테이블 이름 (또는 스키마) | 서버가 변경됨 (테이블은 동일) |

---

## Pros (장점)

- 단일 파티션 접근 시 **쿼리 성능 향상**
- Sequential scan vs scattered index scan
- **대량 데이터 로딩이 쉬움** (파티션 attach)
- 거의 접근하지 않는 오래된 데이터를 **저렴한 스토리지에 아카이빙** 가능

## Cons (단점)

- 행을 한 파티션에서 다른 파티션으로 이동하는 **업데이트가 느리거나 실패**할 수 있음
- 비효율적인 쿼리가 **모든 파티션을 스캔**하여 오히려 성능 저하
- **스키마 변경이 어려울 수 있음** (DBMS가 관리해주는 경우도 있음)
